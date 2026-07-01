import { FiX } from "react-icons/fi";
import { useState } from "react";
import { useClickOutside } from "../../../hooks/hookModal/useClickOutside";
import { useLoading } from "../../../hooks/hookGlobals/useLoading";
import { useToast } from "../../../hooks/hookGlobals/useToast";
import { useGrades } from "../../../hooks/hoocksAdmin/useGrades";
import { useSections } from "../../../hooks/hoocksAdmin/useSections";
import { apiFetch } from "../../../helpers/apiFetch";
import { Button } from "../../atoms/button";
import { TitleAndDescaription } from "../../molecules/titleandDescription";
import { FormItem } from "../../molecules/formItems";
import { ValidationCreateClassroom } from "../../../validations/AcademicManagement/validateCreationClassroom";
import { valid } from "joi";

function ModalCreateClassroom({ closeModal, onSuccess }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [idGrade, setIdGrade] = useState("");
  const [idSection, setIdSection] = useState("");
  const [error, setError] = useState("");

  const { loading, startLoading, stopLoading } = useLoading();
  const { showToast } = useToast();
  const modalRef = useClickOutside(closeModal);

  const { grades } = useGrades({ limit: 50 });

  // Traemos todas las secciones y filtramos por grado en el front
  // (hasta que el backend acepte ?idGrade= en sectionSchema.params)
  const { sections: allSections } = useSections({ limit: 100 });
  const sections = idGrade
    ? allSections.filter((s) => String(s.idGrade) === String(idGrade))
    : allSections;

  const formFields = [
    {
      text: "Año académico",
      type: "number",
      name: "year",
      value: year,
      require: "required",
      placeholder: "Ej: 2025",
      onChange: (e) => setYear(e.target.value),
    },
    [
      {
        text: "Grado (filtra secciones)",
        type: "select",
        name: "idGrade",
        value: idGrade,
        placeholder: "Todos los grados",
        onChange: (e) => {  setIdGrade(e.target.value); setIdSection(""); // resetea sección al cambiar grado
        },
        options: [
          { text : 'Elige un grado', value : ''},
          ...grades.map((g) => ({
            text: `${g.level}° grado`,
            value: String(g.idGrade),
          }))
        ],
      },
      {
        text: "Sección",
        type: "select",
        name: "idSection",
        value: idSection,
        require: "required",
        placeholder: sections.length === 0
          ? (idGrade ? "Sin secciones en este grado" : "Selecciona un grado primero")
          : "Selecciona una sección",
        onChange: (e) => setIdSection(e.target.value),
        options: sections.map((s) => ({
          text: `${s.grade}° ${s.section}`,
          value: String(s.idSection),
        })),
      },
    ]
  ];

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await ValidationCreateClassroom.validateAsync({
        year: Number(year),
        idSection: String(idSection),
      });

      if (!idSection) {
        setError("Debes seleccionar una sección");
        return;
      }

      startLoading();

      const { ok, data } = await apiFetch("/classroom", "POST", {
        year: Number(year),
        idSection: Number(idSection),
      });

      if (!data) throw new Error("No se pudo conectar al servidor");
      if (!ok || !data.success) throw new Error(data.message || "Error al crear aula");

      showToast("Aula creada con éxito", "success");
      onSuccess?.();
      closeModal();
    } catch (err) {
      setError(err.details?.[0].message ?? err.message);
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-[110]">
      <form
        ref={modalRef}
        onSubmit={onSubmit}
        noValidate
        className="bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-sm flex flex-col gap-5"
      >
        <div className="relative">
          <TitleAndDescaription
            title="CREAR AULA"
            description="Asigna una sección a un año académico"
            level="h3"
            size="small"
            weight="bold"
          />
          <FiX
            size={20}
            className="absolute right-0 top-0 cursor-pointer text-gray-400"
            onClick={closeModal}
          />
        </div>

        {error && <span className="text-sm text-red-600">{error}</span>}

        <FormItem
          formFields={formFields}
          selectVariant="secondary"
        />

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="primary" text="Cancelar" onClick={closeModal} />
          <Button
            type="submit"
            variant="primary"
            text={loading ? "Creando..." : "Crear Aula"}
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
}

export { ModalCreateClassroom };