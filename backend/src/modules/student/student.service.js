import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { searchUtils } from "../../utils/search.utils.js";
import { studentFields } from "./student.fields.js";

const studentService = {
  create: async ({
    firstname,
    lastname,
    dni,
    phone,
    email,
    gender,
    status,
  }) => {
    const queryResult = await prisma.$transaction(async (prisma) => {
      if (firstname && lastname) {
        const student = await prisma.student.findFirst({
          where: { firstname, lastname },
          select: studentFields.select,
        });
        if (student) {
          throw new AppError("Valor duplicado", 409, [
            {
              field: ["firstname", "lastname"],
              message: "El estudiante ya esta registraado con esos nombres",
            },
          ]);
        }
      }

      const student = await prisma.student.create({
        data: { firstname, lastname, dni, phone, email, gender, status },
        select: studentFields.select,
      });
      return { student };
    });
    return queryResult;
  },

  get: async ({ page, limit, status, sortBy, search, sortOrder, gender }) => {
    const where = searchUtils.buildSearchWhere({
      search,
      stringFields: ["firstname", "lastname", "phone", "email"],
      filters: {
        status,
        gender,
      },
    });
    const students = await prisma.student.findMany({
      where,
      select: studentFields.select,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    const total = await prisma.student.count({
      where,
    });
    return [students, total];
  },

  update: async ({ idStudent, data }) => {
    const updatedStudent = await prisma.student.update({
      where: {
        idStudent,
      },
      data,
      select: studentFields.select,
    });
    if (!updatedStudent) {
      throw new AppError("Registro no encontrado", 404, [
        {
          field: "idStudent",
          message: "No existe un registro con el ID proporcionado",
        },
      ]);
    }
    return updatedStudent;
  },

  delete: async ({ idStudent }) => {
    const deletedStudent = await prisma.student.delete({
      where: { idStudent },
      select: studentFields.select,
    });
    return deletedStudent;
  },

  getById: async ({ idStudent }) => {
    const student = await prisma.student.findUnique({
      where: { idStudent },
      select: studentFields.select,
    });

    if (!student) {
      throw new AppError("Registro no encontrado", 404, [
        {
          field: "idStudent",
          message: "No existe un registro con el ID proporcionado",
        },
      ]);
    }

    return student;
  },

  getCount: async () => {
    const total = await prisma.student.count({
      where: {
        status: "ACTIVO",
      },
    });
    return total;
  },
};

export { studentService };
