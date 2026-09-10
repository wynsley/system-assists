import z from "zod";

const nameField = ({ label, min, max, required, text = false }) => {
  const base = z
    .string()
    .trim()
    .min(1, `${label} es requerido`)
    .min(min, `${label} debe tener mínimo ${min} caracteres`)
    .max(max, `${label} no puede tener más de ${max} caracteres`)
    .transform((value) => value.replace(/\s+/g, " "));

  const baseText = z
    .string()
    .trim()
    .min(1, `${label} es requerido`)
    .min(min, `${label} debe tener mínimo ${min} caracteres`)
    .max(max, `${label} no puede tener más de ${max} caracteres`)
    .regex(
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
      `${label} solo puede contener letras y espacios`,
    )
    .transform((value) => value.replace(/\s+/g, " "));

  const schema = text ? base : baseText;

  return z.preprocess(
    (val) => val ?? "",
    required ? schema : schema.optional(),
  );
};

export { nameField };