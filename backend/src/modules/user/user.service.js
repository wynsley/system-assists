import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { searchUtils } from "../../utils/search.utils.js";
import { userFields } from "./user.fields.js";

const userService = {
  create: async ({
    firstname,
    lastname,
    email,
    passwordHash,
    phone = null,
    role,
  }) => {
    const queryResult = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: { firstname, lastname, email, passwordHash, phone, role },
        select: userFields.select,
      });
      return  user ;
    });
    return queryResult;
  },

  get: async ({ page, limit, role, sortBy, search, sortOrder }) => {
    const where = searchUtils.buildSearchWhere({
      search,
      stringFields: userFields.search,
      filters: {
        role,
      },
    });
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          ...userFields.select,
          classroomAuxiliars : {
            select : {
              classroom: {
                select:{
                  section : {
                    select: {
                      name : true,
                      grade : { 
                        select: {level:true},
                      },
                    },
                  },
                },
              },
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.user.count({ where }),
    ]);
    
     const formattedUsers = users.map((user) => {
    const { classroomAuxiliars, ...rest } = user;

    if (!classroomAuxiliars) return rest;

    const gradesMap = new Map();
    const sectionsMap = new Map();

    for (const ca of classroomAuxiliars) {
      const level = ca.classroom?.section?.grade?.level;
      const name = ca.classroom?.section?.name;

      if (level !== undefined && level !== null) {
        gradesMap.set(level, { level });
      }
      if (name !== undefined && name !== null) {
        sectionsMap.set(name, { name });
      }
    }

    return {
      ...rest,
      grades: Array.from(gradesMap.values()),
      sections: Array.from(sectionsMap.values()),
    };
  });

    return [formattedUsers, total];
  },

  update: async (idUser, data) => {
    const updatedUser = await prisma.user.update({
      where: {
        idUser,
      },
      data,
      select: userFields.select,
    });
    if (!updatedUser) {
      throw new AppError("Registro no encontrado", 404, [
        {
          field: "idUser",
          message: "No existe un registro con el ID proporcionado",
        },
      ]);
    }
    return updatedUser;
  },

  delete: async (idUser) => {
    const deletedUser = await prisma.user.delete({
      where: { idUser },
      select: userFields.select,
    });
    return deletedUser;
  },

  getById: async (idUser) => {
    const user = await prisma.user.findUnique({
      where: { idUser },
      select: userFields.select,
    });

    if (!user) {
      throw new AppError("Registro no encontrado", 404, [
        {
          field: "idUser",
          message: "No existe un registro con el ID proporcionado",
        },
      ]);
    }
    return user;
  },

  getByEmail: async ({ email }) => {
    const user = await prisma.user.findUnique({
      where: { email },
      select: userFields.select,
    });

    if (!user) {
      throw new AppError("Registro no encontrado", 404, [
        {
          field: "email",
          message: "No existe un registro con el ID proporcionado",
        },
      ]);
    }
    return user;
  },
};

export { userService };
