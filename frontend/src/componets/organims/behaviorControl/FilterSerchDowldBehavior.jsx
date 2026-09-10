import { Select } from "../../atoms/select";
import { Search } from "../../molecules/search";
import { FiltersGradeSection } from "../../molecules/filtersGradeSection";
import { useFilterOptions } from "../../../hooks/hooksAssistant/useFilterOptions";


function FiltersBehavior({
  search,
  setSearch,
  grade,
  setGrade,
  section,
  setSection,
  students,
  showBehaviorFilter,
  selectedPeriod,
  setSelectedPeriod,
  periods
}) {

  const { gradeOptions, sectionOptions } = useFilterOptions(students);

  return (
    <div className="grid lg:grid-cols-2 gap-5 mt-8">
      <div className="flex items-center justify-between gap-3">
        <Search
          search={search}
          setSearch={setSearch}
        />
        
        <Select
          name="period"
          value={selectedPeriod ?? ""}
          onChange={(e) => setSelectedPeriod(Number(e.target.value))}
          options={periods.map((p) => ({
            value: p.idPeriod,
            text: `${p.bimester}° Bimestre ${p.year}`,
          }))}
          variant="primary"
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <FiltersGradeSection
          grade={grade}
          section={section}
          setGrade={setGrade}
          setSection={setSection}
          gradeOptions={gradeOptions}
          sectionOptions={sectionOptions}
          showBehaviorFilter={showBehaviorFilter}
        />
      </div>


    </div>
  );
}

export { FiltersBehavior };
