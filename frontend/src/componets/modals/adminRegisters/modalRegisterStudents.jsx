import { FiX } from "react-icons/fi"
import { TitleAndDescaription } from "../../molecules/titleandDescription"
import { FormItem } from "../../molecules/formItems";
import { Button } from "../../atoms/button";
//validations
import { ValidationUpdateStudent } from "../../../validations/students/validateUpdateStudent";
import { ValidationCreateStudent } from "../../../validations/students/validateRegisterStudent";
//hooks
import { useState } from "react"
import { useLoading } from "../../../hooks/hookGlobals/useLoading"
import { useToast } from "../../../hooks/hookGlobals/useToast";
import { useClickOutside } from "../../../hooks/hookModal/useClickOutside"
import { apiFetch } from "../../../helpers/apiFetch";

function ModalRegisterStudent({ closeModal, mode = "create", initialData = null, onSuccess }) {
  const isEdit = mode === "edit";

  const [firstname, setFirstname] = useState(initialData?.firstname ?? '')
  const [lastname, setLastname] = useState(initialData?.lastname ?? '')
  const [dni, setDni] = useState(initialData?.dni ?? '')
  const [gender, setGender] = useState(initialData?.gender ?? '')
  const [phone, setPhone] = useState(initialData?.phone ?? '')
  const [email, setEmail] = useState(initialData?.email ?? '')
  const [status, setStatus] = useState(initialData?.status ?? '')

  const [error, setError] = useState('')
  const { loading, startLoading, stopLoading } = useLoading()
  const { showToast } = useToast()

  const { modalRef } = useClickOutside(closeModal)

  const schema = isEdit ? ValidationUpdateStudent : ValidationCreateStudent;

  const validateField = async (name, value) => {
    try {
      const fieldSchema = schema.extract(name);
      await fieldSchema.validateAsync(value);
      setError('');
    } catch (err) {
      const message = err.details ? err.details[0].message : err.message;
      setError(message);
    }
  };

  const resetForm = () => {
    setFirstname('')
    setLastname('')
    setDni('')
    setGender('')
    setPhone('')
    setEmail('')
    setStatus('')
    setError('')
  }

  const formFields = [
    {
      text: 'Nombres',
      type: 'text',
      name: 'firstname',
      value: firstname,
      require: 'required',
      placeholder: 'Ej: Juan Carlos',
      onChange: (e) => setFirstname(e.target.value),
      onBlur: (e) => validateField('firstname', e.target.value),
    },
    {
      text: 'Apellidos',
      type: 'text',
      name: 'lastname',
      value: lastname,
      require: 'required',
      placeholder: 'Ej: Pérez Gómez',
      onChange: (e) => setLastname(e.target.value),
      onBlur: (e) => validateField('lastname', e.target.value),
    },
    [
      {
        text: 'DNI',
        type: 'text',
        name: 'dni',
        value: dni,
        require: 'required',
        placeholder: '8 dígitos',
        onChange: (e) => setDni(e.target.value),
        onBlur: (e) => validateField('dni', e.target.value),
      },
      {
        text: 'Sexo',
        type: 'select',
        name: 'gender',
        value: gender,
        require: 'required',
        placeholder: 'Selecciona',
        onChange: (e) => setGender(e.target.value),
        onBlur: (e) => validateField('gender', e.target.value),
        options: [
          { text: 'seleccione su sexo', value: '' },
          { text: 'Masculino', value: 'M' },
          { text: 'Femenino', value: 'F' },
          { text: 'Otro', value: 'O' },
        ]
      },
    ],
    [
      {
        text: 'Teléfono (opcional)',
        type: 'tel',
        name: 'phone',
        value: phone,
        placeholder: '+51 987 654 321',
        onChange: (e) => setPhone(e.target.value),
        onBlur: (e) => validateField('phone', e.target.value),
      },
      {
        text: 'Correo (opcional)',
        type: 'email',
        name: 'email',
        value: email,
        placeholder: 'ejemplo@correo.com',
        onChange: (e) => setEmail(e.target.value),
        onBlur: (e) => validateField('email', e.target.value),
      },
    ],
    {
      text: 'Estado',
      type: 'select',
      name: 'status',
      value: status,
      placeholder: 'Selecciona un estado',
      onChange: (e) => setStatus(e.target.value),
      onBlur: (e) => validateField('status', e.target.value),
      options: [
        { text: 'Estado', value: '' },
        { text: 'Activo', value: 'ACTIVO' },
        { text: 'Inactivo', value: 'INACTIVO' },
        { text: 'Suspendido', value: 'SUSPENDIDO' },
        { text: 'Expulsado', value: 'EXPULSADO' },
        { text: 'Transferido', value: 'TRANSFERIDO' },
        { text: 'Graduado', value: 'GRADUADO' },
        { text: 'Retirado', value: 'RETIRADO' },
      ]
    },
  ]

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = { firstname, lastname, dni, gender, phone, email, status };

    try {
      await schema.validateAsync(payload);

      startLoading();

      const url = isEdit ? `/student/${initialData.idStudent}` : '/student';
      const method = isEdit ? 'PATCH' : 'POST';

      const { ok, data } = await apiFetch(url, method, payload);

      if (!data) throw new Error("No se pudo conectar al servidor");
      if (!ok || !data.success) {
        throw new Error(data.message || (isEdit ? "Error al actualizar estudiante" : "Error al registrar estudiante"));
      }

      showToast(
        isEdit ? "Estudiante actualizado con éxito" : "Estudiante registrado con éxito",
        "success"
      );

      if (!isEdit) resetForm();

      onSuccess?.();
      closeModal();

    } catch (err) {
      const message = err.details ? err.details[0].message : (err.message || "Error al guardar estudiante");
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
            title={isEdit ? 'EDITAR ESTUDIANTE' : 'REGISTRAR ESTUDIANTE'}
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

export { ModalRegisterStudent }