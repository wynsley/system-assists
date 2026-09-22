import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import { useClickOutside } from "../../../hooks/hookModal/useClickOutside";
import { TitleAndDescaription } from "../../molecules/titleandDescription";
import { Button } from "../../atoms/button";
import { useLoading } from "../../../hooks/hookGlobals/useLoading";
import { useToast } from "../../../hooks/hookGlobals/useToast";
import { useDebounce } from "../../../hooks/hookGlobals/useDebounce";
import { useParentRelations } from "../../../hooks/hoocksAdmin/useParentRelations";
import { apiFetch } from "../../../helpers/apiFetch";

const RELATIONSHIP_OPTIONS = [
  { text: "Padre", value: "PADRE" },
  { text: "Madre", value: "MADRE" },
  { text: "Abuelo", value: "ABUELO" },
  { text: "Abuela", value: "ABUELA" },
  { text: "Tío", value: "TÍO" },
  { text: "Tía", value: "TÍA" },
  { text: "Apoderado", value: "APODERADO" },
  { text: "Otro", value: "OTRO" },
];

function ModalAssignParent({ student, closeModal, onSuccess }) {
  const { showToast } = useToast();
  const { loading, startLoading, stopLoading } = useLoading();
  const modalRef = useClickOutside(closeModal);

  // apoderados ya asignados a ESTE estudiante
  const { relations, loading: loadingRelations, refetch, deleteRelation } =
    useParentRelations({ idStudent: student.idStudent, limit: 20 });

  // búsqueda de padres (role=PARENT) para asignar
  const [parentSearch, setParentSearch] = useState("");
  const debouncedSearch = useDebounce(parentSearch, 400);
  const [parentResults, setParentResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const [selectedParent, setSelectedParent] = useState(null);
  const [relationship, setRelationship] = useState("APODERADO");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!debouncedSearch) {
      setParentResults([]);
      return;
    }
    const search = async () => {
      setSearchLoading(true);
      const params = new URLSearchParams({ search: debouncedSearch, role: "PARENT", limit: "10" });
      const { ok, data } = await apiFetch(`/user?${params.toString()}`, "GET");
      if (ok && data?.success) {
        const assignedIds = new Set(relations.map((r) => r.parent.idUser));
        setParentResults((data.data ?? []).filter((u) => !assignedIds.has(u.idUser)));
      }
      setSearchLoading(false);
    };
    search();
  }, [debouncedSearch, relations]);

  const handleAssign = async () => {
    setError("");
    if (!selectedParent) {
      setError("Selecciona un padre o apoderado");
      return;
    }
    try {
      startLoading();
      const { ok, data } = await apiFetch("/parent", "POST", {
        idStudent: student.idStudent,
        idParent: selectedParent.idUser,
        relationship,
      });
      if (!data) throw new Error("No se pudo conectar con el servidor");
      if (!ok || !data.success) {
        throw new Error(data.errors?.[0]?.message || data.message || "Error al asignar apoderado");
      }
      showToast("Apoderado asignado correctamente", "success");
      setSelectedParent(null);
      setParentSearch("");
      refetch();
      onSuccess?.();
    } catch (err) {
      setError(err.message || "Error al asignar apoderado");
    } finally {
      stopLoading();
    }
  };

  const handleRemove = async (relation) => {
    try {
      await deleteRelation(relation.idStudentParent);
      showToast("Apoderado removido", "success");
      refetch();
      onSuccess?.();
    } catch (err) {
      showToast(err.message || "Error al remover", "error");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-100 transition-opacity duration-300">
      <div
        ref={modalRef}
        className="flex flex-col gap-5 w-[25em] md:w-[40em] max-w-xl bg-white rounded-md shadow-xl p-6"
      >
        <div className="relative">
          <TitleAndDescaription
            title="ASIGNAR APODERADO"
            description={`Padres/apoderados de ${student.firstname} ${student.lastname}`}
            level="h3"
            size="small"
            weight="bold"
          />
          <FiX size={23} className="absolute top-0 right-0 cursor-pointer" onClick={closeModal} />
        </div>

        {/* Apoderados ya asignados */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-gray-600">Apoderados asignados</span>
          {loadingRelations ? (
            <p className="text-sm text-gray-400">Cargando...</p>
          ) : relations.length === 0 ? (
            <p className="text-sm text-gray-400">Sin apoderados asignados todavía</p>
          ) : (
            <ul className="flex flex-col gap-2 max-h-48 overflow-y-auto">
              {relations.map((r) => (
                <li
                  key={r.idStudentParent}
                  className="flex items-center justify-between border border-borderC rounded-md px-4 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {r.parent.firstname} {r.parent.lastname}
                    </p>
                    <p className="text-xs text-gray-400">{r.relationship} · {r.parent.email}</p>
                  </div>
                  <button onClick={() => handleRemove(r)} title="Quitar">
                    <FaTrash size={14} className="text-red-500" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Buscar y asignar nuevo apoderado */}
        <div className="flex flex-col gap-2 border-t border-borderC pt-4">
          <span className="text-sm font-semibold text-gray-600">Agregar apoderado</span>

          <input
            type="text"
            placeholder="Buscar padre/apoderado por nombre o correo..."
            value={parentSearch}
            onChange={(e) => { setParentSearch(e.target.value); setSelectedParent(null); }}
            className="border border-borderC rounded-md px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
          />

          {searchLoading && <p className="text-xs text-gray-400">Buscando...</p>}

          {!selectedParent && parentResults.length > 0 && (
            <ul className="border border-borderC rounded-md max-h-40 overflow-y-auto">
              {parentResults.map((u) => (
                <li
                  key={u.idUser}
                  onClick={() => {
                    setSelectedParent(u);
                    setParentSearch(`${u.firstname} ${u.lastname}`);
                    setParentResults([]);
                  }}
                  className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  {u.firstname} {u.lastname} — {u.email}
                </li>
              ))}
            </ul>
          )}

          <select
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            className="border border-borderC rounded-md px-4 py-2 text-sm outline-none cursor-pointer"
          >
            {RELATIONSHIP_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.text}</option>
            ))}
          </select>

          {error && <span className="text-sm text-red-600">{error}</span>}

          <Button
            type="button"
            variant="primary"
            text={loading ? "Asignando..." : "Asignar apoderado"}
            disabled={loading || !selectedParent}
            onClick={handleAssign}
          />
        </div>

        <div className="flex justify-end">
          <Button variant="primary" type="button" text="Cerrar" onClick={closeModal} />
        </div>
      </div>
    </div>
  );
}

export { ModalAssignParent };