import { useAuth } from "./useAuth";
import { ROLE_LABELS } from "../../config/roleLabels";

export const useGreeting = () => {

  const { userData } = useAuth();
  const role = userData?.role || "ADMIN";
  console.log(userData?.name)

  const greetingLabel = ROLE_LABELS[role] || "Usuario";

  const hour = new Date().getHours();
  const greetingHour =
    hour < 12
      ? "Buenos días"
      : hour < 18
      ? "Buenas tardes"
      : "Buenas noches";

  return {
    greetingHour,
    greetingLabel,
    role,
    name: userData?.name
  };
};