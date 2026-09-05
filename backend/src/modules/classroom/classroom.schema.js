import { z } from "zod";
import { validateUtils } from "../../utils/validate.utils.js";
import { classroomFields } from "./classroom.fields.js";
import { sectionFields } from "../section/section.fields.js";
import { idField } from "../../utils/schemas/idField.js";
import { numericField } from "../../utils/schemas/numericField.js";
import { statusField } from "../../utils/schemas/statusField.js";
import { sortByField } from "../../utils/schemas/sortByField.js";
import { sortOrderField } from "../../utils/schemas/sortOrderField.js";
import { searchField } from "../../utils/schemas/searchField.js";

const classroomSchema = {
  create: z
    .object({
      year: numericField({
        label: "El año",
        min: 1900,
        max: 3000,
        required: true,
      }),
      idSection: idField({
        label: "El ID de la sección",
        required: true,
      }),
      status: statusField({
        states: classroomFields.status,
        required: false,
      }),
    })
    .strict({
      message: "No se permiten campos adicionales",
    }),
  update: z
    .object({
      year: numericField({
        label: "El año",
        min: 1900,
        max: 3000,
        required: false,
      }),
      idSection: idField({
        label: "El ID de la sección",
        required: false,
      }),
    })
    .strict({
      message: "No se permiten campos adicionales",
    })
    .superRefine((data, ctx) => {
      validateUtils.validateBody({
        data,
        ctx,
        fields: classroomFields.update,
      });
    }),

  params: z.object({
    id: idField({
      label: "El ID del salon de clase",
      required: false,
    }),
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
      max: 50,
      defaultValue: 10,
      required: false,
    }),

    sortBy: sortByField({
      sortFields: sectionFields.sort,
      defaultValue: "year",
    }),

    year: numericField({
    label: "El año",
    min: 1900,
    max: 3000,
    required: false,
  }),
  status: statusField({
    states: classroomFields.status,
    required: false,
  }),
  grade: numericField({
    label: "El grado",
    min: 1,
    max: 6,
    required: false,
  }),
  section: z.string().min(1).max(10).optional(),

    sortOrder: sortOrderField(),

    search: searchField(),
  }),
};

export { classroomSchema };
