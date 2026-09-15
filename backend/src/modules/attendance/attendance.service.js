import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { buildClassroomFilter } from "../../utils/classroom.utils.js";
import { year } from "../../utils/date.utils.js";
import { mappersUtils } from "../../utils/mappers.utils.js";
import { validateUtils } from "../../utils/validate.utils.js";
import { classroomStudentFields } from "../classroomStudent/classroomStudent.fields.js";
import { parentService } from "../parent/parent.service.js";
import { studentService } from "../student/student.service.js";
import { userService } from "../user/user.service.js";
import { attendanceFields } from "./attendance.fields.js";
import { schoolDateUtils } from "../../utils/schoolDate.js";
import { academicPeriodService } from "../academicPeriod/academicPeriod.service.js";

const attendanceService = {
  create: async ({ status, note, idStudent }, idAuxiliar) => {
    const student = await studentService.getById({ idStudent });
    if (
      [
        "SUSPENDIDO",
        "EXPULSADO",
        "TRANSFERIDO",
        "RETIRADO",
        "INACTIVO",
      ].includes(student.status)
    ) {
      throw new AppError(
        "El estudiante no tiene un estado válido para registrar asistencia",
        400,
        [
          {
            field: "idStudent",
            message: `El estudiante tiene un estado ${student.status} que no permite registrar asistencia`,
          },
        ],
      );
    }

    const startOfDay = new Date()
    startOfDay.setHours(0,0,0,0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);
    
    const existingAttendance =await prisma.attendance.findFirst({
      where: {
        idStudent,
        date : {
          gte : startOfDay,
          lt: endOfDay,
        },
      },
      select : {
        idAttendance :  true,
      },
    });

    if (existingAttendance) {
      throw new AppError(
        "El estudiante ya tiene una asistencia registrada hoy",
      400,
      [
        {
          field: "idStudent",
          message:
            "Ya existe un registro de asistencia para este estudiante hoy",
        },
      ],
      )
    }
    const queryResult = await prisma.$transaction(async (prisma) => {
      const attendance = await prisma.attendance.create({
        data: {
          date: new Date(),
          status,
          note,
          idStudent,
          idAuxiliar,
        },
        select: attendanceFields.create,
      });
      return { attendance };
    });

    return queryResult.attendance;
  },


  get: async ({
    page,
    limit,
    sortOrder,
    sortBy,
    search,
    date,
    grade,
    section,
    idAuxiliar,
  }) => {
    const targetDate = date
      ? new Date(`${date}T00:00:00`)
      : new Date();

    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const classroomFilter = buildClassroomFilter({
      idAuxiliar,
      grade,
      section,
    });

    const studentFilter = {
      status: "ACTIVO",
    };

    if (search) {
      studentFilter.OR = [
        {
          firstname: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          lastname: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          dni: {
            contains: search,
          },
        },
      ];
    }

    const where = {
      classroom: classroomFilter,
      student: studentFilter,
    };

    const [classroomStudents, total] = await Promise.all([
      prisma.classroomStudent.findMany({
        where,
        orderBy: validateUtils.buildOrderBy(
          sortBy,
          sortOrder
        ),
        skip: (page - 1) * limit,
        take: limit,
        select: classroomStudentFields.select,
      }),

      prisma.classroomStudent.count({
        where,
      }),
    ]);

    const idStudents = classroomStudents.map(
      (cs) => cs.student.idStudent
    );

    const attendances = idStudents.length
      ? await prisma.attendance.findMany({
        where: {
          idStudent: {
            in: idStudents,
          },
          date: {
            gte: targetDate,
            lt: nextDay,
          },
        },
        select: {
          idAttendance: true,
          date: true,
          status: true,
          note: true,
          idStudent: true,
        },
      })
      : [];

    const attendanceMap = new Map(
      attendances.map((a) => [
        a.idStudent,
        a,
      ])
    );

    const roster = classroomStudents.map((cs) => {
      const formatted =
        mappersUtils.formatClassroomStudent(cs);

      const attendance =
        attendanceMap.get(cs.student.idStudent);

      return {
        ...formatted,
        idAttendance:
          attendance?.idAttendance ?? null,
        status:
          attendance?.status ?? null,
        date:
          attendance?.date ?? null,
        note:
          attendance?.note ?? null,
      };
    });

    return {
      attendances: roster,
      total,
    };
  },
  // grados y secciones disponibles para los filtros del frontend.
  getFilterOptions: async ({ idAuxiliar } = {}) => {
    const where = { status: "ACTIVO" };
    if (idAuxiliar) {
      where.classroomAuxiliars = { some: { idAuxiliar } };
    }

    const classrooms = await prisma.classroom.findMany({
      where,
      select: {
        section: {
          select: {
            name: true,
            grade: { select: { level: true } },
          },
        },
      },
    });

    const gradesMap = new Map();
    const sectionsMap = new Map();

    for (const c of classrooms) {
      const level = c.section?.grade?.level;
      const name = c.section?.name;
      if (level !== undefined && level !== null) gradesMap.set(level, { level });
      if (name !== undefined && name !== null) sectionsMap.set(name, { name });
    }

    return {
      grades: Array.from(gradesMap.values()).sort((a, b) => a.level - b.level),
      sections: Array.from(sectionsMap.values()).sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    };
  },

  getById: async ({ idAttendance }) => {
    const attendance = await prisma.attendance.findUnique({
      where: { idAttendance },
      select: attendanceFields.select,
    });

    if (!attendance) {
      throw new AppError("Asistencia no encontrada", 404, [
        {
          field: "idAttendance",
          message: "No existe un registro con el ID proporcionado",
        },
      ]);
    }

    return attendance;
  },

  update: async ({ idAttendance, data }) => {
    const queryResult = await prisma.$transaction(async (prisma) => {
      const attendance = await prisma.attendance.update({
        where: { idAttendance },
        data,
        select: attendanceFields.select,
      });

      if (!attendance) {
        throw new AppError("Asistencia no encontrada", 404, [
          {
            field: "idAttendance",
            message: "No existe un registro con el ID proporcionado",
          },
        ]);
      }

      return { attendance };
    });

    return queryResult.attendance;
  },

  delete: async ({ idAttendance }) => {
    const deletedAttendance = await prisma.attendance.delete({
      where: { idAttendance },
      select: attendanceFields.select,
    });

    return deletedAttendance;
  },

  getByIdStudent: async ({ idStudent }) => {
    const attendance = await prisma.attendance.findMany({
      where: {
        idStudent,
      },
    });

    if (!attendance || attendance.length === 0) {
      throw new AppError("Registro no encontrado", 404, [
        {
          field: "idStudent",
          message: "No existen asistencias registradas para este estudiante",
        },
      ]);
    }

    return attendance;
  },

  getCountToday: async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    const total = await prisma.attendance.count({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    return total;
  },

  countByIdStudent: async ({ idStudent }) => {
    const late = await prisma.attendance.count({
      where: {
        idStudent,
        status: "TARDANZA",
      },
    });

    const total = await prisma.attendance.count({
      where: {
        idStudent,
      },
    });

    return { total, late };
  },

  getByWeekSummary: async ({ idStudent }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Lunes de esta semana
    const weekStart = new Date(today);
    const day = today.getDay(); // 0=domingo, 1=lunes...
    const diffToMonday = day === 0 ? -6 : 1 - day; // si es domingo, retrocede 6
    weekStart.setDate(today.getDate() + diffToMonday);

    // Mañana (para incluir hoy completo)
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const attendances = await prisma.attendance.findMany({
      where: {
        idStudent,
        date: { gte: weekStart, lt: tomorrow },
      },
      select: {
        date: true,
        status: true,
      },
      orderBy: { date: "asc" },
    });

    return { attendances };
  },

  getAttendanceSummaryByGrade: async () => {
    const today = new Date();

    // Solo la fecha (00:00:00)
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Estudiantes matriculados actualmente
    const classroomStudents = await prisma.classroomStudent.findMany({
      where: {
        classroom: {
          status: "ACTIVO",
        },
        student: {
          status: "ACTIVO",
        },
      },
      select: {
        classroom: {
          select: {
            section: {
              select: {
                grade: {
                  select: {
                    level: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Asistencias de hoy
    const attendances = await prisma.attendance.findMany({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
        student: {
          status: "ACTIVO",
        },
      },
      select: {
        status: true,
        student: {
          select: {
            classroomStudents: {
              where: {
                classroom: {
                  status: "ACTIVO",
                },
              },
              select: {
                classroom: {
                  select: {
                    section: {
                      select: {
                        grade: {
                          select: {
                            level: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    const summary = {};

    // Total de estudiantes por grado
    for (const cs of classroomStudents) {
      const level = cs.classroom.section.grade.level;

      if (!summary[level]) {
        summary[level] = {
          level,
          grade: `${level}° Grado`,
          total: 0,
          present: 0,
          late: 0,
          justified: 0,
          absent: 0,
        };
      }
      summary[level].total++;
    }

    // Contar asistencias
    for (const att of attendances) {
      const level =
        att.student.classroomStudents[0]?.classroom?.section?.grade?.level;

      if (!level) continue;
      switch (att.status) {
        case "PRESENTE":
          summary[level].present++;
          break;
        case "TARDANZA":
          summary[level].late++;
          break;
        case "JUSTIFICADA":
          summary[level].justified++;
          break;
      }
    }

    // Calcular faltas
    for (const item of Object.values(summary)) {
      item.absent = item.total - item.present - item.late - item.justified;
    }
    return Object.values(summary).sort((a, b) => a.level - b.level);
  },

  getAttendanceSummaryToday: async ({
    idAuxiliar,
    grade,
    section,
    date,
  } = {}) => {
    
    // Fecha a consultar
    const targetDate = date
      ? new Date(`${date}T00:00:00`)
      : new Date();
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Mismo universo de estudiantes que /attendance
    const classroomFilter = buildClassroomFilter({
      idAuxiliar,
      grade,
      section,
    });
    const whereStudents = {
      classroom: classroomFilter,
      student: {
        status: "ACTIVO",
      },
    };

    const classroomStudents =
      await prisma.classroomStudent.findMany({
        where: whereStudents,
        select: {
          student: {
            select: {
              idStudent: true,
            },
          },
        },
      });

    const studentIds = classroomStudents.map(
      (cs) => cs.student.idStudent
    );

    // Si no hay estudiantes
    if (studentIds.length === 0) {
      return {
        present: 0,
        late: 0,
        justified: 0,
        absent: 0,
        total: 0,
      };
    }

    const attendances =
      await prisma.attendance.findMany({
        where: {
          idStudent: {
            in: studentIds,
          },
          date: {
            gte: targetDate,
            lt: nextDay,
          },
        },
        select: {
          idAttendance: true,
          idStudent: true,
          status: true,
          date: true,
        },
        orderBy: {
          date: "desc",
        },
      });

    const attendanceMap = new Map();
    for (const attendance of attendances) {
      if (!attendanceMap.has(attendance.idStudent)) {
        attendanceMap.set(
          attendance.idStudent,
          attendance
        );
      }
    }

    const summary = {
      present: 0,
      late: 0,
      justified: 0,
      absent: 0,
      total: studentIds.length,
    };

    for (const idStudent of studentIds) {
      const attendance =
        attendanceMap.get(idStudent);
      if (!attendance) {
        summary.absent++;
        continue;
      }

      switch (attendance.status) {
        case "PRESENTE":
          summary.present++;
          break;
        case "TARDANZA":
          summary.late++;
          break;
        case "JUSTIFICADA":
          summary.justified++;
          break;
        case "FALTA":
          summary.absent++;
          break;
        default:
          summary.absent++;
          break;
      }
    }

    return summary;
  },

  countByStatusTodayById: async ({ status, idStudent }) => {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    return prisma.attendance.count({
      where: {
        idStudent,
        status,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
    });
  },

  /**
   * Verifica que idStudent realmente pertenezca a idParent.
   * Lanza 403 si no hay relación StudentParent entre ambos.
   */
  verifyStudentOwnership: async ({ idParent, idStudent }) => {
    const link = await prisma.studentParent.findFirst({
      where: { idParent, idStudent },
      select: { idStudentParent: true },
    });

    if (!link) {
      throw new AppError("No autorizado", 403, [
        { field: "idStudent", message: "Este estudiante no pertenece a tu cuenta" },
      ]);
    }
  },

  /**
   * % de asistencia de un estudiante en un rango [start, end] inclusive,
   * usando solo días de clase reales (sin fines de semana ni NonSchoolDay).
   * Si el rango termina en el futuro, se recorta a "hoy".
   */
  getAttendanceAverageForRange: async ({ idStudent, start, end }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cappedEnd = end < today ? end : today;

    if (cappedEnd < start) {
      return { percentage: 0, schoolDays: 0, attendedDays: 0 };
    }

    const schoolDays = await schoolDateUtils.getSchoolDaysInRange(start, cappedEnd);

    if (schoolDays.length === 0) {
      // No han transcurrido días de clase todavía en este rango (ej. bimestre que recién empieza)
      return { percentage: 0, schoolDays: 0, attendedDays: 0 };
    }

    const rangeEndExclusive = new Date(cappedEnd);
    rangeEndExclusive.setDate(rangeEndExclusive.getDate() + 1);

    const attendedDays = await prisma.attendance.count({
      where: {
        idStudent,
        date: { gte: start, lt: rangeEndExclusive },
        status: { in: ["PRESENTE", "TARDANZA", "JUSTIFICADA"] },
      },
    });

    const percentage = Math.round((attendedDays / schoolDays.length) * 100);

    return { percentage, schoolDays: schoolDays.length, attendedDays };
  },

  getWeeklyAverage: async ({ idStudent }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const day = today.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() + diffToMonday);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 4); // viernes

    return attendanceService.getAttendanceAverageForRange({
      idStudent,
      start: weekStart,
      end: weekEnd,
    });
  },

  getBimesterAverage: async ({ idStudent, period }) => {
    return attendanceService.getAttendanceAverageForRange({
      idStudent,
      start: new Date(period.startDate),
      end: new Date(period.endDate),
    });
  },

  /**
   * Promedio anual = promedio simple de los % de cada bimestre YA INICIADO del año.
   * Los bimestres futuros (que aún no empiezan) no se cuentan.
   */
  getAnnualAverage: async ({ idStudent, year }) => {
    const [periods] = await academicPeriodService.get({
      page: 1,
      limit: 12,
      sortBy: "bimester",
      sortOrder: "asc",
      year,
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startedPeriods = periods.filter((p) => new Date(p.startDate) <= today);

    if (startedPeriods.length === 0) {
      return { percentage: 0, periods: [] };
    }

    const results = await Promise.all(
      startedPeriods.map((p) => attendanceService.getBimesterAverage({ idStudent, period: p })),
    );

    const percentage = Math.round(
      results.reduce((sum, r) => sum + r.percentage, 0) / results.length,
    );

    return { percentage, periods: results };
  },

  /**
   * Resuelve el rango de fechas [start, end] según el filtro de período
   * usado en la pestaña Asistencia del padre.
   */
  resolveParentDetailRange: async ({ period }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (period === "WEEK") {
      const day = today.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      const start = new Date(today);
      start.setDate(today.getDate() + diffToMonday);
      const end = new Date(start);
      end.setDate(start.getDate() + 4);
      return { start, end };
    }

    if (period === "BIMESTER") {
      const current = await academicPeriodService.getCurrent();
      return { start: new Date(current.startDate), end: new Date(current.endDate) };
    }

    if (period === "YEAR") {
      const currentYear = today.getFullYear();
      return { start: new Date(`${currentYear}-01-01`), end: new Date(`${currentYear}-12-31`) };
    }

    // Sin filtro (ALL): desde el bimestre más antiguo registrado hasta hoy
    const earliestPeriod = await prisma.academicPeriod.findFirst({
      orderBy: { startDate: "asc" },
      select: { startDate: true },
    });
    const start = earliestPeriod
      ? new Date(earliestPeriod.startDate)
      : new Date(`${today.getFullYear()}-01-01`);

    return { start, end: today };
  },

  /**
   * Detalle de asistencia para la pestaña "Asistencia" del padre.
   * Genera una fila por CADA día de clase real en el rango (con o sin registro),
   * marcando null (sin registro) como "FALTA" — igual que ya se hace en el front.
   */
  getAttendanceDetailByParent: async ({ idParent, idStudent, status, period, page, limit }) => {
    await attendanceService.verifyStudentOwnership({ idParent, idStudent });

    const { start, end } = await attendanceService.resolveParentDetailRange({ period });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cappedEnd = end < today ? end : today;

    const schoolDays = await schoolDateUtils.getSchoolDaysInRange(start, cappedEnd);

    const rangeEndExclusive = new Date(cappedEnd);
    rangeEndExclusive.setDate(rangeEndExclusive.getDate() + 1);

    const records = await prisma.attendance.findMany({
      where: { idStudent, date: { gte: start, lt: rangeEndExclusive } },
      select: { idAttendance: true, date: true, status: true, note: true },
    });

    const recordMap = new Map(
      records.map((r) => [schoolDateUtils.toDateOnly(r.date).getTime(), r]),
    );

    const fullList = schoolDays
      .map((day) => {
        const record = recordMap.get(day.getTime());
        return {
          date: day,
          idAttendance: record?.idAttendance ?? null,
          status: record?.status ?? null, // null = "FALTA" en el front
          time: record?.date ?? null,
          note: record?.note ?? null,
        };
      })
      .sort((a, b) => b.date - a.date); // más reciente primero

    // Conteos SIEMPRE sobre el rango completo (para los tabs Todos/Presentes/Ausentes/Tardanzas)
    const counts = {
      total: fullList.length,
      present: fullList.filter((r) => r.status === "PRESENTE").length,
      late: fullList.filter((r) => r.status === "TARDANZA").length,
      justified: fullList.filter((r) => r.status === "JUSTIFICADA").length,
      absent: fullList.filter((r) => r.status === null).length,
    };

    // Filtro de estado (solo afecta la tabla, no los conteos de arriba)
    let filtered = fullList;
    if (status === "FALTA") filtered = fullList.filter((r) => r.status === null);
    else if (status) filtered = fullList.filter((r) => r.status === status);

    const stats = {
      schoolDaysRegistered: counts.total,
      attendances: counts.present + counts.late + counts.justified,
      absences: counts.absent,
      attendanceRate: counts.total
        ? Math.round(((counts.present + counts.late + counts.justified) / counts.total) * 100)
        : 0,
    };

    const total = filtered.length;
    const rows = filtered.slice((page - 1) * limit, (page - 1) * limit + limit);

    return { stats, counts, rows, total };
  },

  // Resumen de asistencia por padre. La conducta/comportamiento ya NO vive
  // aquí: se movió por completo al módulo `behavior`.
  getAttendanceSummaryByParent: async ({ idParent }) => {
    const parent = await userService.getById(idParent);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const currentYear = today.getFullYear();
    const startYear = new Date(currentYear, 0, 1);
    const endYear = new Date(currentYear + 1, 0, 1);

    const students = await parentService.getStudents({
      idParent: parent.idUser,
    });
    const studentIds = students.map((item) => item.student.idStudent);

    // Asistencia de hoy
    const attendancesToday = await prisma.attendance.findMany({
      where: {
        idStudent: { in: studentIds },
        date: { gte: today, lt: tomorrow },
      },
      select: {
        idStudent: true,
        status: true,
      },
    });

    // Total de tardanzas del año por estudiante
    const delays = await prisma.attendance.groupBy({
      by: ["idStudent"],
      where: {
        idStudent: { in: studentIds },
        status: "TARDANZA",
        date: { gte: startYear, lt: endYear },
      },
      _count: { idAttendance: true },
    });

    const attendanceMap = new Map(
      attendancesToday.map((a) => [a.idStudent, a.status]),
    );
    const delayMap = new Map(
      delays.map((d) => [d.idStudent, d._count.idAttendance]),
    );

    const weekSummaries = await Promise.all(
      studentIds.map((idStudent) =>
        attendanceService.getByWeekSummary({ idStudent }),
      ),
    );

    const weekMap = new Map(
      studentIds.map((id, i) => [id, weekSummaries[i].attendances]),
    );

    // Bimestre actual (si no hay uno configurado, los % bimestrales quedan en 0)
    let currentPeriod = null;
    try {
      currentPeriod = await academicPeriodService.getCurrent();
    } catch {
      currentPeriod = null;
    }

    const studentsSummary = await Promise.all(
      students.map(async ({ student }) => {
        const { attendanceLate, total } = {
          attendanceLate: await prisma.attendance.count({
            where: {
              idStudent: student.idStudent,
              status: "TARDANZA",
              date: {
                gte: startYear,
                lt: endYear,
              },
            },
          }),
          total: await prisma.attendance.count({
            where: {
              idStudent: student.idStudent,
            },
          }),
        };

        // Promedios: semanal (basado en días de clase reales), bimestral y anual
        const [weekAvg, annualAvg] = await Promise.all([
          attendanceService.getWeeklyAverage({ idStudent: student.idStudent }),
          attendanceService.getAnnualAverage({ idStudent: student.idStudent, year: currentYear }),
        ]);

        const bimesterAvg = currentPeriod
          ? await attendanceService.getBimesterAverage({
              idStudent: student.idStudent,
              period: currentPeriod,
            })
          : { percentage: 0 };

        return {
          idStudent: student.idStudent,
          firstname: student.firstname,
          lastname: student.lastname,
          dni: student.dni,
          phone: student.phone,
          email: student.email,
          status: student.status,
          attendanceToday: attendanceMap.get(student.idStudent) ?? "FALTA",
          totalDelaysYear: delayMap.get(student.idStudent) ?? 0,
          averageAttendanceWeek: weekAvg.percentage,
          averageAttendanceBimester: bimesterAvg.percentage,
          averageAttendanceYear: annualAvg.percentage,
          daysPresent: {
            total: total,
            late: attendanceLate,
          },
          attendanceWeek: weekMap.get(student.idStudent) ?? [],
        };
      }),
    );

    return { studentsSummary };
  },
};

export { attendanceService };

/*

model Attendance {
  idAttendance Int              @id @default(autoincrement())
  date         DateTime
  status       StatusAssistance @default(PRESENTE)
  note         String?          @db.VarChar(100)
  idStudent    Int
  idAuxiliar   Int

  student  Student @relation(fields: [idStudent], references: [idStudent])
  auxiliar User    @relation(fields: [idAuxiliar], references: [idUser])

  @@index([idStudent])
  @@index([idAuxiliar])
  @@index([date])
  @@index([idStudent, date])
}

*/