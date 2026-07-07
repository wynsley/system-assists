import { useVisible } from "../../../hooks/hookGlobals/useVisible"
import { Paragraph } from "../../atoms/paragraph"
import { Small } from "../../atoms/small"
import { statusBadge } from "../../../config/assistant/attendanceBadges"

function CardStatsAssitant({ stats, loading = false }) {
  const { visible } = useVisible()

  return (
    <div className="-mt-10 px-6 w-full mx-auto md:max-w-5xl">
      <div className={`
        grid grid-cols-2 md:grid-cols-4 gap-3
        transition-all duration-500
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}>
        {Object.entries(stats).map(([key, val]) => {
          const config = statusBadge[key];
          if (!config) return null; // ignora keys sin config
          const Icon = config.icon;

          return (
            <div
              key={key}
              className="flex items-center justify-between
                bg-white rounded-md p-4
                shadow-md shadow-blue/20 border border-borderC
                transition-all duration-300 ease-in-out
                hover:-translate-y-1"
            >
              <div>
                <Small text={config.label} size="xlarge" />
                <Paragraph
                  text={loading ? "..." : val}
                  weight="bold"
                  size="slogan"
                />
              </div>
              <Icon size={40} className={`${config.className} p-2 rounded-xl`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { CardStatsAssitant }