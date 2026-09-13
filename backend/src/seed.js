import { prisma } from "./config/prisma.js";
import { userService } from "./modules/user/user.service.js";
import { authUtils } from "./utils/auth.utils.js";

// ─── Helpers ────────────────────────────────────────────────────────────────

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomDni = () => String(Math.floor(10000000 + Math.random() * 90000000));

const randomPhone = () =>
  "9" + String(Math.floor(10000000 + Math.random() * 90000000));

/** Genera una fecha aleatoria dentro de los últimos N días, evitando fines de semana */
const randomRecentDate = (daysBack = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  const day = date.getDay();
  if (day === 0) date.setDate(date.getDate() - 2);
  if (day === 6) date.setDate(date.getDate() - 1);
  date.setHours(0, 0, 0, 0);
  return date;
};

// ─── Datos base ─────────────────────────────────────────────────────────────

const MALE_NAMES = [
  "Carlos", "Luis", "José", "Miguel", "Juan", "Pedro", "Andrés", "Rafael",
  "Sergio", "Diego", "Alejandro", "Fernando", "Ricardo", "Eduardo", "Manuel",
  "Roberto", "Héctor", "Víctor", "Daniel", "Pablo",
];

const FEMALE_NAMES = [
  "María", "Ana", "Lucía", "Sofía", "Isabella", "Valentina", "Camila",
  "Natalia", "Gabriela", "Paola", "Andrea", "Patricia", "Rosa", "Carmen",
  "Sandra", "Mónica", "Laura", "Elena", "Claudia", "Daniela",
];

const LASTNAMES = [
  "García", "Rodríguez", "López", "Martínez", "González", "Pérez", "Torres",
  "Ramírez", "Flores", "Rivera", "Morales", "Ortiz", "Herrera", "Medina",
  "Castro", "Vargas", "Reyes", "Soto", "Mendoza", "Jiménez", "Ramos",
  "Alvarado", "Paredes", "Quispe", "Huanca", "Mamani", "Condori", "Ccopa",
  "Apaza", "Cárdenas",
];

const SECTION_NAMES = ["A", "B", "C", "D"];
const GRADE_LEVELS = [1, 2, 3, 4, 5, 6];

const RELATIONSHIPS = [
  "PADRE", "MADRE", "ABUELO", "ABUELA", "TÍO", "TÍA", "APODERADO", "OTRO",
];

const STUDENT_STATUSES = [
  "ACTIVO", "ACTIVO", "ACTIVO", "INACTIVO", "SUSPENDIDO",
];

const ATTENDANCE_STATUSES = [
  "PRESENTE", "PRESENTE", "PRESENTE", "PRESENTE",
  "TARDANZA", "TARDANZA",
  "JUSTIFICADA",
];

const BEHAVIOR_BASELINE_SCORE = 100;

// Catálogo de incidencias — ahora usa IncidentPolarity (POSITIVO/NEGATIVO) y "points"
const INCIDENT_CATALOG_DATA = [
  // NEGATIVO - leves
  { name: "Falta de uniforme", description: "El estudiante no porta el uniforme reglamentario.", type: "NEGATIVO", points: 2 },
  { name: "Tardanza reiterada", description: "El estudiante llega tarde más de tres veces en la semana.", type: "NEGATIVO", points: 3 },
  { name: "Uso de celular en clase", description: "El estudiante usa el teléfono celular durante la clase sin autorización.", type: "NEGATIVO", points: 2 },
  { name: "Desorden en el aula", description: "El estudiante genera desorden e interrumpe el dictado de clases.", type: "NEGATIVO", points: 2 },
  { name: "No presentó tareas", description: "El estudiante no entregó las tareas asignadas.", type: "NEGATIVO", points: 1 },
  // NEGATIVO - graves
  { name: "Agresión verbal", description: "El estudiante insultó o amenazó verbalmente a un compañero o docente.", type: "NEGATIVO", points: 8 },
  { name: "Daño a la propiedad escolar", description: "El estudiante dañó mobiliario o infraestructura del colegio.", type: "NEGATIVO", points: 10 },
  { name: "Copia en examen", description: "El estudiante fue sorprendido copiando durante una evaluación.", type: "NEGATIVO", points: 7 },
  { name: "Falsificación de firma", description: "El estudiante falsificó la firma de un apoderado en documentos escolares.", type: "NEGATIVO", points: 10 },
  // NEGATIVO - muy graves
  { name: "Agresión física", description: "El estudiante agredió físicamente a un compañero o personal del colegio.", type: "NEGATIVO", points: 20 },
  { name: "Posesión de sustancias prohibidas", description: "El estudiante portaba sustancias prohibidas dentro del colegio.", type: "NEGATIVO", points: 25 },
  { name: "Acoso escolar", description: "El estudiante realizó actos de bullying de forma sistemática.", type: "NEGATIVO", points: 20 },
  // POSITIVO
  { name: "Participación destacada", description: "El estudiante participó activamente y de forma destacada en clase.", type: "POSITIVO", points: 3 },
  { name: "Ayuda a un compañero", description: "El estudiante ayudó de forma voluntaria a un compañero con dificultades.", type: "POSITIVO", points: 2 },
  { name: "Trabajo en equipo ejemplar", description: "El estudiante mostró un desempeño ejemplar trabajando en equipo.", type: "POSITIVO", points: 3 },
  { name: "Puntualidad sobresaliente", description: "El estudiante mantuvo puntualidad sobresaliente durante el periodo.", type: "POSITIVO", points: 2 },
];

// ─── Generadores ────────────────────────────────────────────────────────────

const normalize = (s) =>
  s.toLowerCase().replace(
    /[áéíóúñ]/g,
    (c) => ({ á: "a", é: "e", í: "i", ó: "o", ú: "u", ñ: "n" })[c] || c,
  );

const genEmail = (firstname, lastname, suffix = "") =>
  `${normalize(firstname)}.${normalize(lastname)}${suffix}@school.edu.pe`;

/** Construye los 4 bimestres del año dado (fechas aproximadas del calendario escolar peruano) */
const buildAcademicPeriods = (year) => [
  { year, bimester: 1, startDate: new Date(`${year}-03-01`), endDate: new Date(`${year}-05-15`) },
  { year, bimester: 2, startDate: new Date(`${year}-05-16`), endDate: new Date(`${year}-07-31`) },
  { year, bimester: 3, startDate: new Date(`${year}-08-01`), endDate: new Date(`${year}-10-15`) },
  { year, bimester: 4, startDate: new Date(`${year}-10-16`), endDate: new Date(`${year}-12-20`) },
];

/** Encuentra el AcademicPeriod (ya persistido) que contiene una fecha dada */
const findPeriodForDate = (periods, date) =>
  periods.find((p) => date >= p.startDate && date <= p.endDate);

// ─── Seed principal ──────────────────────────────────────────────────────────

const seed = async () => {
  console.log("🌱 Iniciando seed...\n");

  // ── 1. Grados ──────────────────────────────────────────────────────────────
  console.log("📚 Creando grados...");
  const grades = [];
  for (const level of GRADE_LEVELS) {
    const grade = await prisma.grade.upsert({
      where: { level },
      update: {},
      create: { level },
    });
    grades.push(grade);
    console.log(`  ✔ Grado ${level} creado (id: ${grade.idGrade})`);
  }

  // ── 2. Secciones ───────────────────────────────────────────────────────────
  console.log("\n🏫 Creando secciones...");
  const sections = [];
  for (const grade of grades) {
    for (const name of SECTION_NAMES) {
      const existing = await prisma.section.findFirst({
        where: { name, idGrade: grade.idGrade },
      });
      const section = existing
        ? existing
        : await prisma.section.create({
            data: { name, idGrade: grade.idGrade },
          });
      sections.push(section);
      console.log(
        `  ✔ Sección ${name} - Grado ${grade.level} (id: ${section.idSection})`,
      );
    }
  }

  // ── 3. Aulas (Classrooms) ──────────────────────────────────────────────────
  console.log("\n🚪 Creando aulas...");
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear];
  const classrooms = [];

  for (const section of sections) {
    // sortOrder determinístico: grado * 10 + índice de sección (A=1, B=2, C=3, D=4)
    const grade = grades.find((g) => g.idGrade === section.idGrade);
    const sectionIndex = SECTION_NAMES.indexOf(section.name) + 1;
    const sortOrder = grade.level * 10 + sectionIndex;

    for (const year of years) {
      const existing = await prisma.classroom.findUnique({
        where: { year_idSection: { year, idSection: section.idSection } },
      });
      const classroom = existing
        ? existing
        : await prisma.classroom.create({
            data: {
              year,
              idSection: section.idSection,
              status: year === currentYear ? "ACTIVO" : "INACTIVO",
              sortOrder,
            },
          });
      classrooms.push(classroom);
    }
  }
  console.log(`  ✔ ${classrooms.length} aulas creadas`);

  // ── 4. Auxiliares ──────────────────────────────────────────────────────────
  console.log("\n👩‍🏫 Creando auxiliares...");
  const auxiliarData = [
    { firstname: "Elena", lastname: "Torres" },
    { firstname: "Roberto", lastname: "Vargas" },
    { firstname: "Patricia", lastname: "Mendoza" },
    { firstname: "Sergio", lastname: "Quispe" },
    { firstname: "Claudia", lastname: "Ramos" },
    { firstname: "Marco", lastname: "Paredes" },
    { firstname: "Liliana", lastname: "Castro" },
    { firstname: "Javier", lastname: "Huanca" },
  ];

  const auxiliares = [];
  for (const aux of auxiliarData) {
    const email = genEmail(aux.firstname, aux.lastname);
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      auxiliares.push(existing);
      console.log(`  ⚠ Auxiliar ${aux.firstname} ${aux.lastname} ya existe`);
      continue;
    }
    const passwordHash = await authUtils.generatePasswordHash({
      password: "password123",
    });
    const result = await userService.create({
      firstname: aux.firstname,
      lastname: aux.lastname,
      email,
      passwordHash,
      role: "AUXILIAR",
    });
    auxiliares.push(result.user);
    console.log(`  ✔ Auxiliar creado: ${aux.firstname} ${aux.lastname}`);
  }

  // ── 5. ClassroomAuxiliar ───────────────────────────────────────────────────
  console.log("\n🔗 Asignando auxiliares a aulas activas...");
  const activeClassroomsForAux = classrooms.filter((c) => c.status === "ACTIVO");
  let caCount = 0;
  for (const classroom of activeClassroomsForAux) {
    const numAux = Math.random() > 0.6 ? 2 : 1;
    const shuffledAux = [...auxiliares].sort(() => Math.random() - 0.5).slice(0, numAux);
    for (const aux of shuffledAux) {
      try {
        await prisma.classroomAuxiliar.create({
          data: { idClassroom: classroom.idClassroom, idAuxiliar: aux.idUser },
        });
        caCount++;
      } catch {
        // duplicado, ignorar
      }
    }
  }
  console.log(`  ✔ ${caCount} asignaciones aula-auxiliar creadas`);

  // ── 6. Padres ──────────────────────────────────────────────────────────────
  console.log("\n👨‍👩‍👧 Creando padres/apoderados...");
  const parentPool = [];
  const usedEmails = new Set();

  for (let i = 0; i < 40; i++) {
    const isMale = Math.random() > 0.4;
    const firstname = randomItem(isMale ? MALE_NAMES : FEMALE_NAMES);
    const lastname = randomItem(LASTNAMES);
    let emailSuffix = "";
    let email = genEmail(firstname, lastname, emailSuffix);

    let attempt = 0;
    while (usedEmails.has(email)) {
      attempt++;
      emailSuffix = String(attempt);
      email = genEmail(firstname, lastname, emailSuffix);
    }
    usedEmails.add(email);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      parentPool.push(existing);
      continue;
    }
    const passwordHash = await authUtils.generatePasswordHash({
      password: "password123",
    });
    const result = await userService.create({
      firstname,
      lastname,
      email,
      passwordHash,
      role: "PARENT",
    });
    parentPool.push(result.user);
  }
  console.log(`  ✔ ${parentPool.length} padres/apoderados creados`);

  // ── 7. Estudiantes ─────────────────────────────────────────────────────────
  console.log("\n🎒 Creando estudiantes...");
  const students = [];
  const usedDnis = new Set();
  const usedStudentEmails = new Set();
  const usedPhones = new Set();

  for (let i = 0; i < 120; i++) {
    const gender = randomItem(["M", "M", "F", "F", "O"]);
    const firstname =
      gender === "M"
        ? randomItem(MALE_NAMES)
        : gender === "F"
          ? randomItem(FEMALE_NAMES)
          : randomItem([...MALE_NAMES, ...FEMALE_NAMES]);
    const lastname = `${randomItem(LASTNAMES)} ${randomItem(LASTNAMES)}`;

    let dni = randomDni();
    while (usedDnis.has(dni)) dni = randomDni();
    usedDnis.add(dni);

    let email = null;
    if (Math.random() > 0.4) {
      let base = genEmail(firstname, lastname.split(" ")[0], String(i));
      while (usedStudentEmails.has(base)) {
        base = genEmail(
          firstname,
          lastname.split(" ")[0],
          String(i) + Math.floor(Math.random() * 100),
        );
      }
      usedStudentEmails.add(base);
      email = base;
    }

    let phone = null;
    if (Math.random() > 0.5) {
      let p = randomPhone();
      while (usedPhones.has(p)) p = randomPhone();
      usedPhones.add(p);
      phone = p;
    }

    try {
      const student = await prisma.student.create({
        data: {
          firstname,
          lastname,
          dni,
          email,
          phone,
          gender,
          status: randomItem(STUDENT_STATUSES),
        },
      });
      students.push(student);
    } catch (err) {
      console.warn(`  ⚠ No se pudo crear estudiante #${i}: ${err.message}`);
    }
  }
  console.log(`  ✔ ${students.length} estudiantes creados`);

  // ── 8. StudentParent ───────────────────────────────────────────────────────
  console.log("\n🔗 Vinculando estudiantes con padres...");
  let spCount = 0;
  for (const student of students) {
    const numParents = Math.random() > 0.4 ? 2 : 1;
    const shuffled = [...parentPool].sort(() => Math.random() - 0.5);
    const chosen = shuffled.slice(0, numParents);
    const usedParentIds = new Set();

    for (const parent of chosen) {
      if (usedParentIds.has(parent.idUser)) continue;
      usedParentIds.add(parent.idUser);
      try {
        await prisma.studentParent.create({
          data: {
            idStudent: student.idStudent,
            idParent: parent.idUser,
            relationship: randomItem(RELATIONSHIPS),
          },
        });
        spCount++;
      } catch {
        // relación duplicada, ignorar
      }
    }
  }
  console.log(`  ✔ ${spCount} relaciones estudiante-apoderado creadas`);

  // ── 9. ClassroomStudent ────────────────────────────────────────────────────
  console.log("\n📋 Matriculando estudiantes en aulas...");

  const activeClassrooms = classrooms.filter((c) => c.status === "ACTIVO");
  const oldClassrooms = classrooms.filter((c) => c.status === "INACTIVO");
  let csCount = 0;

  const shuffledStudents = [...students].sort(() => Math.random() - 0.5);
  let idx = 0;

  for (const classroom of activeClassrooms) {
    const classSize = Math.floor(Math.random() * 4) + 5; // 5 a 8
    for (let k = 0; k < classSize && idx < shuffledStudents.length; k++, idx++) {
      try {
        await prisma.classroomStudent.create({
          data: {
            idClassroom: classroom.idClassroom,
            idStudent: shuffledStudents[idx].idStudent,
          },
        });
        csCount++;
      } catch {
        // duplicado, ignorar (ClassroomStudent.idStudent es @unique)
      }
    }
  }

  for (const classroom of oldClassrooms) {
    const classSize = Math.floor(Math.random() * 3) + 3;
    for (let k = 0; k < classSize && idx < shuffledStudents.length; k++, idx++) {
      try {
        await prisma.classroomStudent.create({
          data: {
            idClassroom: classroom.idClassroom,
            idStudent: shuffledStudents[idx].idStudent,
          },
        });
        csCount++;
      } catch {
        // duplicado, ignorar
      }
    }
  }
  console.log(`  ✔ ${csCount} matrículas creadas`);

  // ── 10. Catálogo de incidencias ─────────────────────────────────────────────
  console.log("\n📖 Creando catálogo de incidencias...");
  const incidentCatalog = [];
  for (const item of INCIDENT_CATALOG_DATA) {
    const catalog = await prisma.incidentCatalog.upsert({
      where: { name: item.name },
      update: {},
      create: {
        name: item.name,
        description: item.description,
        type: item.type,
        points: item.points,
      },
    });
    incidentCatalog.push(catalog);
    console.log(`  ✔ ${catalog.type} - ${catalog.name} (${catalog.points} pts)`);
  }

  // ── 11. Periodos académicos ──────────────────────────────────────────────────
  console.log("\n🗓️  Creando periodos académicos...");
  const periods = [];
  for (const year of years) {
    for (const p of buildAcademicPeriods(year)) {
      const period = await prisma.academicPeriod.upsert({
        where: { year_bimester: { year: p.year, bimester: p.bimester } },
        update: {},
        create: p,
      });
      periods.push(period);
    }
  }
  console.log(`  ✔ ${periods.length} periodos académicos creados`);

  // ── 12. Asistencias ────────────────────────────────────────────────────────
  console.log("\n📅 Creando asistencias...");

  const activeStudents = students.filter((s) => s.status === "ACTIVO");
  let attCount = 0;

  for (const student of activeStudents) {
    const numRecords = Math.floor(Math.random() * 3) + 2; // 2 a 4 registros
    const usedDates = new Set();

    for (let r = 0; r < numRecords; r++) {
      let date = randomRecentDate(45);
      let attempts = 0;
      while (usedDates.has(date.toISOString()) && attempts < 10) {
        date = randomRecentDate(45);
        attempts++;
      }
      if (usedDates.has(date.toISOString())) continue;
      usedDates.add(date.toISOString());

      const auxiliar = randomItem(auxiliares);
      const status = randomItem(ATTENDANCE_STATUSES);
      const note =
        status === "TARDANZA"
          ? "Llegó tarde sin justificación."
          : status === "JUSTIFICADA"
            ? "Presentó certificado médico."
            : null;

      try {
        await prisma.attendance.create({
          data: {
            date,
            status,
            note,
            idStudent: student.idStudent,
            idAuxiliar: auxiliar.idUser,
          },
        });
        attCount++;
      } catch {
        // @@unique([idStudent, date]) duplicado, ignorar
      }
    }
  }
  console.log(`  ✔ ${attCount} registros de asistencia creados`);

  // ── 13. Behavior (línea base por estudiante activo y periodo actual) ────────
  console.log("\n📊 Creando comportamiento base (Behavior)...");
  const currentPeriod =
    findPeriodForDate(periods, new Date()) ||
    periods.find((p) => p.year === currentYear) ||
    periods[0];

  const behaviorByStudent = new Map(); // idStudent -> Behavior
  let behCount = 0;
  for (const student of activeStudents) {
    const behavior = await prisma.behavior.upsert({
      where: {
        idStudent_idPeriod: {
          idStudent: student.idStudent,
          idPeriod: currentPeriod.idPeriod,
        },
      },
      update: {},
      create: {
        idStudent: student.idStudent,
        idPeriod: currentPeriod.idPeriod,
        score: BEHAVIOR_BASELINE_SCORE,
      },
    });
    behaviorByStudent.set(student.idStudent, behavior);
    behCount++;
  }
  console.log(`  ✔ ${behCount} registros de comportamiento base creados (periodo ${currentPeriod.bimester}/${currentPeriod.year})`);

  // ── 14. Incidencias + BehaviorHistory ────────────────────────────────────────
  console.log("\n⚠️  Creando incidencias...");
  let incCount = 0;
  let bhCount = 0;

  // ~30% de los estudiantes activos tienen al menos una incidencia
  const studentsWithIncidents = activeStudents
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(activeStudents.length * 0.3));

  for (const student of studentsWithIncidents) {
    const numIncidents = Math.floor(Math.random() * 3) + 1; // 1 a 3
    const usedKeys = new Set(); // evitar @@unique([idStudent, date, idIncidentCatalog])

    for (let r = 0; r < numIncidents; r++) {
      const date = randomRecentDate(60);
      const catalog = randomItem(incidentCatalog);
      const key = `${student.idStudent}_${date.toISOString()}_${catalog.idIncidentCatalog}`;
      if (usedKeys.has(key)) continue;
      usedKeys.add(key);

      const auxiliar = randomItem(auxiliares);
      const note =
        catalog.type === "NEGATIVO" && catalog.points >= 15
          ? "Se notificó a los apoderados y se derivó a dirección."
          : catalog.type === "NEGATIVO" && catalog.points >= 5
            ? "Se realizó llamado de atención formal."
            : catalog.type === "POSITIVO"
              ? "Reconocimiento registrado en el expediente del estudiante."
              : null;

      try {
        const incident = await prisma.incident.create({
          data: {
            date,
            note,
            idStudent: student.idStudent,
            idAuxiliar: auxiliar.idUser,
            idIncidentCatalog: catalog.idIncidentCatalog,
          },
        });
        incCount++;

        // Actualiza el Behavior del periodo correspondiente a la fecha del incidente
        const period = findPeriodForDate(periods, date) || currentPeriod;
        let behavior = behaviorByStudent.get(student.idStudent);

        // Si el incidente cae en un periodo distinto al que ya tenemos cacheado, buscamos/creamos ese Behavior
        if (!behavior || behavior.idPeriod !== period.idPeriod) {
          behavior = await prisma.behavior.upsert({
            where: {
              idStudent_idPeriod: {
                idStudent: student.idStudent,
                idPeriod: period.idPeriod,
              },
            },
            update: {},
            create: {
              idStudent: student.idStudent,
              idPeriod: period.idPeriod,
              score: BEHAVIOR_BASELINE_SCORE,
            },
          });
        }

        const previousScore = behavior.score;
        const delta = catalog.type === "POSITIVO" ? catalog.points : -catalog.points;
        const newScore = previousScore + delta;

        const updatedBehavior = await prisma.behavior.update({
          where: { idBehavior: behavior.idBehavior },
          data: { score: newScore },
        });
        behaviorByStudent.set(student.idStudent, updatedBehavior);

        await prisma.behaviorHistory.create({
          data: {
            idBehavior: updatedBehavior.idBehavior,
            previousScore,
            newScore,
            description: `${catalog.type === "POSITIVO" ? "+" : "-"}${catalog.points} pts por: ${catalog.name}`,
            idAuxiliar: auxiliar.idUser,
            type: "INCIDENTE",
            idIncident: incident.idIncident,
            date,
          },
        });
        bhCount++;
      } catch {
        // @@unique duplicado, ignorar
      }
    }
  }
  console.log(`  ✔ ${incCount} incidencias creadas`);
  console.log(`  ✔ ${bhCount} registros de historial de comportamiento creados`);

  // ─── Resumen ────────────────────────────────────────────────────────────────
  console.log("\n✅ Seed completado:");
  console.log(`   Grados:                 ${grades.length}`);
  console.log(`   Secciones:              ${sections.length}`);
  console.log(`   Aulas:                  ${classrooms.length}`);
  console.log(`   Auxiliares:             ${auxiliares.length}`);
  console.log(`   Aula-Auxiliar:          ${caCount}`);
  console.log(`   Padres:                 ${parentPool.length}`);
  console.log(`   Estudiantes:            ${students.length}`);
  console.log(`   Vínculos padre:         ${spCount}`);
  console.log(`   Matrículas:             ${csCount}`);
  console.log(`   Catálogo incid.:        ${incidentCatalog.length}`);
  console.log(`   Periodos académicos:    ${periods.length}`);
  console.log(`   Asistencias:            ${attCount}`);
  console.log(`   Behavior base:          ${behCount}`);
  console.log(`   Incidencias:            ${incCount}`);
  console.log(`   Historial comport.:     ${bhCount}`);
};

seed()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());