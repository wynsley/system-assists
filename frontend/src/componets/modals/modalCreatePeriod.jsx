import { useState } from "react";
import { useClickOutside } from "../../hooks/hookModal/useClickOutside";
import { useModalAnimation } from "../../hooks/hookModal/useModalAnimation";
import { Title } from "../atoms/title";
import { FormItem } from "../molecules/formItems";
import { Button } from "../atoms/button";
import { useToast } from "../../hooks/hookGlobals/useToast";
import { useLoading } from "../../hooks/hookGlobals/useLoading";
import { useAcademicPeriod } from "../../hooks/hoocksAdmin/useAcademicPeriod";

function ModalCreatePeriod({closeModal, onSuccess, mode = "create", initialData = null }) {
  const isEdit = mode === "edit";

  const [year, setYear] = useState(initialData?.year ?? new Date().getFullYear());
  const [bimester, setBimester] = useState(initialData?.bimester ?? 1);
  const [startDate, setStartDate] = useState(initialData?.startDate?.slice(0, 10) ?? "");
  const [endDate, setEndDate] = useState(initialData?.endDate?.slice(0, 10) ?? "");

  const title = isEdit ? "EDITAR BIMESTRE" : "CREAR BIMESTRE";
  const { isClosing, handleClose } = useModalAnimation(closeModal);
  const modalRef = useClickOutside(handleClose);
  const { showToast } = useToast();
  const { loading, startLoading, stopLoading } = useLoading();
  const { createPeriod, updatePeriod } = useAcademicPeriod({ fetchList: false });

  const formFields = [
    {
      text: "Año",
      type: "number",
      name: "year",
      value: year,
      min: 1900,
      max: 3000,
      onChange: (e) => setYear(Number(e.target.value)),
    },
    {
      text: "Bimestre (1 - 4)",
      type: "number",
      name: "bimester",
      value: bimester,
      min: 1,
      max: 4,
      onChange: (e) => setBimester(Number(e.target.value)),
    },
    {
      text: "Fecha de inicio",
      type: "date",
      name: "startDate",
      value: startDate,
      onChange: (e) => setStartDate(e.target.value),
    },
    {
      text: "Fecha de fin",
      type: "date",
      name: "endDate",
      value: endDate,
      onChange: (e) => setEndDate(e.target.value),
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (bimester < 1 || bimester > 4) {
      showToast("El bimestre debe estar entre 1 y 4", "error");
      return;
    }
    if (!startDate || !endDate) {
      showToast("Debes indicar fecha de inicio y fin", "error");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      showToast("La fecha de fin debe ser posterior a la de inicio", "error");
      return;
    }

    startLoading();
    try {
      if (isEdit) {
        await updatePeriod(initialData.idPeriod, { year, bimester, startDate, endDate });
        showToast("Bimestre actualizado correctamente", "success");
      } else {
        await createPeriod({ year, bimester, startDate, endDate });
        showToast("Bimestre creado correctamente", "success");
      }
      onSuccess?.();
      handleClose();
    } catch (err) {
      showToast(err.message || "Ocurrió un error al guardar el bimestre", "error");
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center 
    bg-black/50 z-100 transition-opacity duration-300">
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
          text={loading ? "Guardando..." : isEdit ? "Guardar Cambios" : "Crear Bimestre"}
          variant="primary"
          type="submit"
          disabled={loading}
        />
      </form>
    </div>
  );
}

export { ModalCreatePeriod };