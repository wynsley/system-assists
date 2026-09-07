import { z } from "zod";
import { validateUtils } from "../../utils/validate.utils.js";
import { academicPeriodFields } from "./academicPeriod.fields.js";
import { idField } from "../../utils/schemas/idField.js";
import { numericField } from "../../utils/schemas/numericField.js";
import { dateField } from "../../utils/schemas/dateField.js";
import { sortByField } from "../../utils/schemas/sortByField.js";
import { sortOrderField } from "../../utils/schemas/sortOrderField.js";
import { searchField } from "../../utils/schemas/searchField.js";

const academicPeriodSchema = {
  create: z
    .object({
      year: numericField({ 
        label: "El año", 
        min: 1900, 
        max: 3000, 
        required: true 
      }),
      bimester: numericField({ 
        label: "El bimestre", 
        min: 1, 
        max: 4, 
        required: true 
      }),
      startDate: dateField({ 
        label: "La fecha de inicio", 
        required: true 
      }),
      endDate: dateField({ 
        label: "La fecha de fin", 
        required: true 
      }),
    })
    .strict({ message: "No se permiten campos adicionales" })
    .superRefine((data, ctx) => {
      if (new Date(data.endDate) <= new Date(data.startDate)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endDate"],
          message: "La fecha de fin debe ser posterior a la fecha de inicio",
        });
      }
    }),

  update: z
    .object({
      year: numericField({ 
        label: "El año", 
        min: 1900, 
        max: 3000, 
        required: false 
      }),
      bimester: numericField({ 
        label: "El bimestre", 
        min: 1, 
        max: 4, 
        equired: false 
      }),
      startDate: dateField({ 
        label: "La fecha de inicio", 
        required: false 
      }),
      endDate: dateField({ 
        label: "La fecha de fin", 
        required: false 
      }),
    })
    .strict({ message: "No se permiten campos adicionales" })
    .superRefine((data, ctx) => {
      validateUtils.validateBody({ data, ctx, fields: academicPeriodFields.update });
    }),

  params: z.object({
    id: idField({ 
      label: "El ID del bimestre", 
      required: false 
    }),
    page: numericField({ 
      label: "La página", 
      min: 1, 
      max: 1000, 
      defaultValue: 1, 
      required: false 
    }),
    limit: numericField({ 
      label: "El límite", 
      min: 1, 
      max: 50, 
      defaultValue: 10, 
      required: false 
    }),
    sortBy: sortByField({ sortFields: academicPeriodFields.sort, defaultValue: "startDate" }),
    sortOrder: sortOrderField(),
    search: searchField(),
    year: numericField({ 
      label: "El año", 
      min: 1900, 
      max: 3000, 
      required: false 
    }),
  }),
};

export { academicPeriodSchema };