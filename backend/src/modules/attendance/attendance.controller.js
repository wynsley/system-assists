import { attendanceService } from "./attendance.service.js";
import { attendanceSchema } from "./attendance.schema.js";
import { validateUtils } from "../../utils/validate.utils.js";
import { AppError } from "../../utils/AppError.js";
import { classroomStudentService } from "../classroomStudent/classroomStudent.service.js";

const attendanceController = {
  create: async (req, res, next) => {
    try {
      const validate = await validateUtils.validateSchema({
        schema: attendanceSchema.create,
        data: req.body,
      });

      const idAuxiliar = await req.user.sub;

      if (!idAuxiliar) {
        throw new AppError("Sin autorización", 401, {
          message: "Sin autorización",
        });
      }

      const queryResult = await attendanceService.create(validate, idAuxiliar);

      const student = queryResult.student;

      const activeClassroom =
        await classroomStudentService.getActiveClassroomByStudentId({
          idStudent: student.idStudent,
        });

      return res.json({
        success: true,
        message: "Asistencia creada correctamente",
        attendance: {
          classroom: activeClassroom,
          ...queryResult,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  get: async (req, res, next) => {
    try {
      const validate = await validateUtils.validateSchema({
        schema: attendanceSchema.params,
        data: req.query,
      });

      const { attendances, total } = await attendanceService.get(validate);

      return res.json({
        success: true,
        data: attendances,
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
      const { id: idAttendance } = await validateUtils.validateSchema({
        schema: attendanceSchema.params,
        data: req.params,
      });

      const attendance = await attendanceService.getById({ idAttendance });

      const activeClassroom =
        await classroomStudentService.getActiveClassroomByStudentId({
          idStudent: attendance.student.idStudent,
        });

      return res.json({
        success: true,
        message: "Asistencia encontrada",
        data: {
          ...attendance,
          classroom: activeClassroom,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id: idAttendance } = await validateUtils.validateSchema({
        schema: attendanceSchema.params,
        data: req.params,
      });

      const data = await validateUtils.validateSchema({
        schema: attendanceSchema.update,
        data: req.body,
      });

      const updatedAttendance = await attendanceService.update({
        idAttendance,
        data,
      });

      const activeClassroom =
        await classroomStudentService.getActiveClassroomByStudentId({
          idStudent: updatedAttendance.student.idStudent,
        });

      return res.json({
        success: true,
        message: "Asistencia actualizada correctamente",
        attendance: {
          ...updatedAttendance,
          classroom: activeClassroom,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id: idAttendance } = await validateUtils.validateSchema({
        schema: attendanceSchema.params,
        data: req.params,
      });

      const deletedAttendance = await attendanceService.delete({
        idAttendance,
      });

      const activeClassroom =
        await classroomStudentService.getActiveClassroomByStudentId({
          idStudent: deletedAttendance.student.idStudent,
        });
      return res.json({
        success: true,
        message: "Asistencia eliminada correctamente",
        attendance: deletedAttendance,
        classroom: activeClassroom,
      });
    } catch (error) {
      next(error);
    }
  },
  // Dashboard Admin: resumen general de hoy
  getSummaryToday: async (req, res, next) => {
    try {
      const summary = await attendanceService.getAttendanceSummaryToday();
      return res.json({ success: true, data: summary });
    } catch (error) {
      next(error);
    }
  },

  // Dashboard Admin: resumen por grado
  getSummaryByGrade: async (req, res, next) => {
    try {
      const summary = await attendanceService.getAttendanceSummaryByGrade();
      return res.json({ success: true, data: summary });
    } catch (error) {
      next(error);
    }
  },

  // Dashboard Auxiliar: comportamiento AD/A/B/C
  getBehaviorSummary: async (req, res, next) => {
    try {
      const summary = await attendanceService.getBehaviorSummaryToday();
      return res.json({ success: true, data: summary });
    } catch (error) {
      next(error);
    }
  },

  // Dashboard Padre: resumen completo de sus hijos
  getSummaryByParent: async (req, res, next) => {
    try {
      const idParent = req.user.sub;
      const summary = await attendanceService.getAttendanceSummaryByParent({
        idParent,
      });
      return res.json({ success: true, data: summary });
    } catch (error) {
      next(error);
    }
  },
};

export { attendanceController };
