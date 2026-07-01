import { FiX } from "react-icons/fi";
import { useState } from "react";
import { useClickOutside } from "../../../hooks/hookModal/useClickOutside";
import { useLoading } from "../../../hooks/hookGlobals/useLoading";
import { useToast } from "../../../hooks/hookGlobals/useToast";
import { apiFetch } from "../../../helpers/apiFetch";
import { Button } from "../../atoms/button";
import { TitleAndDescaription } from "../../molecules/titleandDescription";
import { FormItem } from "../../molecules/formItems";
import { ValidationCreateGrade } from "../../../validations/AcademicManagement/validationGrade";

function ModalCreateGrade({ closeModal, onSuccess }) {
  const [level, setLevel] = useState("");
  const [error, setError] = useState("");

  const { loading, startLoading, stopLoading } = useLoading();
  const { showToast } = useToast();
  const modalRef = useClickOutside(closeModal);

  const validateField = async (value) => {
    try {
      await ValidationCreateGrade.extract("level").validateAsync(Number(value));
      setError("");
    } catch (err) {
      setError(err.details?.[0].message ?? err.message);
    }
  };

  const formFields = [
    {
      text: "Nivel del grado",
      type: "number",
      name: "level",
      value: level,
      require: "required",
      placeholder: "Ej: 1 (para 1er grado)",
      onChange: (e) => setLevel(e.target.value),
      onBlur: (e) => validateField(e.target.value),
    }
  ];

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = { level: Number(level) };
      await ValidationCreateGrade.validateAsync(payload);

      startLoading();

      const { ok, data } = await apiFetch("/grade", "POST", payload);

      if (!data) throw new Error("No se pudo conectar al servidor");
      if (!ok || !data.success) throw new Error(data.message || "Error al crear grado");

      showToast(`Grado ${level}° creado con éxito`, "success");
      onSuccess?.();
      closeModal();
    } catch (err) {
      setError(err.details?.[0].message ?? err.message);
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[110]">
      <form
        ref={modalRef}
        onSubmit={onSubmit}
        noValidate
        className="bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-sm flex flex-col gap-5"
      >
        <div className="relative">
          <TitleAndDescaription
            title="CREAR GRADO"
            description="Ingresa el nivel del grado"
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

        <FormItem formFields={formFields} />

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="primary" text="Cancelar" onClick={closeModal} />
          <Button
            type="submit"
            variant="primary"
            text={loading ? "Creando..." : "Crear Grado"}
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
}

export { ModalCreateGrade };