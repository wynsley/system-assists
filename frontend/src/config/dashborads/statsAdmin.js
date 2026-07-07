import { IoAnalyticsSharp } from "react-icons/io5";
import { FaUserCheck, FaUsers, FaUserTimes } from "react-icons/fa";

export const getStatsAdmin = ({
  totalStudents,
  presentStudents,
  lateStudents,
  averageAttendance,
}) => [
  {
    label: "Estudiantes",
    value: totalStudents,
    className: "bg-blue-100 text-blue-700",
    icon: FaUsers,
  },
  {
    label: "Presentes",
    value: presentStudents,
    className: "bg-green-100 text-green-700",
    icon: FaUserCheck,
  },
  {
    label: "Tardanzas",
    value: lateStudents,
    className: "bg-red-100 text-red-700",
    icon: FaUserTimes,
  },
  {
    label: "Asistencia promedio",
    value: `${averageAttendance}%`,
    className: "bg-yellow-100 text-yellow-700",
    icon: IoAnalyticsSharp,
  },
];