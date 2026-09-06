import { FormLogin } from '../../organims/formLogin'
import { DescriptionLogin } from '../../molecules/loginPage/descriptión'

export const LoginPage = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row font-[Poppins] overflow-hidden">

      {/* LEFT */}
      <div className="md:flex md:w-1/2 bg-linear-to-br from-[#032d3c] via-[#054d6a] to-[#0a7ea4] text-white 
        items-center justify-center p-10 relative">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -right-16 w-60 h-60 rounded-full bg-white/10" />
        <DescriptionLogin />
      </div>

      {/* RIGHT */}
      <div className="flex-1 flex items-center justify-center px-6  relative overflow-hidden bg-white">
        <FormLogin
          onLogin={onLogin}
        />
      </div>
    </div>
  )
}