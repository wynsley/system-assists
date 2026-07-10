import { IoAnalyticsSharp } from "react-icons/io5";
import { FaUserCheck, FaUsers } from "react-icons/fa";
import { TbClockHour3Filled } from "react-icons/tb";

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
    className: "bg-yellow-100 text-yellow-700",
    icon: TbClockHour3Filled,
  },
  {
    label: "Asistencia promedio",
    value: `${averageAttendance}%`,
    className: "bg-yellow-100 text-yellow-700",
    icon: IoAnalyticsSharp,
  },
];