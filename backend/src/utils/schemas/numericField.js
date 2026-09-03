import z from "zod";

const numericField = ({ label, min, max, defaultValue, required }) => {
  let schema = z
    .string()
    .refine((val) => !isNaN(Number(val)) && val.trim() !== "", {
      message: `${label} debe ser un número`,
    })
    .refine((val) => Number.isInteger(Number(val)), {
      message: `${label} debe ser un número entero`,
    });

  if (min !== undefined) {
    schema = schema.refine((val) => Number(val) >= min, {
      message: `${label} debe ser mayor o igual a ${min}`,
    });
  }

  if (max !== undefined) {
    schema = schema.refine((val) => Number(val) <= max, {
      message: `${label} no puede ser mayor a ${max}`,
    });
  }

  const transformed = schema.transform((val) => Number(val));

  return z.preprocess((val) => {
    if (val === undefined || val === "") return String(defaultValue);
    return String(val);
  }, required ? transformed : transformed.optional());
};

export { numericField };