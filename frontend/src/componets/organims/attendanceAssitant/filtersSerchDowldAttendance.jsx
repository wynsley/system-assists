import { AttendanceSearch } from "../../molecules/attendanceControl/attendanceSearch";
import { exportAttendanceExcel } from "../../../services/export/exportAttendanceExcel";
import { exportAttendancePdf } from "../../../services/export/exportAttendancePdf";
import { DownloadButtons } from "../../molecules/downloadButtons";
import { FiltersGradeSection } from "../../molecules/filtersGradeSection";
import { useFilterOptions } from "../../../hooks/hooksAssistant/useFilterOptions";

function FiltersSearchDownload({
  search,
  setSearch,
  grade,
  setGrade,
  section,
  setSection,
  date,
  setDate,
  students = [],
  getLocalDateString
}) {
  const { gradeOptions, sectionOptions } = useFilterOptions(students);

  return (
    <div className="grid lg:grid-cols-2 gap-5 my-5">
      <div className="flex items-center justify-between gap-4">
        <AttendanceSearch search={search} setSearch={setSearch} />
        <DownloadButtons
          onExcel={() => exportAttendanceExcel(students)}
          onPdf={() => exportAttendancePdf(students, grade, section)}
        />
      </div>
      <div className="flex items-center justify-end gap-2">
        {/* 🔹 Filtro por fecha */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={getLocalDateString()} // no permitir fechas futuras
          className="
            p-2 rounded-md border border-borderC
            bg-white text-sm
            focus:outline-none focus:ring-2 focus:ring-blue/20
          "
        />
        <FiltersGradeSection
          grade={grade}
          section={section}
          setGrade={setGrade}
          setSection={setSection}
          gradeOptions={gradeOptions}
          sectionOptions={sectionOptions}
        />

      </div>
    </div>
  );
}

export { FiltersSearchDownload }