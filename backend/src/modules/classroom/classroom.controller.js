import { classroomService } from "./classroom.service.js";
import { classroomSchema } from "./classroom.schema.js";
import { validateUtils } from "../../utils/validate.utils.js";
import { classroomFields } from "./classroom.fields.js";

const classroomController = {
  create: async (req, res, next) => {
    try {
      const validate = await validateUtils.validateSchema({
        schema: classroomSchema.create,
        data: req.body,
      });

      if (!validate.status) {
        validate.status = classroomFields.status[0];
      }

      const newClassroom = await classroomService.create(validate);

      return res.json({
        success: true,
        message: "Aula creada correctamente",
        classroom: { ...newClassroom },
      });
    } catch (error) {
      next(error);
    }
  },

  get: async (req, res, next) => {
    try {
      const validate = await validateUtils.validateSchema({
        schema: classroomSchema.params,
        data: req.query,
      });

      const [classrooms, total] = await classroomService.get(validate);

      return res.json({
        success: true,
        data: classrooms,
        pagination: {
          page: validate.page,
          limit: validate.limit,
          total,
          totalPages: Math.ceil(total / validate.limit),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id: idClassroom } = await validateUtils.validateSchema({
        schema: classroomSchema.params,
        data: req.params,
      });

      const classroom = await classroomService.getById({ idClassroom });

      return res.json({
        success: true,
        message: "Salón de clase encontrado",
        classroom: { ...classroom },
      });
    } catch (error) {
      next(error);
    }
  },

  getYears: async (req, res, next) => {
    try {
      const years = await classroomService.getYears();
      return res.json({ success: true, data: years });
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const { id: idClassroom } = await validateUtils.validateSchema({
        schema: classroomSchema.params,
        data: req.params,
      });

      const data = await validateUtils.validateSchema({
        schema: classroomSchema.update,
        data: req.body,
      });

      const updatedClassroom = await classroomService.update({
        idClassroom,
        data,
      });

      return res.json({
        success: true,
        message: "Salón de clase actualizado correctamente",
        classroom: { ...updatedClassroom },
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id: idClassroom } = await validateUtils.validateSchema({
        schema: classroomSchema.params,
        data: req.params,
      });

      const deletedClassroom = await classroomService.delete({ idClassroom });

      return res.json({
        success: true,
        message: "Salón de clase eliminado correctamente",
        classroom: { ...deletedClassroom },
      });
    } catch (error) {
      next(error);
    }
  },
};

export { classroomController };
