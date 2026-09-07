import { prisma } from "../../config/prisma.js";
import { validateUtils } from "../../utils/validate.utils.js";
import { behaviorUtils } from "../../utils/behavior.utils.js";
import { mappersUtils } from "../../utils/mappers.utils.js";
import { classroomStudentFields } from "../classroomStudent/classroomStudent.fields.js";

const behaviorService = {
  // Lista de estudiantes con su nota/escala actual, filtrada por lo asignado al auxiliar
  getRoster: async ({ page, limit, sortOrder, sortBy, search, grade, section, idAuxiliar }) => {
    const classroomFilter = { status: "ACTIVO" };

    if (idAuxiliar) {
      classroomFilter.classroomAuxiliars = { some: { idAuxiliar } };
    }

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

    const behaviors = idStudents.length
      ? await prisma.behavior.findMany({
          where: { idStudent: { in: idStudents } },
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

    return { students, total };
  },

  // Calificar (ajuste manual del auxiliar/profesor)
  calificar: async ({ idStudent, score, description, idAuxiliar }) => {
    const result = await prisma.$transaction(async (prisma) => {
      const existing = await prisma.behavior.findUnique({ where: { idStudent } });
      const previousScore = existing?.score ?? 0;

      const behavior = existing
        ? await prisma.behavior.update({ where: { idStudent }, data: { score } })
        : await prisma.behavior.create({ data: { idStudent, score } });

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

    return { ...result, scale: behaviorUtils.getScale(result.score) };
  },

  // Consolidado para descarga (sin paginar, mismo filtro)
  getConsolidado: async ({ grade, section, search, idAuxiliar }) => {
    const { students } = await behaviorService.getRoster({
      page: 1,
      limit: 1000,
      sortBy: "lastname",
      sortOrder: "asc",
      search,
      grade,
      section,
      idAuxiliar,
    });
    return students;
  },
};

export { behaviorService };