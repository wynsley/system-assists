import { useEffect, useRef, useState } from "react";
import { FiZoomIn, FiZoomOut } from "react-icons/fi";

const MIN = 0.5;
const MAX = 2;
const STEP = 0.1;
const clamp = (v) => Math.min(MAX, Math.max(MIN, Math.round(v * 100) / 100));

function Table({
  headers = [],
  data = [],
  renderRow,
  emptyMessage = "No hay datos disponibles",
  zoomable = true,
}) {
  const ref = useRef(null);
  const scaleRef = useRef(1);
  const [scale, setScaleState] = useState(1);

  const setScale = (v) => {
    const next = typeof v === "function" ? v(scaleRef.current) : v;
    scaleRef.current = clamp(next);
    setScaleState(scaleRef.current);
  };

  useEffect(() => {
    const el = ref.current;
    if (!zoomable || !el) return;

    // Ctrl + rueda (solo con el cursor sobre la tabla)
    const onWheel = (e) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      setScale((s) => s - Math.sign(e.deltaY) * STEP);
    };

    // Pellizco con dos dedos en móvil
    let startDist = 0;
    let startScale = 1;
    const dist = (t) =>
      Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);

    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        startDist = dist(e.touches);
        startScale = scaleRef.current;
      }
    };
    const onTouchMove = (e) => {
      if (e.touches.length === 2 && startDist) {
        e.preventDefault();
        setScale(startScale * (dist(e.touches) / startDist));
      }
    };
    const onTouchEnd = () => { startDist = 0; };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [zoomable]);

  return (
    <div className="flex flex-col gap-2">
      {zoomable && (
        <div className="flex items-center justify-end gap-2 text-sm text-gray-600">
          <button type="button" onClick={() => setScale((s) => s - STEP)} title="Alejar">
            <FiZoomOut size={18} />
          </button>
          <button
            type="button"
            onClick={() => setScale(1)}
            className="w-12 text-center hover:underline"
            title="Restablecer"
          >
            {Math.round(scale * 100)}%
          </button>
          <button type="button" onClick={() => setScale((s) => s + STEP)} title="Acercar">
            <FiZoomIn size={18} />
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-md border border-borderC bg-white shadow-sm">
        <div ref={ref} className="overflow-x-auto touch-pan-x touch-pan-y">
          <div className="max-h-100 overflow-y-auto" style={zoomable ? { zoom: scale } : undefined}>
            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-10 bg-blue">
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      className="px-3 py-3 text-left text-sm text-white font-semibold border-b border-blue-700"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => renderRow(item, index))
                ) : (
                  <tr>
                    <td colSpan={headers.length} className="py-10 text-center text-gray-500">
                      {emptyMessage}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Table };