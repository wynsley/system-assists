  const buildClassroomFilter = ({ idAuxiliar, grade, section } = {}) => {
    const classroomFilter = {
      status: "ACTIVO",
    };
    if (idAuxiliar) {
      classroomFilter.classroomAuxiliars = {
        some: { idAuxiliar },
      };
    }

    if (grade || section) {
      classroomFilter.section = {
        ...(grade
          ? { grade: { level: grade } }
          : {}),
        ...(section
          ? { name: section }
          : {}),
      };
    }
    return classroomFilter;
  }

  export { buildClassroomFilter };