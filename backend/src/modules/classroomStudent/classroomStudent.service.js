import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { mappersUtils } from "../../utils/mappers.utils.js";
import { searchUtils } from "../../utils/search.utils.js";
import { validateUtils } from "../../utils/validate.utils.js";
import { academicPeriodService } from "../academicPeriod/academicPeriod.service.js";
import { classroomStudentFields } from "./classroomStudent.fields.js";
import { getRosterByClassroomPage } from "./classroomStudent.roster.js";

const classroomStudentService = {
  _assign: async ({ idStudent, idClassroom }) => {
    return await prisma.$transaction(async (prisma) => {
      const existing = await prisma.classroomStudent.findUnique({
        where: { idStudent },
        include: { classroom: { include: { classroomAuxiliars: true } } },
      });

      const newClassroom = await prisma.classroom.findUnique({
        where: { idClassroom },
        include: { classroomAuxiliars: true },
      });
      if (!newClassroom) {
        throw new AppError("Registro no encontrado", 404, [
          { field: "idClassroom", message: "El aula indicada no existe" },
        ]);
      }

      let classroomStudent;

      if (existing) {
        if (existing.idClassroom === idClassroom) {
          return mappersUtils.formatClassroomStudent(existing);
        }

        const oldAuxiliarIds = existing.classroom.classroomAuxiliars.map((a) => a.idAuxiliar).sort();
        const newAuxiliarIds = newClassroom.classroomAuxiliars.map((a) => a.idAuxiliar).sort();
        const sameAuxiliar = JSON.stringify(oldAuxiliarIds) === JSON.stringify(newAuxiliarIds);

        classroomStudent = await prisma.classroomStudent.update({
          where: { idStudent },
          data: { idClassroom },
          select: classroomStudentFields.select,
        });

        if (!sameAuxiliar) {
          const period = await academicPeriodService.getCurrent().catch(() => null);
          if (period) {
            await prisma.behavior.updateMany({
              where: { idStudent, idPeriod: period.idPeriod },
              data: { score: 0 },
            });
          }
        }
      } else {
        classroomStudent = await prisma.classroomStudent.create({
          data: { idClassroom, idStudent },
          select: classroomStudentFields.select,
        });
      }

      return mappersUtils.formatClassroomStudent(classroomStudent);
    });
  },

  //Create
  assignClassroom: async ({ idStudent, idClassroom }) => {
    return classroomStudentService._assign({ idStudent, idClassroom });
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

  getRosterByClassroomPage: async ({ page, year, grade, section }) => {
    return getRosterByClassroomPage({ page, year, grade, section });
  },

  update: async ({ idClassroomStudent, data }) => {
    if (data.idClassroom) {
      const current = await prisma.classroomStudent.findUnique({
        where: { idClassroomStudent },
        select: { idStudent: true },
      });
      if (!current) {
        throw new AppError("Registro no encontrado", 404, [
          { field: "idClassroomStudent", message: "No existe un registro con el ID proporcionado" },
        ]);
      }
      return classroomStudentService._assign({
        idStudent: current.idStudent,
        idClassroom: data.idClassroom,
      });
    }

    const updatedUser = await prisma.classroomStudent.update({
      where: { idClassroomStudent },
      data,
      select: classroomStudentFields.select,
    });

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
