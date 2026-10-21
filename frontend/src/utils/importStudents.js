import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { ValidationCreateStudent } from "../validations/students/validateRegisterStudent";

const MAX_ROWS = 1000;
const MAX_SIZE_MB = 5;

// ---------- helpers ----------
const normalize = (s) =>
  String(s ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");

// Encabezado del Excel -> campo interno
const COLUMN_ALIASES = {
  firstname: ["nombre", "nombres", "firstname"],
  lastname: ["apellido", "apellidos", "lastname"],
  dni: ["dni", "documento"],
  gender: ["sexo", "genero"],
  phone: ["telefono", "celular"],
  email: ["correo", "email", "correo electronico"],
  status: ["estado"],
};
const REQUIRED_COLUMNS = ["firstname", "lastname", "dni", "gender"];
const COLUMN_LABELS = {
  firstname: "Nombres",
  lastname: "Apellidos",
  dni: "DNI",
  gender: "Sexo",
};

const GENDER_MAP = {
  m: "M", masculino: "M", hombre: "M",
  f: "F", femenino: "F", mujer: "F",
  o: "O", otro: "O",
};

// Convierte cualquier tipo de celda de ExcelJS a texto
const cellToString = (cell) => {
  const v = cell?.value;
  if (v == null) return "";
  if (v instanceof Date) return v.toISOString();
  if (typeof v === "object") {
    if (v.richText) return v.richText.map((t) => t.text).join("");
    if (v.result != null) return String(v.result); // fórmulas
    if (v.text != null) return String(v.text);     // hipervínculos (correos)
    return "";
  }
  return String(v);
};

// 915554423 | +51 915 554 423 | 51915554423 -> 915554423
const normalizePhone = (value) => {
  let digits = value.replace(/[^\d]/g, "");
  if (/^519\d{8}$/.test(digits)) digits = digits.slice(2);
  return digits; // si no cumple /^9\d{8}$/, Joi reporta el error
};

const cleanRow = (raw) => {
  const row = {};
  for (const [field, value] of Object.entries(raw)) {
    const v = String(value ?? "").trim();
    if (v !== "") row[field] = v; // vacío = la clave no se agrega
  }
  // Excel se come los ceros a la izquierda del DNI
  if (row.dni && /^\d{1,7}$/.test(row.dni)) row.dni = row.dni.padStart(8, "0");
  if (row.gender) row.gender = GENDER_MAP[normalize(row.gender)] ?? row.gender;
  row.status = row.status ? row.status.toUpperCase() : "ACTIVO"; // default
  if (row.phone) row.phone = normalizePhone(row.phone);
  return row;
};

// ---------- lectura del archivo ----------
async function readSheet(file) {
  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.load(await file.arrayBuffer());
  } catch {
    throw new Error("No se pudo leer el archivo. Verifica que sea un .xlsx válido");
  }

  const ws = workbook.worksheets[0];
  if (!ws) throw new Error("El archivo no tiene hojas");

  // Fila 1 = encabezados -> { numeroColumna: campoInterno }
  const colToField = {};
  ws.getRow(1).eachCell({ includeEmpty: false }, (cell, col) => {
    const n = normalize(cellToString(cell));
    for (const [field, aliases] of Object.entries(COLUMN_ALIASES)) {
      if (aliases.includes(n)) colToField[col] = field;
    }
  });

  const found = Object.values(colToField);
  const missing = REQUIRED_COLUMNS.filter((c) => !found.includes(c));
  if (missing.length) {
    throw new Error(
      `Faltan columnas obligatorias: ${missing.map((m) => COLUMN_LABELS[m]).join(", ")}`
    );
  }

  const rows = [];
  ws.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return;
    const raw = {};
    for (const [col, field] of Object.entries(colToField)) {
      raw[field] = cellToString(row.getCell(Number(col)));
    }
    rows.push({ row: rowNumber, raw }); // rowNumber = fila real de Excel
  });
  return rows;
}

// ---------- API pública ----------
export async function parseStudentsFile(file) {
  if (!/\.xlsx$/i.test(file.name))
    throw new Error("Formato no permitido. Usa un archivo .xlsx");
  if (file.size > MAX_SIZE_MB * 1024 * 1024)
    throw new Error(`El archivo supera los ${MAX_SIZE_MB} MB`);

  const rows = await readSheet(file);
  if (!rows.length) throw new Error("El archivo no tiene datos");
  if (rows.length > MAX_ROWS)
    throw new Error(`Máximo ${MAX_ROWS} filas por importación`);

  const valid = [];
  const invalid = [];
  const seen = { dni: new Set(), email: new Set(), phone: new Set() };
  const LABELS = { dni: "DNI", email: "Correo", phone: "Teléfono" };

  for (const { row, raw } of rows) {
    const cleaned = cleanRow(raw);

    // Fila sin datos reales (solo trae el status por defecto): se ignora
    const { status, ...rest } = cleaned;
    if (Object.keys(rest).length === 0) continue;

    const { value, error } = ValidationCreateStudent.validate(cleaned, {
      abortEarly: false,
      stripUnknown: true,
    });

    const errors = error ? error.details.map((d) => d.message) : [];

    if (!error) {
      for (const f of ["dni", "email", "phone"]) {
        if (value[f] && seen[f].has(value[f]))
          errors.push(`${LABELS[f]} repetido en el archivo`);
      }
    }

    if (errors.length) {
      invalid.push({
        row,
        name: `${cleaned.firstname ?? ""} ${cleaned.lastname ?? ""}`.trim() || "—",
        dni: cleaned.dni ?? "—",
        errors,
      });
    } else {
      for (const f of ["dni", "email", "phone"]) if (value[f]) seen[f].add(value[f]);
      valid.push({ row, ...value });
    }
  }

  if (valid.length + invalid.length === 0)
    throw new Error("El archivo no tiene filas con datos");

  return { valid, invalid, total: valid.length + invalid.length };
}

export async function downloadTemplate() {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Estudiantes");

  ws.columns = [
    { header: "Nombres", key: "firstname", width: 22 },
    { header: "Apellidos", key: "lastname", width: 26 },
    { header: "DNI", key: "dni", width: 12, style: { numFmt: "@" } },       // texto
    { header: "Sexo", key: "gender", width: 12 },
    { header: "Teléfono", key: "phone", width: 14, style: { numFmt: "@" } }, // texto
    { header: "Correo", key: "email", width: 30 },
    { header: "Estado", key: "status", width: 14 },
  ];

  ws.addRow({
    firstname: "Juan Carlos",
    lastname: "Pérez Gómez",
    dni: "12345678",
    gender: "Masculino",
    phone: "987654321",
    email: "juan@correo.com",
    status: "Activo",
  });

  ws.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  ws.getRow(1).fill = {
    type: "pattern", pattern: "solid", fgColor: { argb: "FF06293A" },
  };

  // Lista desplegable de sexo y estado para la fila 2 en adelante
  for (let r = 2; r <= 1001; r++) {
    ws.getCell(`D${r}`).dataValidation = {
      type: "list", allowBlank: true,
      formulae: ['"Masculino,Femenino,Otro"'],
    };
    ws.getCell(`G${r}`).dataValidation = {
      type: "list", allowBlank: true,
      formulae: ['"Activo,Inactivo,Suspendido,Expulsado,Transferido,Graduado,Retirado"'],
    };
  }

  const buffer = await wb.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    "plantilla_estudiantes.xlsx"
  );
}