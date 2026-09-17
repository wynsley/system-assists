import { GiCheckMark, GiAlarmClock } from "react-icons/gi";
import { FiX } from "react-icons/fi";
import { MdOutlineFactCheck } from "react-icons/md";

const ATTENDANCE_WEEK_PARENT = {
  PRESENTE: {
    icon: <GiCheckMark size={22} className="text-green-600" />,
    label: "Asistió",
  },
  TARDANZA: {
    icon: <GiAlarmClock size={22} className="text-yellow-800" />,
    label: "Tarde",
  },
  JUSTIFICADA: {
    icon: <MdOutlineFactCheck size={22} className="text-blue-600" />,
    label: "Justificado",
  },
  FALTA: {
    icon: <FiX size={22} className="text-red-700" />,
    label: "Faltó",
  },
};

export { ATTENDANCE_WEEK_PARENT };