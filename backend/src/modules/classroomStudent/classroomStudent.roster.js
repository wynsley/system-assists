import { prisma } from "../../config/prisma.js";
import { mappersUtils } from "../../utils/mappers.utils.js";
import { classroomStudentFields } from "./classroomStudent.fields.js";

const getRosterByClassroomPage = async ({ page, year, grade, section, idAuxiliar }) => {
  const classroomWhere = { status: "ACTIVO" };
  if (year) classroomWhere.year = year;
  if (grade || section) {
    classroomWhere.section = {
      ...(grade ? { grade: { level: grade } } : {}),
      ...(section ? { name: section } : {}),
    };
  }
  if (idAuxiliar) {
    classroomWhere.classroomAuxiliars = { some: { idAuxiliar } };
  }

  const [totalClassrooms, classroom] = await Promise.all([
    prisma.classroom.count({ where: classroomWhere }),
    prisma.classroom.findFirst({
      where: classroomWhere,
      orderBy: [
        { section: { grade: { level: "asc" } } },
        { section: { name: "asc" } },
      ],
      skip: page - 1,
      select: {
        idClassroom: true,
        year: true,
        section: { select: { name: true, grade: { select: { level: true } } } },
      },
    }),
  ]);

  if (!classroom) {
    return { classroom: null, students: [], pagination: { page, totalPages: totalClassrooms, totalClassrooms } };
  }

  const studentsRaw = await prisma.classroomStudent.findMany({
    where: {
      idClassroom: classroom.idClassroom,
      student: { status: "ACTIVO" }, // <-- solo estudiantes activos
    },
    select: classroomStudentFields.select,
    orderBy: { student: { lastname: "asc" } },
  });

  return {
    classroom: {
      idClassroom: classroom.idClassroom,
      year: classroom.year,
      grade: classroom.section.grade.level,
      section: classroom.section.name,
    },
    students: studentsRaw.map(mappersUtils.formatClassroomStudent),
    pagination: { page, totalPages: totalClassrooms, totalClassrooms },
  };
};

export { getRosterByClassroomPage };