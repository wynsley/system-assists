import { Title } from "../../atoms/title";

function BehaviorPorcentage({ behaviorGradePorcentage = [] }) {

  if (behaviorGradePorcentage.length === 0) {
    return (
      <p className="text-gray-400 text-sm italic">
        No hay calificaciones o resumen de comportamiento disponible.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {behaviorGradePorcentage.map((item, i) => (
        <div key={i}>
          <div className="flex justify-between items-center mb-2 gap-4">
            <Title
              level="h3"
              text={item.name}
              weight="bold"
            />
            <span className="text-sm text-gray-500">
              {item.description}
            </span>
          </div>

          <div className="w-full h-4 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="
                h-full rounded-full
                bg-gradient-to-r from-cyanO to-cyan-500
                flex items-center justify-center
                text-white text-xs font-semibold
              "
              style={{
                width: `${item.progress}%`,
              }}
            >
              {item.progress}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export { BehaviorPorcentage };