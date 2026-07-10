import { z } from "zod";
import { sectionFields } from "./section.fields.js";
import { validateUtils } from "../../utils/validate.utils.js";
import { idField } from "../../utils/schemas/idField.js";
import { sectionField } from "../../utils/schemas/sectionField.js";
import { numericField } from "../../utils/schemas/numericField.js";
import { sortByField } from "../../utils/schemas/sortByField.js";
import { sortOrderField } from "../../utils/schemas/sortOrderField.js";
import { searchField } from "../../utils/schemas/searchField.js";

const sectionSchema = {
  create: z
    .object({
      name: sectionField({
        required: true,
      }),
      idGrade: idField({
        label: "El ID del grado",
        required: true,
      }),
    })
    .strict({
      message: "No se permiten campos adicionales",
    }),
  update: z
    .object({
      name: sectionField({
        required: false,
      }),
      idGrade: idField({
        label: "El ID del grado",
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
        fields: sectionFields.update,
      });
    }),
  params: z
    .object({
      id: idField({
        label: "El ID de la sección",
        required: false,
      }),
      idGrade: idField({
        label: "El ID del grado",
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
        defaultValue: "grade",
      }),

      sortOrder: sortOrderField(),

      search: searchField(),
    })
    .strict({
      message: "No se permiten campos adicionales",
    }),
};

export { sectionSchema };
