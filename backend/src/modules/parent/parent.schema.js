import { z } from "zod";
import { validateUtils } from "../../utils/validate.utils.js";
import { parentFields } from "./parent.fields.js";
import { idField } from "../../utils/schemas/idField.js";
import { numericField } from "../../utils/schemas/numericField.js";
import { statusField } from "../../utils/schemas/statusField.js";
import { sortByField } from "../../utils/schemas/sortByField.js";
import { sortOrderField } from "../../utils/schemas/sortOrderField.js";
import { searchField } from "../../utils/schemas/searchField.js";

const parentSchema = {
  create: z
    .object({
      idStudent: idField({
        label: "El ID del estudiante",
        required: true,
      }),
      idParent: idField({
        label: "El ID del padre",
        required: true,
      }),
      relationship: statusField({
        message: "La relación",
        states: parentFields.relationship,
        required: true,
      }).optional(),
    })
    .strict({
      message: "No se permiten campos adicionales",
    }),
  update: z
    .object({
      idStudent: idField({
        label: "El ID del estudiante",
        required: false,
      }).optional(),
      idParent: idField({
        label: "El ID del padre",
        required: false,
      }).optional(),
      relationship: statusField({
        message: "La relación",
        states: parentFields.relationship,
        required: false,
      }).optional(),
    })
    .strict({
      message: "No se permiten campos adicionales",
    })
    .superRefine((data, ctx) => {
      validateUtils.validateBody({
        data,
        ctx,
        fields: parentFields.update,
      });
    }),
  params: z
    .object({
      id: idField({
        label: "El ID de la sección",
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
        sortFields: parentFields.sort,
        defaultValue: "parent",
      }),

      sortOrder: sortOrderField(),

      search: searchField(),

      relationship: statusField({
        message: "La relación",
        states: parentFields.relationship,
        required: false,
      }).optional(),
      
      idParent: idField({
        label: "El ID del padre",
        required: false,
      }).optional(),
      
      idStudent: idField({
        label: "El ID del estudiante",
        required: false,
      }).optional(),
    })
    .strict({
      message: "No se permiten campos adicionales",
    }),
};

export { parentSchema };
