import { Paragraph } from "../../atoms/paragraph"
import { Small } from "../../atoms/small"
import { Title } from "../../atoms/title"
import { activityConfig } from "../../../config/assistant/activityConfig"
import { useVisible } from "../../../hooks/hookGlobals/useVisible"

function RecentAssists({ recentActivity = [] }) {
  const { visible } = useVisible(90)

  if (recentActivity.length === 0) {
    return (
      <p className="text-gray-400 text-sm italic">
        No hay actividades registradas hoy.
      </p>
    );
  }

  const recent = recentActivity.slice(0, 5);

  return (
    <div className="flex flex-col gap-2 font-hani">
      {recent.map((assist) => {
        const config = activityConfig[assist.status] ?? activityConfig["absent"];

        //  fullname ya viene concatenado del mapper
        const studentName = assist.fullname ?? "Estudiante desconocido";

        return (
          <div
            key={assist.idStudent}
            className={`
              flex items-center justify-between py-2 px-3 bg-white border
              border-borderC/30 rounded-md shadow
              transition-all duration-300
              hover:-translate-y-1 hover:bg-blueT/10
              ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
            `}
          >
            <div className="flex items-center">
              <div className={`h-3 w-3 rounded-full ${config.className} mr-4`} />
              <div>
                <Title level="h5" text={studentName} />
                <Paragraph
                  text={config.label}
                  variant="primary"
                  size="small"
                />
                <Small text={`${assist.grade}° ${assist.section}`} />
              </div>
            </div>
            <Small
              text={assist.time ?? "Sin registro"}
              size="large"
              variant="secondary"
            />
          </div>
        );
      })}
    </div>
  );
}

export { RecentAssists }