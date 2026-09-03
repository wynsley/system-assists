import { FiX } from "react-icons/fi";
import { HiOutlineAcademicCap } from "react-icons/hi2";
import { useClickOutside } from "../../../hooks/hookModal/useClickOutside";
import { useToast } from "../../../hooks/hookGlobals/useToast";
import { Title } from "../../atoms/title";
import { useAuxiliarSectionAssignment } from "../../../hooks/hoocksAdmin/useAuxSectionAsigment";

function ModalAssignSections({ user, closeModal, onSuccess }) {
  const modalRef = useClickOutside(closeModal);
  const { showToast } = useToast();

  const {
    gradeGroups,
    loading,
    error,
    savingId,
    toggleClassroom,
    assignFullGrade,
  } = useAuxiliarSectionAssignment({ idAuxiliar: user.idUser });

  const handleToggle = async (section) => {
    try {
      await toggleClassroom({
        idClassroom: section.idClassroom,
        assigned: section.assigned,
        idClassroomAuxiliar: section.idClassroomAuxiliar,
      });
      onSuccess?.();
    } catch (err) {
      showToast(err.message || "Error al actualizar la asignación", "error");
    }
  };

  const handleAssignFullGrade = async (grade) => {
    try {
      const result = await assignFullGrade(grade);
      showToast(
        `${result.created} sección(es) asignada(s) en ${grade}° grado`,
        "success"
      );
      onSuccess?.();
    } catch (err) {
      showToast(err.message || "Error al asignar el grado completo", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col border border-gray-200"
      >
        {/* Header */}
        <div className="relative flex flex-col items-center border-b border-gray-200 p-6">
          <div className="flex items-center gap-2 text-blue">
            <HiOutlineAcademicCap size={28} />
            <Title level="h3" weight="bold" text="Asignar grados y secciones" />
          </div>
          <p className="text-sm text-gray-600 mt-1 font-medium">
            {user.firstname} {user.lastname}
          </p>
          <p className="text-xs text-gray-400">{user.email}</p>
          <FiX
            size={22}
            onClick={closeModal}
            className="absolute right-5 top-5 cursor-pointer text-gray-400 hover:text-gray-700"
          />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex flex-col items-center gap-2 text-gray-400 py-10">
              <div className="w-8 h-8 border-4 border-blue/30 border-t-blue rounded-full animate-spin" />
              <p>Cargando aulas...</p>
            </div>
          )}

          {error && !loading && (
            <p className="text-sm text-red-600 text-center py-4">{error}</p>
          )}

          {!loading && !error && gradeGroups.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-10">
              No hay aulas activas registradas para este año.
            </p>
          )}

          {!loading && !error && gradeGroups.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {gradeGroups.map((group) => {
                const allAssigned = group.sections.every((s) => s.assigned);

                return (
                  <div
                    key={group.level}
                    className="border border-gray-200 rounded-xl p-4 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-gray-800">
                        {group.level}° Grado
                      </h4>
                      <button
                        onClick={() => handleAssignFullGrade(group.level)}
                        disabled={allAssigned}
                        className="text-xs text-blue-700 hover:underline disabled:text-gray-300 disabled:cursor-not-allowed"
                      >
                        Asignar todo
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {group.sections.map((section) => {
                        const isSaving = savingId === section.idClassroom;
                        return (
                          <button
                            key={section.idClassroom}
                            onClick={() => handleToggle(section)}
                            disabled={isSaving}
                            className={`
                              px-3 py-1.5 rounded-full text-sm font-medium
                              transition-all duration-150
                              disabled:opacity-50 disabled:cursor-not-allowed
                              ${section.assigned
                                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                : "bg-gray-100 text-gray-400 hover:bg-gray-200"}
                            `}
                          >
                            {isSaving ? "..." : section.section}
                            {section.assigned && !isSaving && (
                              <span className="ml-1">✕</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex justify-end">
          <button
            onClick={closeModal}
            className="px-4 py-2 rounded-lg bg-blue text-white text-sm font-semibold hover:opacity-90 transition"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
}

export { ModalAssignSections };