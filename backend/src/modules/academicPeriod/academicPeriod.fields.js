const academicPeriodFields = {
  create: { 
    idPeriod: true, 
    year: true, 
    bimester: true, 
    startDate: true, 
    endDate: true 
  },
  update: ["year", "bimester", "startDate", "endDate"],
  select: { 
    idPeriod: true, 
    year: true, 
    bimester: true, 
    startDate: true, 
    endDate: true 
  },
  
  sort: ["year", "bimester", "startDate"],
  search: ["year", "bimester"],
};
export { academicPeriodFields };