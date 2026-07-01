import { FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import { useState } from "react";
import { useClickOutside } from "../../../hooks/hookModal/useClickOutside";
import { useLoading } from "../../../hooks/hookGlobals/useLoading";
import { useToast } from "../../../hooks/hookGlobals/useToast";
import { useGrades } from "../../../hooks/hoocksAdmin/useGrades";
import { apiFetch } from "../../../helpers/apiFetch";
import { Button } from "../../atoms/button";
import { TitleAndDescaription } from "../../molecules/titleandDescription";
import { FormItem } from "../../molecules/formItems";

function ModalCreateSection({ closeModal, onSuccess }) {
  const [idGrade, setIdGrade] = useState("");
  const [sections, setSections] = useState([{ name: "" }]);
  const [error, setError] = useState("");

  const { loading, startLoading, stopLoading } = useLoading();
  const { showToast } = useToast();
  const modalRef = useClickOutside(closeModal);
  const { grades } = useGrades({ limit: 50 });

  const addSection = () => setSections((prev) => [...prev, { name: "" }]);
  const removeSection = (index) => setSections((prev) => prev.filter((_, i) => i !== index));
  const updateSection = (index, value) =>
    setSections((prev) =>
      prev.map((s, i) => (i === index ? { name: value.toUpperCase() } : s))
    );

  // Select de grado como formField para reutilizar FormItem
  const gradeFormFields = [
    {
      text: "Grado",
      type: "select",
      name: "idGrade",
      value: idGrade,
      require: "required",
      placeholder: "Selecciona un grado",
      onChange: (e) => setIdGrade(e.target.value),
      options: [
        { text: "Elige un grado", value: "" },
        ...grades.map((g) => ({
          text: `${g.level}° grado`,
          value: String(g.idGrade),
        })),
      ]
    }
  ];

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!idGrade) { setError("Debes seleccionar un grado"); return; }

    const filled = sections.filter((s) => s.name.trim() !== "");
    if (filled.length === 0) { setError("Agrega al menos una sección"); return; }

    const invalid = filled.find((s) => !/^[A-Z]$/.test(s.name));
    if (invalid) { setError("Cada sección debe ser una sola letra (A-Z)"); return; }

    startLoading();
    try {
      const results = await Promise.all(
        filled.map((s) =>
          apiFetch("/section", "POST", {
            name: s.name,
            idGrade: Number(idGrade),
          })
        )
      );

      const failed = results.find((r) => !r.ok || !r.data?.success);
      if (failed) {
        throw new Error(failed.data?.message || "Error al crear alguna sección");
      }

      showToast(`${filled.length} sección(es) creada(s) con éxito`, "success");
      onSuccess?.();
      closeModal();
    } catch (err) {
      setError(err.message);
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
            title="CREAR SECCIONES"
            description="Agrega secciones a un grado"
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

        {/* Select de grado via FormItem */}
        <FormItem formFields={gradeFormFields} selectVariant="secondary" />

        {/* Inputs dinámicos de secciones — estos no van en FormItem porque son dinámicos */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Secciones <span className="text-red-500">*</span>
          </label>
          {sections.map((s, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                maxLength={1}
                placeholder="Ej: A"
                value={s.name}
                onChange={(e) => updateSection(index, e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 w-20 text-center uppercase focus:outline-none focus:ring-2 focus:ring-blue/40"
              />
              {sections.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSection(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 size={16} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addSection}
            className="flex items-center gap-1 text-sm text-blue-600 hover:underline w-fit mt-1"
          >
            <FiPlus size={16} /> Agregar otra sección
          </button>
        </div>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="primary" text="Cancelar" onClick={closeModal} />
          <Button
            type="submit"
            variant="primary"
            text={loading ? "Creando..." : "Crear Secciones"}
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
}

export { ModalCreateSection };