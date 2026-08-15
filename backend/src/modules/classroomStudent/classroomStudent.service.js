import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { mappersUtils } from "../../utils/mappers.utils.js";
import { searchUtils } from "../../utils/search.utils.js";
import { validateUtils } from "../../utils/validate.utils.js";
import { classroomStudentFields } from "./classroomStudent.fields.js";

const classroomStudentService = {
  create: async ({ idClassroom, idStudent }) => {
    const classroomStudent = await prisma.classroomStudent.findFirst({
      where: { idClassroom, idStudent },
      select: classroomStudentFields.create,
    });

    if (classroomStudent) {
      throw new AppError("Registro duplicado", 409, [
        {
          field: ["idClassroom", "idStudent"],
          message: "Ya existe un registro con este valor",
        },
      ]);
    }

    const queryResult = await prisma.$transaction(async (prisma) => {
      const classroomStudent = await prisma.classroomStudent.create({
        data: { idClassroom, idStudent },
        select: classroomStudentFields.create,
      });
      return { classroomStudent };
    });
    return mappersUtils.formatClassroomStudent(queryResult.classroomStudent);
  },

  get: async ({
    page,
    limit,
    sortOrder,
    search,
    sortBy,
    idClassroom,
    idStudent,
  }) => {
    const where = searchUtils.buildSearchWhere({
      search,
      numberFields: ["idClassroomStudent", "idClassroom", "idStudent"],
      relationStringFields: [
        { relation: "student", field: "firstname" },
        { relation: "student", field: "lastname" },
      ],
      relationFields: [
        { relation: "classroom", field: "year" }, // numérico
      ],
      relationNestedFields: [
        { relation: "classroom", nestedRelation: "section", field: "name" },
      ],
      filters: {
        idClassroom,
        idStudent,
      },
    });

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

    return [classroomStudents.map(mappersUtils.formatClassroomStudent), total];
  },

  update: async ({ idClassroomStudent, data }) => {
    const updatedUser = await prisma.classroomStudent.update({
      where: {
        idClassroomStudent,
      },
      data,
      select: classroomStudentFields.select,
    });

    if (!updatedUser) {
      throw new AppError("Registro no encontrado", 404, [
        {
          field: "idClassroomStudent",
          message: "No existe un registro con el ID proporcionado",
        },
      ]);
    }

    return mappersUtils.formatClassroomStudent(updatedUser);
  },

  getById: async ({ idClassroomStudent }) => {
    const classroomStudent = await prisma.classroomStudent.findUnique({
      where: { idClassroomStudent },
      select: classroomStudentFields.select,
    });

    if (!classroomStudent) {
      throw new AppError("Registro no encontrado", 404, [
        {
          field: "idClassroomStudent",
          message: "No existe un registro con el ID proporcionado",
        },
      ]);
    }

    return mappersUtils.formatClassroomStudent(classroomStudent);
  },

  delete: async ({ idClassroomStudent }) => {
    const deletedClassroomStudent = await prisma.classroomStudent.delete({
      where: { idClassroomStudent },
      select: classroomStudentFields.select,
    });
    return mappersUtils.formatClassroomStudent(deletedClassroomStudent);
  },

  getActiveClassroomByStudentId: async ({ idStudent }) => {
    const activeClassroom = await prisma.classroomStudent.findFirst({
      where: {
        idStudent,
        classroom: {
          status: "ACTIVO",
        },
      },
      select: {
        idClassroomStudent: true,
        classroom: {
          select: {
            section: {
              select: {
                name: true,
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

    return mappersUtils.formatClassroom(activeClassroom);
  },
};

export { classroomStudentService };
