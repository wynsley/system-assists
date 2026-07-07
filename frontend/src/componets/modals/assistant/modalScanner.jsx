import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { HiXMark } from "react-icons/hi2";
import { MdOutlineQrCodeScanner } from "react-icons/md";
import { Title } from "../../atoms/title";
import { ModalScanResult } from "./ModalScanResult";
import { useToast } from "../../../hooks/hookGlobals/useToast";

function ModalScanner({
  findStudentByDni,
  createAttendance,
  closeModal,
}) {
  const scannerRef = useRef(null);
  const isProcessingRef = useRef(false);

  const { showToast } = useToast();

  const [cameraError, setCameraError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [student, setStudent] = useState(null);
  const [lastScanned, setLastScanned] = useState(null);

  useEffect(() => {
    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    const startScanner = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();

        if (!devices.length) {
          setCameraError("No se encontró ninguna cámara.");
          setIsLoading(false);
          return;
        }

        const backCamera =
          devices.find((d) =>
            d.label.toLowerCase().includes("back")
          ) ||
          devices.find((d) =>
            d.label.toLowerCase().includes("rear")
          ) ||
          devices[0];

        await scanner.start(
          backCamera.id,
          {
            fps: 10,
            qrbox: {
              width: 250,
              height: 250,
            },
          },

          async (decodedText) => {
            if (isProcessingRef.current) return;

            isProcessingRef.current = true;

            try {
              setLastScanned(decodedText);

              const studentData =
                await findStudentByDni(decodedText);

              setStudent(studentData);
            } catch (err) {
              showToast(
                err.message || "Estudiante no encontrado",
                "error"
              );

              isProcessingRef.current = false;
            }
          }
        );

        setIsLoading(false);
      } catch {
        setCameraError(
          "No se pudo acceder a la cámara."
        );
        setIsLoading(false);
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [findStudentByDni, showToast]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleFinish = () => {
    setStudent(null);

    isProcessingRef.current = false;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 border border-blue/20">

        <button
          onClick={closeModal}
          className="absolute top-5 right-5 text-blue hover:text-red-500"
        >
          <HiXMark size={28} />
        </button>

        <div className="flex items-center gap-3 text-blue mb-4">
          <MdOutlineQrCodeScanner size={36} />

          <div>
            <Title
              level="h3"
              weight="bold"
              text="Escanear asistencia"
            />

            <p className="text-gray-500 text-sm">
              Apunte la cámara hacia el QR del estudiante.
            </p>
          </div>
        </div>

        <div className="relative rounded-2xl border border-blue/20 p-4 bg-gray-50 min-h-[300px] flex items-center justify-center">

          {isLoading && !cameraError && (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <div className="w-8 h-8 border-4 border-blue/30 border-t-blue rounded-full animate-spin" />
              <p>Iniciando cámara...</p>
            </div>
          )}

          {cameraError && (
            <div className="text-center text-red-500">
              <MdOutlineQrCodeScanner
                size={36}
                className="mx-auto mb-2 opacity-50"
              />

              <p>{cameraError}</p>
            </div>
          )}

          <div
            id="reader"
            className={
              isLoading || cameraError
                ? "hidden"
                : "w-full"
            }
          />

          {student && (
            <ModalScanResult
              student={student}
              createAttendance={createAttendance}
              closeModal={handleFinish}
            />
          )}
        </div>

        {lastScanned && (
          <div className="mt-4 flex items-center gap-2 bg-green-50 border border-green-200 rounded-2xl px-4 py-2">

            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>

            <p className="text-green-700 text-sm">
              Último escaneado:

              <span className="font-bold ml-2">
                {lastScanned}
              </span>
            </p>

          </div>
        )}

      </div>
    </div>
  );
}

export { ModalScanner };