import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { searchUtils } from "../../utils/search.utils.js";
import { parentFields } from "./parent.fields.js";

const parentService = {
  create: async ({ data }) => {
    const parent = await prisma.user.findUnique({
      where: {
        idUser: data.idParent,
      },
      select: {
        idUser: true,
        role: true,
      },
    });
    if (!parent) {
      throw new AppError("El padre no existe", 400, {
        field: "idParent",
        message: "No existe un registro con el ID proporcionado",
      });
    }

    if (!["PARENT"].includes(parent.role)) {
      throw new AppError("El usuario no es un padre", 400, {
        field: "idParent",
        message: "El usuario no es un padre",
      });
    }

    const queryResult = await prisma.$transaction(async (prisma) => {
      const parent = await prisma.studentParent.create({
        data: {
          ...data,
        },
        select: parentFields.create,
      });
      return { parent };
    });
    return queryResult.parent;
  },

  get: async ({ page, limit, sortOrder, search, sortBy, relationship, idParent, idStudent }) => {
    const where = searchUtils.buildSearchWhere({
      search,
      numberFields: ["idStudentParent", "idStudent", "idParent"],
      relationStringFields: [
        { relation: "student", field: "firstname" },
        { relation: "student", field: "lastname" },
        { relation: "parent", field: "firstname" },
        { relation: "parent", field: "lastname" },
        { relation: "parent", field: "email" },
      ],
      filters: {
        relationship,
        idParent,
        idStudent,
      },
    });

    const relationSortMap = {
      student: [
        { student: { firstname: sortOrder } },
        { student: { lastname: sortOrder } },
      ],
      parent: [
        { parent: { firstname: sortOrder } },
        { parent: { lastname: sortOrder } },
      ],
    };

    const orderBy = relationSortMap[sortBy] ?? relationSortMap.student;

    const [parents, total] = await Promise.all([
      prisma.studentParent.findMany({
        where,
        select: parentFields.select,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
      }),
      prisma.studentParent.count({ where }),
    ]);

    return [parents, total];
  },

  getById: async ({ idStudentParent }) => {
    const parent = await prisma.studentParent.findUnique({
      where: {
        idStudentParent,
      },
      select: parentFields.select,
    });

    if (!parent) {
      throw new AppError("Registro no encontrado", 404, [
        {
          field: "idParent",
          message: "No existe un registro con el ID proporcionado",
        },
      ]);
    }

    return parent;
  },

  update: async ({ idStudentParent, data }) => {
    const parent = await prisma.studentParent.findUnique({
      where: { idStudentParent },
    });

    if (!parent) {
      throw new AppError("Registro no encontrado", 404, [
        {
          field: "idStudentParent",
          message: "No existe un registro con el ID proporcionado",
        },
      ]);
    }

    const idParentToCheck = data.idParent ?? parent.idParent;
    const idStudentToCheck = data.idStudent ?? parent.idStudent;

    const isChanging =
      idParentToCheck !== parent.idParent ||
      idStudentToCheck !== parent.idStudent;

    if (isChanging) {
      const duplicate = await prisma.studentParent.findFirst({
        where: {
          idParent: idParentToCheck,
          idStudent: idStudentToCheck,
          NOT: { idStudentParent },
        },
      });

      if (duplicate) {
        throw new AppError("Valor duplicado", 400, [
          {
            field: ["idParent", "idStudent"],
            message: "Ya existe un registro con este valor",
          },
        ]);
      }
    }

    // 4. Actualizar
    const updatedParent = await prisma.studentParent.update({
      where: { idStudentParent },
      data,
      select: parentFields.select,
    });

    return updatedParent;
  },

  delete: async ({ idStudentParent }) => {
    const deletedParent = await prisma.studentParent.delete({
      where: {
        idStudentParent,
      },
      select: parentFields.select,
    });
    return deletedParent;
  },

  getStudents: async ({ idParent }) => {
    const students = await prisma.studentParent.findMany({
      where: {
        idParent,
      },
      select: parentFields.student,
    });

    if (!students || students.length === 0) {
      throw new AppError("Registro no encontrado", 404, [
        {
          field: "parent",
          message: "No existen estudiantes asociados a este usuario",
        },
      ]);
    }

    return students;
  },

  getAttendanceByParent: async ({ idParent, idStudent }) => {
    const student = await prisma.studentParent.findFirst({
      where: {
        idStudent,
        idParent: idParent,
      },
    });

    if (!student) {
      throw new AppError("Acceso denegado", 403, [
        {
          field: "idStudent",
          message: "No tiene acceso a las asistencias de este estudiante",
        },
      ]);
    }

    return student;
  },

  getStudentParent: async ({ idParent, idStudent }) => {
    const student = await prisma.studentParent.findFirst({
      where: {
        idStudent,
        idParent: idParent,
      },
    });

    if (!student) {
      throw new AppError("Acceso denegado", 403, [
        {
          field: "idStudent",
          message: "No tiene acceso a los incidentes de este estudiante",
        },
      ]);
    }

    return student;
  },
};

export { parentService };

/**
 * model Student {
  idStudent      Int             @id @default(autoincrement())
  firstname      String          @db.VarChar(50)
  lastname       String          @db.VarChar(50)
  code           String          @unique @default(uuid()) @db.Uuid
  phone          String?         @unique @db.VarChar(20)
  email          String?         @unique @db.VarChar(100)
  gender         Gender
  status         StatusStudent   @default(ACTIVO)
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
  studentParents StudentParent[]
}

model User {
  idUser         Int             @id @default(autoincrement())
  firstname      String          @db.VarChar(50)
  lastname       String          @db.VarChar(50)
  email          String          @unique @db.VarChar(100)
  passwordHash   String          @db.VarChar(255)
  role           Role
  phone          String?         @db.VarChar(20)
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
  studentParents StudentParent[]
}

model StudentParent {
  idStudentParent Int          @id @default(autoincrement())
  idStudent       Int
  idParent        Int
  relationship    Relationship @default(APODERADO)

  student Student @relation(fields: [idStudent], references: [idStudent])
  parent  User    @relation(fields: [idParent], references: [idUser])

  @@unique([idStudent, idParent])
}


 */
