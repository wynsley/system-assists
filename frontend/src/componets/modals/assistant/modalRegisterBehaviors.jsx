import { useState } from "react";
import { useClickOutside } from "../../../hooks/hookModal/useClickOutside";
import { Title } from "../../atoms/title";
import { Small } from "../../atoms/small";
import { FormItem } from "../../molecules/formItems";
import { Button } from "../../atoms/button";
import { useToast } from "../../../hooks/hookGlobals/useToast";
import { useLoading } from "../../../hooks/hookGlobals/useLoading";

function ModalRegisterBehaviors({
  closeModal,
  student,          
  calificar,  
}) {
  const [score, setScore] = useState(student?.score ?? 0);
  const [description, setDescription] = useState("");

  const title = "CALIFICAR COMPORTAMIENTO";
  const modalRef = useClickOutside(closeModal);
  const {showToast} =useToast()
  const {loading, startLoading, stopLoading} =useLoading()

  const formFields = [
    {
      text: "Nota (0 - 20)",
      type: "number",
      name: "score",
      value: score,
      min: 0,
      max: 20,
      onChange: (e) => setScore(Number(e.target.value)),
    },
    {
      text: "Descripción",
      type: "textarea",
      name: "description",
      placeholder: "Describe el motivo de la calificación (opcional)...",
      value: description,
      onChange: (e) => setDescription(e.target.value),
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    showToast("");

    if (score < 0 || score > 20) {
      showToast("La nota debe estar entre 0 y 20", "error");
      return;
    }

    startLoading();
    try {
      await calificar({
        idStudent: student.student.idStudent,
        score,
        description,
      });
      showToast("Calificación registrada correctamente", "success");
      setTimeout(closeModal, 800); // pequeña pausa para que se alcance a leer el mensaje
    } catch (err) {
      showToast(err.message || "Ocurrió un error al calificar al estudiante",  "error");
    } finally {
      stopLoading();
    }
  };

  return (
    <div 
      className="fixed inset-0 flex justify-center items-center bg-black/50 z-100 
      transition-opacity duration-300">
      <form
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className=" flex flex-col gap-4 w-[20em] md:w-[30em] max-w-2xl bg-white rounded-md shadow-xl p-6"
      >
        <Title text={title} level="h3" weight="bold" />
        <hr className="text-blueT"/>

        <div className="flex flex-col gap-1 bg-gray-50 rounded-md p-3 ">
          <span className="font-semibold text-black">
            {student.student.firstname} {student.student.lastname}
          </span>
          <Small 
            text={`${student?.grade ?? "-"}° Grado — Sección ${student?.section ?? "-"}`}
            variant="ternary"
            size="large"
          />
          {student?.scale && (
          <Small
            variant="ternary"
            size="large"
            text={`Nota actual: ${student.score} — ${student.scale}`} 
          />
          )}
        </div>

        <FormItem 
          formFields={formFields}
        />

        <Button
          text={loading ? "Guardando..." : "Calificar"}
          variant="primary"
          type="submit"
          disabled={loading}
        />
      </form>
    </div>
  );
}

export { ModalRegisterBehaviors };