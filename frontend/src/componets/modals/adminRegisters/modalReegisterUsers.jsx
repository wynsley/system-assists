import { FiX } from "react-icons/fi"
import { useClickOutside } from "../../../hooks/hookModal/useClickOutside"
import { TitleAndDescaription } from "../../molecules/titleandDescription"
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useState } from "react"
import { useLoading } from "../../../hooks/hookGlobals/useLoading"
import { useToggle } from "../../../hooks/hookModal/useToggle"
import { FormItem } from "../../molecules/formItems";
import { ValidateRegisterUser } from "../../../validations/users/ValidationsRegisterUser";
import { ValidationUpdateUser } from "../../../validations/users/validateUpdateUser";
import { apiFetch } from "../../../helpers/apiFetch";
import { useToast } from "../../../hooks/hookGlobals/useToast";
import { Button } from "../../atoms/button";

function ModalRegisterUser({onSuccess, closeModal, mode = "create", initialData = null }) {
  const isEdit = mode === "edit";

  const [firstname, setFirtsname] = useState(initialData?.firstname ?? '')
  const [lastname, setLastname] = useState(initialData?.lastname ?? '')
  const [email, setEmail] = useState(initialData?.email ?? '')
  const [password, setPasssword] = useState('')
  const [repassword, setRepassword] = useState('')
  const [role, setRole] = useState(initialData?.role ?? '')
  const [phone, setPhone] = useState(initialData?.phone ?? '')

  const [error, setError] = useState('')
  const { loading, startLoading, stopLoading } = useLoading()
  const { showToast } = useToast()

  const { modalRef } = useClickOutside(closeModal)
  const { state: seePassword, toggle: toggleSeepassword } = useToggle()
  const { state: seeRepassword, toggle: toggleSeeRepassword } = useToggle()

  const schema = isEdit ? ValidationUpdateUser : ValidateRegisterUser;

  const validateField = async (name, value) => {
    try {
      if (name === 'repassword') {
        if (isEdit && !password) {
          // en edición, si no se está cambiando password, repassword no aplica
          setError('');
          return;
        }
        if (!value) throw new Error('Debes confirmar la contraseña');
        if (value !== password) throw new Error('Las contraseñas no coinciden');
      } else {
        const fieldSchema = schema.extract(name);
        await fieldSchema.validateAsync(value);
      }
      setError('');
    } catch (err) {
      const message = err.details ? err.details[0].message : err.message;
      setError(message);
    }
  };

  const resetForm = () => {
    setFirtsname('')
    setLastname('')
    setEmail('')
    setPasssword('')
    setRepassword('')
    setRole('')
    setPhone('')
    setError('')
  }

  const formFields = [
    {
      text: 'Nombres',
      type: 'text',
      name: 'firstname',
      value: firstname,
      require: 'required',
      placeholder: 'Coronel',
      onChange: (e) => setFirtsname(e.target.value),
      onBlur: (e) => validateField('firstname', e.target.value),
    },
    {
      text: 'Apellidos',
      type: 'text',
      name: 'lastname',
      value: lastname,
      require: 'required',
      placeholder: 'Cortegana',
      onChange: (e) => setLastname(e.target.value),
      onBlur: (e) => validateField('lastname', e.target.value),
    },
    {
      text: 'Correo Electrónico',
      type: 'email',
      name: 'email',
      value: email,
      require: 'required',
      placeholder: 'system@correo.com',
      onChange: (e) => setEmail(e.target.value),
      onBlur: (e) => validateField('email', e.target.value),
    },
    [
      {
        text: isEdit ? 'Nueva contraseña (opcional)' : 'Contraseña',
        type: seePassword ? 'text' : 'password',
        name: 'password',
        value: password,
        require: isEdit ? undefined : 'required',
        placeholder: isEdit ? 'Déjalo vacío si no la cambias' : 'Mínimo 8 caracteres, letras y números',
        onChange: (e) => setPasssword(e.target.value),
        onBlur: (e) => validateField('password', e.target.value),
        icon: seePassword ? <IoEye size={18} /> : <IoEyeOff size={18} />,
        onIconClick: toggleSeepassword
      },
      {
        text: 'Confirmar Contraseña',
        type: seeRepassword ? 'text' : 'password',
        name: 'repassword',
        value: repassword,
        require: isEdit ? undefined : 'required',
        placeholder: 'Repite la contraseña',
        onChange: (e) => setRepassword(e.target.value),
        onBlur: (e) => validateField('repassword', e.target.value),
        icon: seeRepassword ? <IoEye size={18} /> : <IoEyeOff size={18} />,
        onIconClick: toggleSeeRepassword
      },
    ],
    [
      {
        text: 'Rol',
        type: 'select',
        name: 'role',
        value: role,
        require: 'required',
        placeholder: 'Selecciona un rol',
        onChange: (e) => setRole(e.target.value),
        onBlur: (e) => validateField('role', e.target.value),
        options: [
          { text: 'Administrador', value: 'ADMIN' },
          { text: 'Auxiliar', value: 'AUXILIAR' },
          { text: 'Padre de familia', value: 'PARENT' },
        ]
      },
      {
        text: 'Celular',
        type: 'tel',
        name: 'phone',
        value: phone,
        require: 'required',
        placeholder: '+51 987 654 321',
        onChange: (e) => setPhone(e.target.value),
        onBlur: (e) => validateField('phone', e.target.value),
      },
    ]
  ]

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // En edición, si dejaron password vacío, no lo mandamos ni lo validamos
    const payload = isEdit
      ? {
          firstname, lastname, email, role, phone,
          ...(password ? { password, repassword } : {}),
        }
      : { firstname, lastname, email, password, repassword, role, phone };

    try {
      await schema.validateAsync(payload);

      // Validación extra para edición: si pusieron password, repassword debe coincidir
      if (isEdit && password && password !== repassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      startLoading();

      const url = isEdit ? `/user/${initialData.idUser}` : '/user';
      const method = isEdit ? 'PATCH' : 'POST';

      const { ok, data } = await apiFetch(url, method, payload);

      if (!data) throw new Error("No se pudo conectar al servidor");
      if (!ok || !data.success) {
        throw new Error(data.message || (isEdit ? "Error al actualizar usuario" : "Error al registrar usuario"));
      }

      showToast(
        isEdit ? "Usuario actualizado con éxito" : "Usuario registrado con éxito",
        "success"
      );

      if (!isEdit) resetForm();
      closeModal();
      onSuccess()

    } catch (err) {
      const message = err.details ? err.details[0].message : (err.message || "Error al guardar usuario");
      setError(message);
    } finally {
      stopLoading();
    }
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-100 transition-opacity duration-300">
      <form
        ref={modalRef}
        onSubmit={onSubmit}
        noValidate
        className="flex flex-col gap-5 w-[25em] md:w-[45em] max-w-xl bg-white rounded-md shadow-xl p-6"
      >
        <div className="relative">
          <TitleAndDescaription
            title={isEdit ? 'EDITAR USUARIO' : 'REGISTRAR USUARIO'}
            description='Ingresa los datos correctamente'
            level='h3'
            size='small'
            weight='bold'
          />
          <FiX
            size={23}
            className="absolute top-0 right-0 cursor-pointer"
            onClick={closeModal}
          />
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
            text={loading ? "Guardando..." : (isEdit ? "Actualizar" : "Registrar")}
            disabled={loading}
          />
          <Button
            variant="primary"
            type="button"
            text='Cancelar'
            onClick={closeModal}
          />
        </div>
      </form>
    </div>
  )
}

export { ModalRegisterUser }