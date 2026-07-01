const GENDER_LABELS = {
  M: "Masculino",
  F: "Femenino",
  O: "Otro",
};

const STATUS_LABELS = {
  ACTIVO: "Activo",
  INACTIVO: "Inactivo",
  SUSPENDIDO: "Suspendido",
  EXPULSADO: "Expulsado",
  TRANSFERIDO: "Transferido",
  GRADUADO: "Graduado",
  RETIRADO: "Retirado",
};

const STATUS_BADGE_COLORS = {
  ACTIVO: "bg-green-100 text-green-700",
  INACTIVO: "bg-gray-100 text-gray-700",
  SUSPENDIDO: "bg-yellow-100 text-yellow-700",
  EXPULSADO: "bg-red-100 text-red-700",
  TRANSFERIDO: "bg-blue-100 text-blue-700",
  GRADUADO: "bg-purple-100 text-purple-700",
  RETIRADO: "bg-orange-100 text-orange-700",
};

export { GENDER_LABELS, STATUS_LABELS, STATUS_BADGE_COLORS };