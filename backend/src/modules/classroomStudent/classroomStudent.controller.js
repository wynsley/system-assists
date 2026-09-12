import { classroomStudentService } from "./classroomStudent.service.js";
import { classroomStudentSchema } from "./classroomStudent.schema.js";
import { validateUtils } from "../../utils/validate.utils.js";

const classroomStudentController = {
  create: async (req, res, next) => {
    try {
      const validate = await validateUtils.validateSchema({
        schema: classroomStudentSchema.create,
        data: req.body,
      });

      const queryResult = await classroomStudentService.assignClassroom(validate);

      return res.json({
        success: true,
        message: "Estudiante asignado correctamente",
        classroomStudent: queryResult,
      });
    } catch (error) {
      next(error);
    }
  },

  get: async (req, res, next) => {
    try {
      const validate = await validateUtils.validateSchema({
        schema: classroomStudentSchema.params,
        data: req.query,
      });

      const [classroomStudents, total] =
        await classroomStudentService.get(validate);

      return res.json({
        success: true,
        data: classroomStudents,
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

  getRosterByClassroomPage: async (req, res, next) => {
    try {
      const validate = await validateUtils.validateSchema({
        schema: classroomStudentSchema.roster,
        data: req.query,
      });

      const { classroom, students, pagination } =
        await classroomStudentService.getRosterByClassroomPage(validate);

      return res.json({
        success: true,
        classroom,
        data: students,
        pagination,
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id: idClassroomStudent } = await validateUtils.validateSchema({
        schema: classroomStudentSchema.params,
        data: req.params,
      });

      const data = await validateUtils.validateSchema({
        schema: classroomStudentSchema.update,
        data: req.body,
      });

      const updatedClassroomStudent = await classroomStudentService.update({
        idClassroomStudent,
        data,
      });

      return res.json({
        success: true,
        message: "Estudiante reasignado correctamente",
        classroomStudent: updatedClassroomStudent,
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id: idClassroomStudent } = await validateUtils.validateSchema({
        schema: classroomStudentSchema.params,
        data: req.params,
      });

      const classroomStudent = await classroomStudentService.getById({
        idClassroomStudent,
      });

      return res.json({
        success: true,
        message: "Relación estudiante salón encontrada",
        classroomStudent,
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id: idClassroomStudent } = await validateUtils.validateSchema({
        schema: classroomStudentSchema.params,
        data: req.params,
      });

      const deletedClassroomStudent = await classroomStudentService.delete({
        idClassroomStudent,
      });

      return res.json({
        success: true,
        message: "Relación estudiante salón eliminada correctamente",
        classroomStudent: deletedClassroomStudent,
      });
    } catch (error) {
      next(error);
    }
  },
};

export { classroomStudentController };
