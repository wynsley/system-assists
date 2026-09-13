import { prisma } from "../config/prisma.js";

/**
 * Normaliza una fecha a medianoche (00:00:00) para comparaciones por día.
 */
const toDateOnly = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * true si la fecha cae en sábado o domingo.
 */
const isWeekend = (date) => {
  const day = date.getDay(); // 0 = domingo, 6 = sábado
  return day === 0 || day === 6;
};

/**
 * Trae todos los NonSchoolDay que se solapan con el rango [start, end].
 * Se usa una sola consulta y luego se revisa en memoria (son pocos registros al año).
 */
const getNonSchoolDaysInRange = async (start, end) => {
  return prisma.nonSchoolDay.findMany({
    where: {
      startDate: { lte: end },
      endDate: { gte: start },
    },
    select: { startDate: true, endDate: true },
  });
};

/**
 * true si `date` cae dentro de algún rango de NonSchoolDay ya cargado en memoria.
 */
const isNonSchoolDay = (date, nonSchoolDays) => {
  const d = toDateOnly(date).getTime();
  return nonSchoolDays.some((nsd) => {
    const start = toDateOnly(nsd.startDate).getTime();
    const end = toDateOnly(nsd.endDate).getTime();
    return d >= start && d <= end;
  });
};

/**
 * Devuelve el array de fechas (Date, una por día) que SÍ son día de clase
 * dentro de [start, end] inclusive: no son fin de semana ni NonSchoolDay.
 */
const getSchoolDaysInRange = async (start, end) => {
  const rangeStart = toDateOnly(start);
  const rangeEnd = toDateOnly(end);

  if (rangeStart > rangeEnd) return [];

  const nonSchoolDays = await getNonSchoolDaysInRange(rangeStart, rangeEnd);

  const days = [];
  const cursor = new Date(rangeStart);

  while (cursor <= rangeEnd) {
    if (!isWeekend(cursor) && !isNonSchoolDay(cursor, nonSchoolDays)) {
      days.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
};

/**
 * Cuenta cuántos días de clase hay en [start, end] inclusive.
 * Atajo cuando solo necesitas el número, no las fechas exactas.
 */
const countSchoolDaysInRange = async (start, end) => {
  const days = await getSchoolDaysInRange(start, end);
  return days.length;
};

export const schoolDateUtils = {
  toDateOnly,
  isWeekend,
  getNonSchoolDaysInRange,
  isNonSchoolDay,
  getSchoolDaysInRange,
  countSchoolDaysInRange,
};