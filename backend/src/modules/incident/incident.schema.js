import { z } from "zod";
import { validateUtils } from "../../utils/validate.utils.js";
import { incidentFields } from "./incident.fields.js";
import { idField } from "../../utils/schemas/idField.js";
import { numericField } from "../../utils/schemas/numericField.js";
import { sortByField } from "../../utils/schemas/sortByField.js";
import { sortOrderField } from "../../utils/schemas/sortOrderField.js";
import { searchField } from "../../utils/schemas/searchField.js";
import { dateField } from "../../utils/schemas/dateField.js";
import { nameField } from "../../utils/schemas/nameField.js";

const incidentSchema = {
  create: z
    .object({
      date: dateField({
        label: "La fecha del incidente",
        required: true,
      }),
      note: nameField({
        label: "La nota del incidente",
        min: 3,
        max: 255,
        text: true,
        required: false,
      }),
      idStudent: idField({
        label: "El ID del estudiante",
        required: true,
      }),
      idIncidentCatalog: idField({
        label: "El ID del catálogo de incidentes",
        required: true,
      }),
    })
    .strict({
      message: "No se permiten campos adicionales",
    }),

  update: z
    .object({
      date: dateField({
        label: "La fecha del incidente",
        required: false,
      }),
      note: nameField({
        label: "La nota del incidente",
        min: 3,
        max: 255,
        text: true,
        required: false,
      }),
      idStudent: idField({
        label: "El ID del estudiante",
        required: false,
      }),
      idIncidentCatalog: idField({
        label: "El ID del tipo de incidente",
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
        fields: incidentFields.update,
      });
    }),

  params: z.object({
    id: idField({
      label: "El ID del incidente",
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
      sortFields: incidentFields.sort,
      defaultValue: "idIncident",
    }),
    sortOrder: sortOrderField(),
    search: searchField(),
  }),
};

export { incidentSchema };
