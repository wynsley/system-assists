import { z } from "zod";
import { idField } from "../../utils/schemas/idField.js";
import { numericField } from "../../utils/schemas/numericField.js";
import { sortByField } from "../../utils/schemas/sortByField.js";
import { sortOrderField } from "../../utils/schemas/sortOrderField.js";
import { searchField } from "../../utils/schemas/searchField.js";

const dateField = ({ label, required = true }) => {
  const chain = z
    .string({ invalid_type_error: `${label} debe ser una fecha (YYYY-MM-DD)` })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: `${label} debe tener el formato YYYY-MM-DD` })
    .transform((val) => new Date(`${val}T00:00:00`));

  return required ? chain : chain.optional();
};

const nonSchoolDaySchema = {
  create: z
    .object({
      startDate: dateField({ label: "La fecha de inicio", required: true }),
      endDate: dateField({ label: "La fecha de fin", required: true }),
      reason: z
        .string()
        .trim()
        .max(150, { message: "El motivo no puede exceder 150 caracteres" })
        .optional(),
    })
    .strict({ message: "No se permiten campos adicionales" })
    .superRefine((data, ctx) => {
      if (data.endDate < data.startDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endDate"],
          message: "La fecha de fin no puede ser anterior a la fecha de inicio",
        });
      }
    }),

  update: z
    .object({
      startDate: dateField({ label: "La fecha de inicio", required: false }),
      endDate: dateField({ label: "La fecha de fin", required: false }),
      reason: z
        .string()
        .trim()
        .max(150, { message: "El motivo no puede exceder 150 caracteres" })
        .optional(),
    })
    .strict({ message: "No se permiten campos adicionales" }),

  params: z
    .object({
      id: idField({ label: "El ID del registro", required: false }),
      page: numericField({ label: "La página", min: 1, max: 1000, defaultValue: 1, required: false }),
      limit: numericField({ label: "El límite", min: 1, max: 100, defaultValue: 10, required: false }),
      year: numericField({ label: "El año", min: 2000, max: 2100, required: false }),
      sortBy: sortByField({ sortFields: ["startDate", "endDate", "createdAt"], defaultValue: "startDate" }),
      sortOrder: sortOrderField(),
      search: searchField(),
    })
    .strict({ message: "No se permiten campos adicionales" }),
};

export { nonSchoolDaySchema };