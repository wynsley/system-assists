import { z } from "zod";
import { behaviorFields } from "./behavior.fields.js";
import { idField } from "../../utils/schemas/idField.js";
import { numericField } from "../../utils/schemas/numericField.js";
import { nameField } from "../../utils/schemas/nameField.js";
import { sortByField } from "../../utils/schemas/sortByField.js";
import { sortOrderField } from "../../utils/schemas/sortOrderField.js";
import { searchField } from "../../utils/schemas/searchField.js";

const behaviorSchema = {
  calificar: z
    .object({
      idStudent: idField({ 
        label: "El ID del estudiante", 
        required: true 
      }),
      score: numericField({ 
        label: "La nota", 
        min: 0, 
        max: 20, 
        required: true 
      }),
      description: nameField({
        label: "La descripción",
        min: 3,
        max: 255,
        text: true,
        required: false,
      }),
    })
    .strict({ message: "No se permiten campos adicionales" }),

  params: z.object({
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
      defaultValue: 30, 
      required: false 
    }),
    sortBy: sortByField({ 
      sortFields: behaviorFields.sort, 
      defaultValue: "lastname" 
    }),
    sortOrder: sortOrderField(),
    search: searchField(),
    grade: numericField({ 
      label: "El grado", 
      min: 1, 
      max: 6, 
      required: false 
    }),
    idPeriod: idField({
      label: "El ID del bimestre",
      required: false
    }),
    section: z.string().min(1).max(10).optional(),
  }),
};

export { behaviorSchema };