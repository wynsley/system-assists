import { z } from "zod";
import { validateUtils } from "../../utils/validate.utils.js";
import { incidentCatalogFields } from "./incidentCatalog.fields.js";
import { idField } from "../../utils/schemas/idField.js";
import { numericField } from "../../utils/schemas/numericField.js";
import { sortByField } from "../../utils/schemas/sortByField.js";
import { sortOrderField } from "../../utils/schemas/sortOrderField.js";
import { searchField } from "../../utils/schemas/searchField.js";
import { nameField } from "../../utils/schemas/nameField.js";
import { statusField } from "../../utils/schemas/statusField.js";


const ALLOWED_POINTS = [1, 3, 5];

const incidentCatalogSchema = {
  create: z
    .object({
      name: nameField({
        label: "El nombre de la categoría de incidente",
        min: 3,
        max: 50,
        required: true,
      }),
      description: nameField({
        label: "La descripción de la categoría de incidente",
        min: 3,
        max: 100,
        required: true,
        text: true,
      }),
      type: statusField({
        message: "El tipo de incidente",
        states: incidentCatalogFields.type,
        required: true,
      }),
      points: numericField({
        label: "Los puntos a deducir",
        min: 1,
        max: 5,
        required: true,
      }).refine((val) => ALLOWED_POINTS.includes(val), {
        message: "Los puntos deben ser 1 (leve), 3 (moderado) o 5 (grave)",
      })
    })
    .strict({ message: "No se permiten campos adicionales" }),

  update: z
    .object({
      name: nameField({
        label: "El nombre de la categoría de incidente",
        min: 3,
        max: 50,
        required: false,
      }),
      description: nameField({
        label: "La descripción de la categoría de incidente",
        min: 3,
        max: 100,
        required: false,
        text: true,
      }),
      type: statusField({
        message: "El tipo de incidente",
        states: incidentCatalogFields.type,
        required: false,
      }),
      points: numericField({
        label: "Los puntos a deducir",
        min: 1,
        max: 5,
        required: true,
      }).refine((val) => ALLOWED_POINTS.includes(val), {
        message: "Los puntos deben ser 1 (leve), 3 (moderado) o 5 (grave)",
      })
    })
    .strict({ message: "No se permiten campos adicionales" })
    .superRefine((data, ctx) => {
      validateUtils.validateBody({
        data,
        ctx,
        fields: incidentCatalogFields.update,
      });
    }),

  params: z.object({
    id: idField({
      label: "El ID de incidentCatalog",
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
      sortFields: incidentCatalogFields.sort,
      defaultValue: "idIncidentCatalog",
    }),
    sortOrder: sortOrderField(),
    search: searchField(),
  }),
};

export { incidentCatalogSchema };
