import { useEffect, useState } from "react";
import { MyTemplate } from "../../templates/myTemplate";
import { BannerBehavior } from "../../organims/behaviorStudent/bannerBehavior";
import { CardGrandingScale } from "../../organims/behaviorStudent/cardgrandingScale";
import { IncidentStudentList } from "../../organims/behaviorStudent/incidentStudentList";
import { useSelectedStudent } from "../../../hooks/hooksParent/useSelectedStudent";
import { useParentBehavior } from "../../../hooks/hooksParent/useParentBehavior";

function BehaviorStudentPage() {
  const { selectedStudent, selectedStudentData } = useSelectedStudent();
  const [period, setPeriod] = useState(null); 
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [selectedStudent, period]);

  const { current, history, total, loading, error } = useParentBehavior({
    idStudent: selectedStudent,
    period,
    page,
  });

  return (
    <MyTemplate>
      <BannerBehavior
        selectedStudentData={selectedStudentData}
        current={current}
      />
      <CardGrandingScale current={current} />
      <IncidentStudentList
        history={history}
        total={total}
        period={period}
        setPeriod={setPeriod}
        page={page}
        setPage={setPage}
        loading={loading}
      />
      {error && <p className="text-red-500 text-center">{error}</p>}
    </MyTemplate>
  );
}

export { BehaviorStudentPage };