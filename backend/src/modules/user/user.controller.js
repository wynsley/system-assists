import { userService } from "./user.service.js";
import { userSchema } from "./user.schema.js";
import { authUtils } from "../../utils/auth.utils.js";
import { validateUtils } from "../../utils/validate.utils.js";
import { studentService } from "../student/student.service.js";
import { attendanceService } from "../attendance/attendance.service.js";

const userController = {
  create: async (req, res, next) => {
    try {
      const validate = await validateUtils.validateSchema({
        schema: userSchema.create,
        data: req.body,
      });

      const passwordHash = await authUtils.generatePasswordHash({
        password: validate.password,
      });

      const queryResult = await userService.create({
        ...validate,
        passwordHash,
      });

      return res.json({
        success: true,
        message: "Usuario creado correctamente",
        user: queryResult,
      });
    } catch (error) {
      next(error);
    }
  },
  get: async (req, res, next) => {
    try {
      const validate = await validateUtils.validateSchema({
        schema: userSchema.params,
        data: req.query,
      });

      const [users, total] = await userService.get(validate);

      return res.json({
        success: true,
        data: users,
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

  update: async (req, res, next) => {
    try {
      const { id: userId } = await validateUtils.validateSchema({
        schema: userSchema.params,
        data: req.params,
      });

      const data = await validateUtils.validateSchema({
        schema: userSchema.update,
        data: req.body,
      });

      if (data.password) {
        data.passwordHash = await authUtils.generatePasswordHash({
          password: data.password,
        });

        delete data.password;
        delete data.repassword;
      }

      const updatedUser = await userService.update(userId, data);

      return res.json({
        success: true,
        message: "Datos actualizados correctamente",
        user: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = await validateUtils.validateSchema({
        schema: userSchema.params,
        data: req.params,
      });
      const user = await userService.getById(id);

      return res.json({
        success: true,
        message: "Usuario encontrado",
        user,
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = await validateUtils.validateSchema({
        schema: userSchema.params,
        data: req.params,
      });
      const deletedUser = await userService.delete(id);

      return res.json({
        success: true,
        message: "Usuario eliminado correctamente",
        user: deletedUser,
      });
    } catch (error) {
      next(error);
    }
  },

  dashboard: async (req, res, next) => {
    try {
      const user = req.user;
      const data = {};
      switch (user.role) {
        case "ADMIN":
          data.totalStudents = await studentService.getCount();
          data.totalAttendanceToday = await attendanceService.getCountToday();
          data.totalAbsentsToday =
            Number(data.totalStudents) - Number(data.totalAttendanceToday);
          data.averageAttendanceToday = Math.round(
            (Number(data.totalAttendanceToday) / Number(data.totalStudents)) *
              100,
          );
          data.attendanceSummaryByGrade =
            await attendanceService.getAttendanceSummaryByGrade();
          break;
        case "AUXILIAR":
          data.totalStudents = await studentService.getCount();
          data.attendanceSummaryToday =
            await attendanceService.getAttendanceSummaryToday();
          data.behaviorSummaryToday =
            await attendanceService.getBehaviorSummaryToday();
          data.attendaceSummaryToday = await attendanceService.get({
            page: 1,
            limit: 5,
            sortBy: "createdAt",
            sortOrder: "desc",
          });
          break;
        case "PARENT": {
          console.error(user.idUser);
          data.mainSummary =
            await attendanceService.getAttendanceSummaryByParent({
              idParent: user.sub,
            });

          break;
        }
        default:
          return res.status(403).json({
            success: false,
            message: "Rol no autorizado para acceder al dashboard",
          });
      }

      return res.json({
        success: true,
        message: "Dashboard data retrieved successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};

export { userController };
