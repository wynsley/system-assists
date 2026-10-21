import { FaQrcode } from "react-icons/fa";
import { MdOutlineFileDownload } from "react-icons/md";
import { useModal } from "../../../hooks/hookModal/useModal";
import { useClickOutside } from "../../../hooks/hookModal/useClickOutside";
import { downloadQrPdf, downloadQrPng } from "../../../helpers/qrDowload";

function DownloadQr({ student }) {
  const { isOpen, toggleModal, closeModal } = useModal();
  const menuRef = useClickOutside(closeModal);

  const handleDownload = async (download) => {
    closeModal();
    await download(student);
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={toggleModal}
        className="text-green-700 hover:underline"
        title="Descargar QR"
      >
        <FaQrcode size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-7 z-50 min-w-28 bg-white border border-gray-200 rounded-md shadow-lg text-sm">
          <button
            type="button"
            className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => handleDownload(downloadQrPng)}
          >
            <MdOutlineFileDownload size={20} /> PNG
          </button>
          <button
            type="button"
            className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => handleDownload(downloadQrPdf)}
          >
            <MdOutlineFileDownload size={20} /> PDF
          </button>
        </div>
      )}
    </div>
  );
}

export { DownloadQr };