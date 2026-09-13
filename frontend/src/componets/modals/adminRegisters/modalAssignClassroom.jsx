import { FiX } from "react-icons/fi";
import { TitleAndDescaription } from "../../molecules/titleandDescription";
import { FormItem } from "../../molecules/formItems";
import { Button } from "../../atoms/button";
import { useState } from "react";
import { useLoading } from "../../../hooks/hookGlobals/useLoading";
import { useClickOutside } from "../../../hooks/hookModal/useClickOutside";
import { useClassrooms } from "../../../hooks/hoocksAdmin/useClassroom";
import { useConfirm } from "../../../hooks/hoocksAdmin/useConfirmDelete";
import { ModalConfirm } from "./modalConfirmDelete";

function ModalAssignClassroom({ student, currentClassroom, idClassroomStudent, closeModal, onAssign }) {
  const [classroomYear, setClassroomYear] = useState(String(new Date().getFullYear()));
  const [idClassroom, setIdClassroom] = useState('');
  const [error, setError] = useState('');
  const { loading, startLoading, stopLoading } = useLoading();
  const modalRef = useClickOutside(() => {
  if (!config) closeModal();
});
  const { config, confirm, closeConfirm } = useConfirm();

  const { classrooms, years } = useClassrooms({
    limit: 50,
    year: classroomYear || undefined,
  });

  const currentClassroomLabel = currentClassroom
    ? `${currentClassroom.grade}° "${currentClassroom.section}" — ${currentClassroom.year}`
    : "Sin aula asignada";

  const formFields = [
    {
      text: 'Año académico',
      type: 'select', name: 'classroomYear', value: classroomYear,
      onChange: (e) => {
        setClassroomYear(e.target.value);
        setIdClassroom('');
      },
      options: [
        { text: 'Selecciona un año', value: '' },
        ...years.map((y) => ({ text: String(y.year), value: String(y.year) })),
      ],
    },
    {
      text: 'Nueva aula', type: 'select', name: 'idClassroom', value: idClassroom,
      require: 'required',
      onChange: (e) => setIdClassroom(e.target.value),
      options: [
        { text: 'Selecciona un aula', value: '' },
        ...classrooms
          .filter((c) => c.idClassroom !== currentClassroom?.idClassroom)
          .map((c) => ({
            text: `${c.year} — ${c.grade}° ${c.section}`,
            value: String(c.idClassroom),
          })),
      ],
    },
  ];

  const doAssign = async (newIdClassroom) => {
    try {
      startLoading();
      await onAssign(idClassroomStudent, newIdClassroom);
      closeModal();
    } catch (err) {
      setError(err.message || 'No se pudo reasignar el aula');
    } finally {
      stopLoading();
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!idClassroom) {
      setError('Selecciona un aula');
      return;
    }

    const selected = classrooms.find((c) => c.idClassroom === Number(idClassroom));
    const newClassroomLabel = selected
      ? `${selected.grade}° "${selected.section}" — ${selected.year}`
      : "el aula seleccionada";

    confirm({
      title: `¿Cambiar de aula a ${student.firstname} ${student.lastname}?`,
      description: `Pasará de ${currentClassroomLabel} a ${newClassroomLabel}. Si el auxiliar responsable cambia, su nota de comportamiento del bimestre actual se reiniciará a 0.`,
      onConfirm: () => doAssign(Number(idClassroom)),
    });
  };

  return (
    <>
      <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-100 transition-opacity duration-300">
        <form
          ref={modalRef}
          onSubmit={onSubmit}
          noValidate
          className="flex flex-col gap-5 w-[25em] md:w-[30em] max-w-xl bg-white rounded-md shadow-xl p-6"
        >
          <div className="relative">
            <TitleAndDescaription
              title="CAMBIAR DE AULA"
              description={`${student.firstname} ${student.lastname}`}
              level="h3"
              size="small"
              weight="bold"
            />
            <FiX
              size={23}
              className="absolute top-0 right-0 cursor-pointer"
              onClick={closeModal}
            />
          </div>

          <div className="bg-gray-50 rounded-lg px-4 py-2 text-sm text-gray-600">
            Aula actual: <span className="font-semibold">{currentClassroomLabel}</span>
          </div>

          {error && <span className="text-sm text-red-600">{error}</span>}

          <FormItem
            formFields={formFields}
            required={true}
            selectVariant="secondary"
          />

          <div className="flex gap-5 justify-end items-center">
            <Button
              type="submit"
              variant="primary"
              text={loading ? "Guardando..." : "Reasignar"}
              disabled={loading}
            />
            <Button
              variant="primary"
              type="button"
              text="Cancelar"
              onClick={closeModal}
            />
          </div>
        </form>
      </div>

      {config && (
        <ModalConfirm
          title={config.title}
          description={config.description}
          confirm={config.onConfirm}
          closeModal={closeConfirm}
          confirmText="Reasignar"
          variant="warning"
        />
      )}
    </>
  );
}

export { ModalAssignClassroom };