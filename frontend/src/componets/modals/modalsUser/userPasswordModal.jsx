import { FiX } from "react-icons/fi";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useState } from "react";
import { Button } from "../../atoms/button";
import { FormItem } from "../../molecules/formItems";
import { Title } from "../../atoms/title";
//hoooks
import { useToast } from "../../../hooks/hookGlobals/useToast";
import { useToggle } from "../../../hooks/hookModal/useToggle";
import { useLoading } from "../../../hooks/hookGlobals/useLoading";
import { apiFetch } from "../../../helpers/apiFetch";
import { ValidationChangePassword } from "../../../validations/auth/validationChangePassword";

function ChangePasswordModal({ closeModal }) {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");

  const [error, setError] = useState("");
  const { loading, startLoading, stopLoading } = useLoading();
  const { showToast } = useToast();

  const { state: showOldPassword, toggle: toggleOldPassword } = useToggle();
  const { state: showNewPassword, toggle: toggleNewPassword } = useToggle();
  const { state: showRePassword, toggle: toggleRePassword } = useToggle();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    startLoading();

    try {
      // Validación desde el front
      await ValidationChangePassword.validateAsync({
        oldPassword,
        password,
        repassword,
      });

      // Petición a la API
      const { ok, data } = await apiFetch("/change-password", "POST", {
        oldPassword,
        password,
        repassword,
      });

      if (!data) {
        throw new Error("No se pudo conectar con el servidor.");
      }

      if (!ok || !data.success) {
        throw new Error(data.message || "No se pudo cambiar la contraseña");
      }

      //  Éxito
      showToast("Contraseña actualizada con éxito", "success");
      closeModal();

    } catch (err) {
      setError(err.message || "Error al cambiar contraseña");
    } finally {
      stopLoading();
    }
  };

  const formFields = [
    {
      text: "Contraseña Actual",
      type: showOldPassword ? "text" : "password",
      placeholder: "••••••••",
      name: "oldPassword",
      value: oldPassword,
      onChange: (e) => setOldPassword(e.target.value),
      icon: showOldPassword ? <IoEye size={18} /> : <IoEyeOff size={18} />,
      onIconClick: toggleOldPassword,
    },
    {
      text: "Nueva contraseña",
      type: showNewPassword ? "text" : "password",
      placeholder: "••••••••",
      name: "password",
      value: password,
      onChange: (e) => setPassword(e.target.value),
      icon: showNewPassword ? <IoEye size={18} /> : <IoEyeOff size={18} />,
      onIconClick: toggleNewPassword,
    },
    {
      text: "Confirmar contraseña",
      type: showRePassword ? "text" : "password",
      placeholder: "••••••••",
      name: "repassword",
      value: repassword,
      onChange: (e) => setRepassword(e.target.value),
      icon: showRePassword ? <IoEye size={18} /> : <IoEyeOff size={18} />,
      onIconClick: toggleRePassword,
    },
  ];

  return (
    <div
      className="fixed inset-0 flex justify-center items-center md:block bg-black/50 z-100 transition-opacity duration-300"
      onClick={closeModal}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="absolute md:m-0 w-[20em] md:w-[23em] max-w-md bg-white md:absolute
          md:right-8
          md:top-16
          shadow-xl shadow-blueT px-6 py-7 flex flex-col gap-5
          animate-[slideDown_0.3s_ease-out]
        "
      >
        <div className="flex flex-col items-center border-b border-black/30 pb-3">
          <Title
            text="Restablecer contraseña"
            level="h3"
            weight="bold"
            className="font-poppins"
            align="center"
          />
          <FiX
            onClick={closeModal}
            className="absolute right-2 top-2 text-blue/40 z-100"
          />
        </div>

        {error && <span className="text-sm text-red-500">{error}</span>}

        <FormItem formFields={formFields} inputSize="medium" />

        <Button
          type="submit"
          disabled={loading}
          variant="secondary"
          text={loading ? "Guardando..." : "Confirmar"}
        />
      </form>
    </div>
  );
}

export { ChangePasswordModal };