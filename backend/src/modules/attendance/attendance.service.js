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

  // Resumen de asistencia por padre. La conducta/comportamiento ya NO vive
  // aquí: se movió por completo al módulo `behavior`.
  getAttendanceSummaryByParent: async ({ idParent }) => {
    const parent = await userService.getById(idParent);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = today.getFullYear();
    const startYear = new Date(year, 0, 1);
    const endYear = new Date(year + 1, 0, 1);

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

        const attendancesWeekTotal = await prisma.attendance.count({
          where: {
            idStudent: student.idStudent,
            date: { gte: weekStart, lt: tomorrow },
          },
        });

        const averageAttendanceWeek = Math.round(
          (Number(attendancesWeekTotal) * 100) / 5,
        );

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
          averageAttendanceWeek,
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