import { HiClock } from "react-icons/hi2";
import { FaUserCheck, FaUsers, FaUserTimes } from "react-icons/fa";

export const statusBadge = {
  // Keys del backend (mayúscula) — para la tabla de asistencias
  PRESENTE: {
    label: "Presente",
    className: "bg-green-100 text-green-700",
    icon: FaUserCheck,
  },
  TARDANZA: {
    label: "Tardanza",
    className: "bg-yellow-100 text-yellow-700",
    icon: HiClock,
  },
  JUSTIFICADA: {
    label: "Justificada",
    className: "bg-blue-100 text-blue-700",
    icon: FaUserCheck,
  },

  // Keys para las cards de stats (del summaryToday)
  total: {
    label: "Total",
    className: "bg-blue-100 text-blue-700",
    icon: FaUsers,
  },
  present: {
    label: "Presente",
    className: "bg-green-100 text-green-700",
    icon: FaUserCheck,
  },
  late: {
    label: "Tardanza",
    className: "bg-yellow-100 text-yellow-700",
    icon: HiClock,
  },
  absent: {
    label: "Falta",
    className: "bg-red-100 text-red-700",
    icon: FaUserTimes,
  },
};