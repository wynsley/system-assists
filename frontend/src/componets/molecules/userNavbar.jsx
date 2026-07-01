import { IoChevronDownSharp,  } from "react-icons/io5";
import { FaUser } from "react-icons/fa6";
import { Button } from "../atoms/button"

function UserNavbar ({
  user,
  toggleModal,
  isOpen}) {

  return(
      <Button
        onClick={toggleModal}
        className="flex flex-row md:flex-row items-center gap-2 px-4 py-2 h-full
        transition-colors duration-300 hover:bg-blueT"
      >
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-blueT flex items-center justify-center text-white">
            <FaUser size={20} />
          </div>
        )}

        <p className="text-sm font-medium text-white sm:block md:hidden lg:block  truncate max-w-30">
          {user.name}
        </p>

        <IoChevronDownSharp
          size={16}
          className={`transition-transform duration-300 text-white ${isOpen ? 'rotate-180' : ''
            }`}
        />
      </Button>
  )
}

export {UserNavbar}