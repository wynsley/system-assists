import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { year } from "../../utils/date.utils.js";
import { mappersUtils } from "../../utils/mappers.utils.js";
import { searchUtils } from "../../utils/search.utils.js";
import { validateUtils } from "../../utils/validate.utils.js";
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

  get: async ({ page, limit, sortOrder, sortBy, search, date }) => {
    const where = searchUtils.buildSearchWhere({
      search,
      numberFields: ["idAttendance", "idStudent", "idAuxiliar"],
      stringFields: ["note"],
      relationStringFields: [
        { relation: "student", field: "firstname" },
        { relation: "student", field: "lastname" },
        { relation: "student", field: "dni" },
        { relation: "auxiliar", field: "firstname" },
        { relation: "auxiliar", field: "lastname" },
      ],
      filters: {
        date,
      },
    });

    const [attendances, total] = await Promise.all([
      prisma.attendance.findMany({
        where,
        orderBy: validateUtils.buildOrderBy(sortBy, sortOrder),
        skip: (page - 1) * limit,
        take: limit,
        select: attendanceFields.select,
      }),
      prisma.attendance.count({ where }),
    ]);

    return {
      attendances: attendances.map(mappersUtils.formatAttendance),
      total,
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
      item.absent = item.students - item.present - item.late - item.justified;
    }

    return Object.values(summary).sort((a, b) => a.level - b.level);
  },

  getAttendanceSummaryToday: async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Total de estudiantes activos
    const totalStudents = await prisma.student.count({
      where: {
        status: "ACTIVO",
      },
    });

    // Asistencias de hoy
    const attendances = await prisma.attendance.findMany({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
      select: {
        status: true,
      },
    });

    const summary = {
      present: 0,
      late: 0,
      justified: 0,
      absent: 0,
    };

    // Contar asistencias
    for (const att of attendances) {
      switch (att.status) {
        case "PRESENTE":
          summary.present++;
          break;

        case "TARDANZA":
          summary.late++;
          break;

        case "JUSTIFICADA":
          summary.justified++;
          break;
      }
    }

    // Calcular faltas
    summary.absent =
      totalStudents - summary.present - summary.late - summary.justified;

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

  getBehaviorSummaryToday: async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const students = await prisma.student.findMany({
      where: {
        status: "ACTIVO",
      },
      select: {
        incidents: {
          include: {
            incidentCatalog: {
              select: {
                pointsDeducted: true,
              },
            },
          },
        },
      },
    });

    let AD = 0;
    let A = 0;
    let B = 0;
    let C = 0;

    for (const student of students) {
      const deducted = student.incidents.reduce(
        (sum, i) => sum + i.incidentCatalog.pointsDeducted,
        0,
      );

      const score = Math.max(0, 20 - deducted);

      if (score >= 18) AD++;
      else if (score >= 14) A++;
      else if (score >= 11) B++;
      else C++;
    }

    const totalStudents = AD + A + B + C;

    if (totalStudents === 0) {
      return {
        AD: 0,
        A: 0,
        B: 0,
        C: 0,
      };
    }

    AD = Math.round((AD / totalStudents) * 100);
    A = Math.round((A / totalStudents) * 100);
    B = Math.round((B / totalStudents) * 100);
    C = Math.round((C / totalStudents) * 100);

    return {
      AD,
      A,
      B,
      C,
    };
  },

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

    // Total de incidentes del año por estudiante
    const incidents = await prisma.incident.findMany({
      where: {
        idStudent: { in: studentIds },
        date: { gte: startYear, lt: endYear },
      },
      select: {
        idStudent: true,
        incidentCatalog: {
          select: { pointsDeducted: true },
        },
      },
    });

    const incidentMap = incidents.reduce((map, incident) => {
      const current = map.get(incident.idStudent) ?? 0;
      map.set(
        incident.idStudent,
        current + incident.incidentCatalog.pointsDeducted,
      );
      return map;
    }, new Map());

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
        const deducted = incidentMap.get(student.idStudent) ?? 0;
        const score = Math.max(0, 20 - deducted);
        const conductGrade =
          score >= 18 ? "AD" : score >= 14 ? "A" : score >= 11 ? "B" : "C";

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
          conductPointsYear: 20 - (incidentMap.get(student.idStudent) ?? 0),
          conductYear: conductGrade,
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


enum StatusAssistance {
  PRESENTE
  TARDANZA
  JUSTIFICADA
}

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
