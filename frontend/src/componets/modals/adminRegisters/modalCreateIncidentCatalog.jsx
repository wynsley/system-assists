import { useState } from "react";
import { useClickOutside } from "../../../hooks/hookModal/useClickOutside";
import { useModalAnimation } from "../../../hooks/hookModal/useModalAnimation";
import { Title } from "../../atoms/title";
import { FormItem } from "../../molecules/formItems";
import { Button } from "../../atoms/button";
import { useToast } from "../../../hooks/hookGlobals/useToast";
import { useLoading } from "../../../hooks/hookGlobals/useLoading";
import { useIncidentCatalog } from "../../../hooks/hooksAssistant/useIncidentCatalog";

function ModalCreateIncidentCatalog({ closeModal, onSuccess, mode = "create", initialData = null }) {
  const isEdit = mode === "edit";

  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [type, setType] = useState(initialData?.type ?? "POSITIVO");
  const [points, setPoints] = useState(initialData?.points ?? 1);

  const title = isEdit ? "EDITAR TIPO DE INCIDENTE" : "CREAR TIPO DE INCIDENTE";
  const { isClosing, handleClose } = useModalAnimation(closeModal);
  const modalRef = useClickOutside(handleClose);
  const { showToast } = useToast();
  const { loading, startLoading, stopLoading } = useLoading();
  const { createIncidentType, updateIncidentType } = useIncidentCatalog({ fetchList: false });

  const formFields = [
    {
      text: "Nombre",
      type: "text",
      name: "name",
      value: name,
      placeholder: "Ej: Falta de respeto",
      onChange: (e) => setName(e.target.value),
    },
    {
      text: "Descripción",
      type: "textarea",
      name: "description",
      value: description,
      placeholder: "Describe brevemente el incidente...",
      onChange: (e) => setDescription(e.target.value),
    },
    {
      text: "Tipo",
      type: "select",
      name: "type",
      value: type,
      options: [
        { value: "POSITIVO", text: "Positivo (suma puntos)" },
        { value: "NEGATIVO", text: "Negativo (resta puntos)" },
      ],
      onChange: (e) => setType(e.target.value),
    },
    {
      text: "Puntos",
      type: "select",
      name: "points",
      value: points,
      options: [
        { value: 1, text: "1 — Leve" },
        { value: 3, text: "3 — Moderado" },
        { value: 5, text: "5 — Grave" },
      ],
      onChange: (e) => setPoints(Number(e.target.value)),
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast("El nombre es obligatorio", "error");
      return;
    }
    if (!description.trim()) {
      showToast("La descripción es obligatoria", "error");
      return;
    }

    startLoading();
    try {
      if (isEdit) {
        await updateIncidentType(initialData.idIncidentCatalog, { name, description, type, points });
        showToast("Tipo de incidente actualizado correctamente", "success");
      } else {
        await createIncidentType({ name, description, type, points });
        showToast("Tipo de incidente creado correctamente", "success");
      }
      onSuccess?.();
      handleClose();
    } catch (err) {
      showToast(err.message || "Ocurrió un error al guardar", "error");
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
        className={`flex flex-col gap-4 w-[20em] md:w-[30em] max-w-2xl bg-white rounded-md shadow-xl p-6 transition-all duration-300 ${
          isClosing ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
        }`}
      >
        <Title text={title} level="h3" weight="bold" />
        <hr className="text-blueT" />

        <FormItem formFields={formFields} />

        <Button
          text={loading ? "Guardando..." : isEdit ? "Guardar Cambios" : "Crear Tipo de Incidente"}
          variant="primary"
          type="submit"
          disabled={loading}
        />
      </form>
    </div>
  );
}

export { ModalCreateIncidentCatalog };