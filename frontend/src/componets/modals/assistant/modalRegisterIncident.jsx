import { useState } from "react";
import { useClickOutside } from "../../../hooks/hookModal/useClickOutside";
import { Title } from "../../atoms/title";
import { Small } from "../../atoms/small";
import { FormItem } from "../../molecules/formItems";
import { Button } from "../../atoms/button";
import { getLocalDateString } from "../../../utils/date";
import { useToast } from "../../../hooks/hookGlobals/useToast"; 
import { useLoading } from "../../../hooks/hookGlobals/useLoading";
import { useIncidentCatalog } from "../../../hooks/hooksAssistant/useIncidentCatalog";

function ModalRegisterIncident({
  closeModal,
  student,        
  createIncident,
  refetchBehavior
}) {
  const { 
    grouped, 
    loading: 
    loadingCatalog 
  } = useIncidentCatalog({ forSelect: true });

  const [idIncidentCatalog, setIdIncidentCatalog] = useState("");
  const [description, setDescription] = useState("");

  const modalRef = useClickOutside(closeModal);
  const {showToast} = useToast()
  const { loading, startLoading, stopLoading } = useLoading();

  // Item seleccionado, para mostrar puntos/tipo en modo solo-lectura
  const selectedItem = [...grouped.POSITIVO, ...grouped.NEGATIVO].find(
    (item) => String(item.idIncidentCatalog) === String(idIncidentCatalog)
  );

  const LEVEL_LABEL = { 1: "Leve", 3: "Moderado", 5: "Grave" };

  const catalogOptions = [
    { text: "Selecciona un incidente...", value: "" },
    ...grouped.POSITIVO.map((item) => ({
      text: `+ ${item.name} — ${LEVEL_LABEL[item.points] ?? item.points} (+${item.points} pts)`,
      value: String(item.idIncidentCatalog),
    })),
    ...grouped.NEGATIVO.map((item) => ({
      text: `- ${item.name} — ${LEVEL_LABEL[item.points] ?? item.points} (-${item.points} pts)`,
      value: String(item.idIncidentCatalog),
    })),
  ];

  const formFields = [
    {
      text: "Tipo de incidente",
      type: "select",
      name: "idIncidentCatalog",
      value: idIncidentCatalog,
      onChange: (e) => setIdIncidentCatalog(e.target.value),
      options: catalogOptions,
    },
    {
      text: "Descripción",
      type: "textarea",
      name: "description",
      placeholder: "Describe el incidente (opcional)...",
      value: description,
      onChange: (e) => setDescription(e.target.value),
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    showToast("")

    if (!idIncidentCatalog) {
      showToast("Selecciona un tipo de incidente",  "error");
      return;
    }

    startLoading();

    try {
      await createIncident({
        idStudent: student.student.idStudent,
        idIncidentCatalog: Number(idIncidentCatalog),
        date: getLocalDateString(), 
        note: description,
      });
      await refetchBehavior?.();
      showToast("Incidente registrado correctamente",  "success");
      setTimeout(closeModal, 800);
    } catch (err) {
      showToast(err.message || "Ocurrió un error al registrar el incidente",  "error");
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-100 transition-opacity duration-300">
      <form
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-[20em] md:w-[30em] max-w-2xl bg-white rounded-md shadow-xl p-6"
      >
        <Title text="Registrar Incidente" level="h3" weight="bold" />

        {/* Identificación del estudiante (solo lectura, viene de la fila) */}
        <div className="flex flex-col gap-1 bg-gray-50 rounded-md p-3 ">
          <span className="font-semibold text-gray-800">
            {student.student.firstname} {student.student.lastname}
            </span>
          <Small text={`${student?.grade ?? "-"}° Grado — Sección ${student?.section ?? "-"}`} />
        </div>

        <FormItem formFields={formFields} selectVariant="secondary" />

        {/* Puntos autocompletados del catálogo — nunca editables por el auxiliar */}
        {selectedItem && (
          <div
            className={`rounded-md p-3 text-sm font-medium ${
              selectedItem.type === "POSITIVO"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {selectedItem.type === "POSITIVO" ? "+" : "-"}
            {selectedItem.points} puntos — se{" "}
            {selectedItem.type === "POSITIVO" ? "sumarán a" : "restarán de"} la nota de
            comportamiento del estudiante.
          </div>
        )}

        <Button
          text={loading ? "Guardando..." : "Registrar Incidente"}
          variant="primary"
          type="submit"
          disabled={loading || loadingCatalog}
        />
      </form>
    </div>
  );
}

export { ModalRegisterIncident };