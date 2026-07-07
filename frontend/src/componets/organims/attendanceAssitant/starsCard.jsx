import { Paragraph } from "../../atoms/paragraph";
import { Small } from "../../atoms/small";
import { useVisible } from "../../../hooks/hookGlobals/useVisible";
import { statusBadge } from "../../../config/assistant/attendanceBadges";

function StatsCardControl({ stats }) {
  const { visible } = useVisible(90);

  return (
      <div
        className={`
          grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4
          transition-all duration-500
          ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }
        `}
      >
        {Object.entries(stats).map(([key, val]) => {
          const config = statusBadge[key];
          const Icon = config.icon;

          return (
            <div
              key={key}
              className="
                bg-white rounded-md p-4
                shadow-md shadow-blue/20
                border border-black/20
                transition-all duration-300
                hover:-translate-y-1
                flex items-center gap-4
              "
            >
              <Icon
                size={40}
                className={`${config.className} p-2 rounded-xl`}
              />

              <div>
                <Paragraph
                  text={val}
                  size="large"
                  weight="bold"
                />

                <Small
                  text={config.label}
                />
              </div>
            </div>
          );
        })}
      </div>
  );
}

export { StatsCardControl };