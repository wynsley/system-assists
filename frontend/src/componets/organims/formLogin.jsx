import { useState } from "react"
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Button } from "../atoms/button"
import { FormItem } from "../molecules/formItems"
import { useNavigate } from 'react-router-dom'
import { apiFetch } from "../../helpers/apiFetch"
import { ROLE_ROUTES } from "../../config/dashboardRutes"
import { useToast } from "../../hooks/hookGlobals/useToast"
import { authStorage } from "../../helpers/authStorage"
import { Link } from "../atoms/link"
import { Title } from "../atoms/title"
import { useToggle } from "../../hooks/hookModal/useToggle";
import { useLoading } from "../../hooks/hookGlobals/useLoading";
import { ValidationLogin } from "../../validations/auth/validatioLogin";

function FormLogin({ onLogin }) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const {loading, startLoading, stopLoading} = useLoading()
  const { showToast } = useToast()

  //logica del ver y oculatar contraseña
  const {state: showPassword, toggle: togglePassword} = useToggle()

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    startLoading();
    setError("");

    try {
      await ValidationLogin.validateAsync({ email, password });

      const { ok, data } = await apiFetch("/login", "POST", { email, password });

      if (!data) {
        throw new Error("No se pudo conectar con el servidor. Intenta más tarde.");
      }

      if (!ok || !data.success) {
        throw new Error(data.message || "Usuario y/o contraseña inválidos");
      }

      // Centralizado en authStorage, ya no localStorage directo
      authStorage.saveUser(data.user);

      if (onLogin) onLogin(data.user);

      showToast(`Bienvenido, ${data.user.name ?? ""}`, "success");

      const path = ROLE_ROUTES[data.user?.role];
      if (path) {
        navigate(path);
      } else {
        console.warn("Rol no reconocido:", data.user?.role);
        navigate("/");
      }

    } catch (err) {
      console.error("Error de login:", err);
      setError(err.message || "Ocurrió un error inesperado");
      showToast(err.message || "No se pudo iniciar sesión", "error");
    } finally {
      stopLoading();
    }
  };

  const formFields = [
    {
      text: 'Usuario',
      htmlFor: 'user',
      type: 'text',
      name: 'user',
      value: email,
      placeholder: 'Tu Usuario',
      onChange: (e) => setEmail(e.target.value)
    },
    {
      text: 'Contraseña',
      htmlFor: 'passwd',
      type: showPassword ? 'text' : 'password',
      name: 'passwd',
      value: password,
      placeholder: 'Tu contraseña',
      onChange: (e) => setPassword(e.target.value),
      icon: showPassword ? <IoEye size={18}/> : <IoEyeOff size={18}/>,
      onIconClick : togglePassword
    }
  ]

  return (
    <form
      onSubmit={handleSubmit}
      className="
        absolute w-88 sm:w-90 py-10
        bg-[#f6f6f6] rounded-lg shadow-lg shadow-blue/20
        flex flex-col gap-5 p-6 z-999
        transition-all duration-400
        border border-gray-500/30 font-poppins
      "
    >
      {error && (
        <span className="text-sm text-red-700 text-center">
          {error}
        </span>
      )}

      <Title
        text='Iniciar Sesión'
        level="h2"
        align="center"
        weight="bold"
      />

      <FormItem formFields={formFields} labelSize="medium"/>

      <Button
        type='submit'
        variant="primary"
        text={loading ? 'Enviando...' : 'Ingresar'}
        disabled={loading}
        className="mt-4 text-[1em]"
      />

      <div className="
        mt-4 pt-4 border-t border-gray-200
        flex items-center justify-between 
        text-xs text-blue-600
      ">
        <Link text='Olvidé mi Contraseña' href='#' />
        <Link text='No tengo cuenta' href='#' />
      </div>
    </form>
  )
}

export { FormLogin }