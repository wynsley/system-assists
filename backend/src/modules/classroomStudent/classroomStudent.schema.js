import { z } from "zod";
import { classroomStudentFields } from "./classroomStudent.fields.js";
import { validateUtils } from "../../utils/validate.utils.js";
import { idField } from "../../utils/schemas/idField.js";
import { numericField } from "../../utils/schemas/numericField.js";
import { sortByField } from "../../utils/schemas/sortByField.js";
import { sortOrderField } from "../../utils/schemas/sortOrderField.js";
import { searchField } from "../../utils/schemas/searchField.js";

const classroomStudentSchema = {
  create: z
    .object({
      idClassroom: idField({
        label: "El ID del salon de clase",
        required: true,
      }),
      idStudent: idField({
        label: "El ID del estudiante",
        required: true,
      }),
    })
    .strict({
      message: "No se permiten campos adicionales",
    }),

  roster: z
    .object({
      page: numericField({
        label: "La página",
        min: 1,
        max: 1000,
        defaultValue: 1,
        required: false,
      }),
      year: numericField({
        label: "El año académico",
        min: 2000,
        max: 2100,
        required: false,
      }),
      grade: numericField({
        label: "El grado",
        min: 1,
        max: 5,
        required: false,
      }),
      section: z
        .string()
        .trim()
        .min(1, { message: "La sección no puede estar vacía" })
        .max(10, { message: "La sección no puede exceder 10 caracteres" })
        .optional(),
    })
    .strict({
      message: "No se permiten campos adicionales",
    }),

  update: z
    .object({
      idClassroom: idField({
        label: "El ID del salon de clase",
        required: false,
      }),
      idStudent: idField({
        label: "El ID del estudiante",
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
        fields: classroomStudentFields.update,
      });
    }),
  params: z
    .object({
      id: idField({
        label: "El ID del registro",
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
      idClassroom: idField({
        label: "El ID del salon de clase",
        required: false,
      }),
      idStudent: idField({
        label: "El ID del estudiante",
        required: false,
      }),
      sortBy: sortByField({
        sortFields: classroomStudentFields.sort,
        defaultValue: "idClassroom",
      }),
      sortOrder: sortOrderField(),
      search: searchField(),
    })
    .strict({
      message: "No se permiten campos adicionales",
    }),
};

export { classroomStudentSchema };