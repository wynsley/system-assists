import { z } from "zod";
import { validateUtils } from "../../utils/validate.utils.js";
import { attendanceFields } from "./attendance.fields.js";
import { statusField } from "../../utils/schemas/statusField.js";
import { alphanumericField } from "../../utils/schemas/alphanumericField.js";
import { idField } from "../../utils/schemas/idField.js";
import { numericField } from "../../utils/schemas/numericField.js";
import { sortByField } from "../../utils/schemas/sortByField.js";
import { sortOrderField } from "../../utils/schemas/sortOrderField.js";
import { searchField } from "../../utils/schemas/searchField.js";

const attendanceSchema = {
  create: z
    .object({
      status: statusField({
        required: true,
        states: attendanceFields.status,
      }),
      note: alphanumericField({
        label: "La nota",
        min: 5,
        max: 100,
        required: false,
      }).optional(),
      idStudent: idField({
        label: "El ID del estudiante",
        required: true,
      }),
    })
    .strict({
      message: "No se permiten campos adicionales",
    })
    .superRefine((data, ctx) => {
      validateUtils.validateBody({
        data,
        ctx,
        fields: attendanceFields.createFields,
      });
    }),

  update: z
    .object({
      status: statusField({
        required: false,
        states: attendanceFields.status,
      }),
      note: alphanumericField({
        label: "La nota",
        min: 5,
        max: 100,
        required: false,
      }).optional(),
    })
    .strict({ message: "No se permiten campos adicionales" })
    .superRefine((data, ctx) => {
      validateUtils.validateBody({
        data,
        ctx,
        fields: attendanceFields.update,
      });
    }),

  params: z.object({
    id: idField({ label: "El ID de attendance", required: false }),
    page: numericField({
      label: "La página",
      min: 1,
      max: 1000,
      defaultValue: 1,
      required: false,
    }),
    limit: numericField({
      label: "El límite",
      min: 1,
      max: 35,
      defaultValue: 30,
      required: false,
    }),
    sortBy: sortByField({
      sortFields: [...attendanceFields.sort, "lastname", "grade", "section"], // 🔹 agregamos opciones válidas para el roster
      defaultValue: "lastname", // 🔹 antes era "idAttendance"
    }),
    sortOrder: sortOrderField(),
    search: searchField(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)").optional(),
    grade: numericField({
      label: "El grado",
      min: 1,
      max: 6,
      required: false,
    }),
    section: z.string().min(1).max(10).optional(),
  }),
};

export { attendanceSchema };

/* 
model Attendance {
  idAttendance Int              @id @default(autoincrement())
  date         DateTime         @db.Date
  schemas DateTime         @default(now())
  status       StatusAssistance @default(PRESENTE)
  note         String?          @db.VarChar(100)
  idStudent    Int
  idAuxiliar   Int

  student  Student @relation(fields: [idStudent], references: [idStudent])
  auxiliar User    @relation(fields: [idAuxiliar], references: [idUser])

  @@unique([idStudent, date])

  @@index([idStudent])
  @@index([idAuxiliar])
  @@index([date])
  @@index([idStudent, date])
}


*/
