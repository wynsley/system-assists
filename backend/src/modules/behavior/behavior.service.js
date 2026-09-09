import { prisma } from "../../config/prisma.js";
import { validateUtils } from "../../utils/validate.utils.js";
import { behaviorUtils } from "../../utils/behavior.utils.js";
import { mappersUtils } from "../../utils/mappers.utils.js";
import { classroomStudentFields } from "../classroomStudent/classroomStudent.fields.js";
import { academicPeriodService } from "../academicPeriod/academicPeriod.service.js";

const NO_PERIOD_MESSAGE = "Aún no hay un bimestre activo configurado.";

const behaviorService = {

  getRoster: async ({ page, limit, sortOrder, sortBy, search, grade, section, idAuxiliar, idPeriod }) => {
    let period = null;
    let message = null;

    if (idPeriod) {
      period = await academicPeriodService.getById({ idPeriod }); // bimestre pasado: sí debe existir
    } else {
      try {
        period = await academicPeriodService.getCurrent();
      } catch {
        message = NO_PERIOD_MESSAGE;
      }
    }

    const classroomFilter = { status: "ACTIVO" };
    if (idAuxiliar) classroomFilter.classroomAuxiliars = { some: { idAuxiliar } };
    if (grade || section) {
      classroomFilter.section = {
        ...(grade ? { grade: { level: grade } } : {}),
        ...(section ? { name: section } : {}),
      };
    }

    const studentFilter = { status: "ACTIVO" };
    if (search) {
      studentFilter.OR = [
        { firstname: { contains: search, mode: "insensitive" } },
        { lastname: { contains: search, mode: "insensitive" } },
        { dni: { contains: search } },
      ];
    }

    const where = { classroom: classroomFilter, student: studentFilter };

    const [classroomStudents, total] = await Promise.all([
      prisma.classroomStudent.findMany({
        where,
        orderBy: validateUtils.buildOrderBy(sortBy, sortOrder),
        skip: (page - 1) * limit,
        take: limit,
        select: classroomStudentFields.select,
      }),
      prisma.classroomStudent.count({ where }),
    ]);

    const idStudents = classroomStudents.map((cs) => cs.student.idStudent);

    // Sin periodo activo: no hay nada que buscar en Behavior, todos quedan en 0
    const behaviors = period && idStudents.length
      ? await prisma.behavior.findMany({
        where: { idStudent: { in: idStudents }, idPeriod: period.idPeriod },
        select: { idBehavior: true, idStudent: true, score: true },
      })
      : [];

    const behaviorMap = new Map(behaviors.map((b) => [b.idStudent, b]));

    const students = classroomStudents.map((cs) => {
      const formatted = mappersUtils.formatClassroomStudent(cs);
      const behavior = behaviorMap.get(cs.student.idStudent);
      const score = behavior?.score ?? 0;
      return {
        ...formatted,
        idBehavior: behavior?.idBehavior ?? null,
        score,
        scale: behaviorUtils.getScale(score),
      };
    });

    return { students, total, period, message };
  },

  getSummary: async ({ idAuxiliar, grade, section, idPeriod } = {}) => {
    let period;
    if (idPeriod) {
      period = await academicPeriodService.getById({ idPeriod });
    } else {
      try {
        period = await academicPeriodService.getCurrent();
      } catch {
        return { AD: 0, A: 0, B: 0, C: 0 };
      }
    }

    const classroomFilter = { status: "ACTIVO" };
    if (idAuxiliar) classroomFilter.classroomAuxiliars = { some: { idAuxiliar } };
    if (grade || section) {
      classroomFilter.section = {
        ...(grade ? { grade: { level: grade } } : {}),
        ...(section ? { name: section } : {}),
      };
    }

    const classroomStudents = await prisma.classroomStudent.findMany({
      where: { classroom: classroomFilter, student: { status: "ACTIVO" } },
      select: { student: { select: { idStudent: true } } },
    });
    const idStudents = classroomStudents.map((cs) => cs.student.idStudent);

    const behaviors = idStudents.length
      ? await prisma.behavior.findMany({
        where: { idStudent: { in: idStudents }, idPeriod: period.idPeriod },
        select: { idStudent: true, score: true },
      })
      : [];
    const behaviorMap = new Map(behaviors.map((b) => [b.idStudent, b.score]));

    let AD = 0, A = 0, B = 0, C = 0;
    for (const idStudent of idStudents) {
      const score = behaviorMap.get(idStudent) ?? 0;
      const scale = behaviorUtils.getScale(score);
      if (scale === "AD") AD++;
      else if (scale === "A") A++;
      else if (scale === "B") B++;
      else C++;
    }

    const totalStudents = AD + A + B + C;
    if (totalStudents === 0) return { AD: 0, A: 0, B: 0, C: 0 };

    return {
      AD: Math.round((AD / totalStudents) * 100),
      A: Math.round((A / totalStudents) * 100),
      B: Math.round((B / totalStudents) * 100),
      C: Math.round((C / totalStudents) * 100),
    };
  },

  calificar: async ({ idStudent, score, description, idAuxiliar }) => {
    const period = await academicPeriodService.getCurrent();

    const result = await prisma.$transaction(async (prisma) => {
      const existing = await prisma.behavior.findUnique({
        where: { idStudent_idPeriod: { idStudent, idPeriod: period.idPeriod } },
      });
      const previousScore = existing?.score ?? 0;

      const behavior = existing
        ? await prisma.behavior.update({ where: { idBehavior: existing.idBehavior }, data: { score } })
        : await prisma.behavior.create({ data: { idStudent, idPeriod: period.idPeriod, score } });

      await prisma.behaviorHistory.create({
        data: {
          idBehavior: behavior.idBehavior,
          previousScore,
          newScore: score,
          description,
          idAuxiliar,
          type: "CALIFICACION",
        },
      });

      return behavior;
    });

    return { ...result, scale: behaviorUtils.getScale(result.score), period };
  },

  getConsolidado: async ({ grade, section, search, idAuxiliar, idPeriod }) => {
    const { students, period, message } = await behaviorService.getRoster({
      page: 1,
      limit: 1000,
      sortBy: "lastname",
      sortOrder: "asc",
      search,
      grade,
      section,
      idAuxiliar,
      idPeriod,
    });
    return { students, period, message };
  },
};

export { behaviorService };