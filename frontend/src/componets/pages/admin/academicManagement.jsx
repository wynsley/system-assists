import { useState } from "react";
import { useClassrooms } from "../../../hooks/hoocksAdmin/useClassroom";
import { useGrades } from "../../../hooks/hoocksAdmin/useGrades"
import { useSections } from "../../../hooks/hoocksAdmin/useSections";
import { AcademicCatalog } from "../../organims/adminRegisters/academicCatalog"
import { HeaderAcademic } from "../../organims/adminRegisters/headerAcamdemic"
import { MyTemplate } from "../../templates/myTemplate"
import { useDebounce } from "../../../hooks/hookGlobals/useDebounce";

function AcademicManagement() {

  const [page, setPage] = useState(1)
  const [yearFilter, setYearFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [mySearch, setMySearch] = useState('')

  const debouncedSearch = useDebounce(mySearch, 400)
                                                                                                                                                                                                                                                                                                                                            
  //hooks de grados, seccion y aulas
  const gradesHook = useGrades({ limit: 50 });
  const sectionsHook = useSections({ limit: 100 });
  const classroomHook = useClassrooms({
    page,
    limit: 20,
    year: yearFilter || undefined,
    grade: gradeFilter || undefined,
    section: sectionFilter || undefined,
    search: debouncedSearch || undefined
  })

  return (
    <MyTemplate >
      <HeaderAcademic
        refetchGrades={gradesHook.refetch}
        refethcSections={sectionsHook.refetch}
        refetchClassroom={classroomHook.refetch}
      />
      <hr className="w-[96%] md:w-[90%] md:max-w-7xl mx-auto text-gray-400 rounded-full mt-1" />
      <AcademicCatalog
        gradesHook={gradesHook}
        sectionsHook={sectionsHook}
        classroomHook={classroomHook}
        page={page}
        setPage={setPage}
        search={mySearch}
        setMySearch={setMySearch}
        yearFilter={yearFilter}
        setYearFilter={setYearFilter}
        gradeFilter={gradeFilter}
        setGradeFilter={setGradeFilter}
        sectionFilter={sectionFilter}
        setSectionFilter={setSectionFilter}
      />
    </MyTemplate>
  )
}

export { AcademicManagement }