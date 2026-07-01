import { useState } from "react";
import { TitleAndIcon } from "../../molecules/titleAndIcon"
import { HiUsers } from "react-icons/hi2";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Table } from "../tableReusable";
import { useUsers } from "../../../hooks/hoocksAdmin/useUsers";
import { useDebounce } from "../../../hooks/hookGlobals/useDebounce";
import { useRowToggle } from "../../../hooks/hooksAssistant/useRowToggle";
import { useToast } from "../../../hooks/hookGlobals/useToast";
import { ModalRegisterUser } from "../../modals/adminRegisters/modalReegisterUsers";
import { ROLE_LABELS } from "../../../config/roleLabels";
import { UserFilters } from "../../molecules/adminRegisters/filtersUsers";
import { PaginationUSers } from "../../molecules/adminRegisters/paginationUsers";

function ListUsers() {
  const title = 'USUARIOS'
  const headers = [
    "Nombre",
    "Email",
    "Teléfono",
    "Rol",
    "Grados a cargo",
    "Secciones a cargo",
    "Acciones"
  ]
  //filtros
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  const { users, total, loading, error, deleteUser, refetch } = useUsers({
    page,
    limit: 10,
    role: role || undefined,
    search: debouncedSearch || undefined,
  });

  const { openRowId, openRow, closeRow } = useRowToggle();
  const { showToast } = useToast();

  const editingUser = users.find((u) => u.idUser === openRowId) ?? null;

  const handleEdit = (user) => {
    openRow(user.idUser);
  };

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar a ${user.firstname} ${user.lastname}?`
    );
    if (!confirmed) return;

    try {
      await deleteUser(user.idUser);
      showToast("Usuario eliminado correctamente", "success");
    } catch (err) {
      showToast(err.message || "No se pudo eliminar el usuario", "error");
    }
  };

  const renderRow = (user, index) => {
    const isActive = openRowId === user.idUser;

    return (
      <tr
        key={user.idUser ?? index}
        className={`
          border-b border-gray-100
          transition-colors
          ${isActive ? "bg-blue-100" : "hover:bg-gray-50"}
        `}
      >
        <td className="px-6 py-4 whitespace-nowrap font-medium">
          {user.firstname} {user.lastname}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
        <td className="px-6 py-4 whitespace-nowrap">{user.phone || "—"}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
            {ROLE_LABELS[user.role] ?? user.role}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {user.grades?.map(g => g.level).join(", ") || "—"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {user.sections?.map(s => s.name).join(", ") || "—"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap relative">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleEdit(user)}
              className="text-blue-700 hover:underline"
              title="Editar"
            >
              <FaEdit size={18} />
            </button>
            <button
              onClick={() => handleDelete(user)}
              className="text-red-600 hover:underline"
              title="Eliminar"
            >
              <FaTrash size={18} />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="mt-10 flex flex-col gap-5 w-[96%] md:w-[90%] md:max-w-7xl mx-auto mb-10">
      <TitleAndIcon
        icon={HiUsers}
        title={title}
        level='h3'
        weight='bold'
        sizeIcon={30}
      />

      {/* Filtros */}
      <UserFilters
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        role={role}
        onRoleChange={(value) => {
          setRole(value);
          setPage(1);
        }}
      />

      {error && (
        <span className="text-sm text-red-600">{error}</span>
      )}

      {loading ? (
        <p className="text-center text-gray-500 py-10">Cargando usuarios...</p>
      ) : (
        <>
          <Table
            headers={headers}
            data={users}
            renderRow={renderRow}
            emptyMessage="No se encontraron usuarios"
          />

          <PaginationUSers
            total={total}
            setPage={setPage}
            page={page}
            users={users}
          />
        </>
      )}

      {editingUser && (
        <ModalRegisterUser
          mode="edit"
          initialData={editingUser}
          closeModal={closeRow}
          onSuccess={refetch}
        />
      )}
    </div>
  )
}

export { ListUsers }