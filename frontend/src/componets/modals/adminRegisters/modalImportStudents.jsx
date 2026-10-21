import { useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import { FaFileExcel, FaDownload, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { Button } from "../../atoms/button";
import { useToast } from "../../../hooks/hookGlobals/useToast";
import { useClickOutside } from "../../../hooks/hookModal/useClickOutside";
import { apiFetch } from "../../../helpers/apiFetch";
import { parseStudentsFile, downloadTemplate } from "../../../utils/importStudents";

function ModalImportStudents({ closeModal, onSuccess }) {
  const inputRef = useRef(null);
  const modalRef = useClickOutside(closeModal);
  const { showToast } = useToast();

  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState(null); // { valid, invalid, total }
  const [result, setResult] = useState(null);   // respuesta del back
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [dragging, setDragging] = useState(false);

  const processFile = async (file) => {
    if (!file) return;
    setParsing(true);
    setResult(null);
    try {
      const data = await parseStudentsFile(file);
      setPreview(data);
      setFileName(file.name);
    } catch (err) {
      setPreview(null);
      setFileName("");
      showToast(err.message, "error");
    } finally {
      setParsing(false);
      if (inputRef.current) inputRef.current.value = ""; 
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const handleImport = async () => {
    setImporting(true);
    try {
      const { ok, data } = await apiFetch("/student/bulk", "POST", {
        students: preview.valid,
      });
      if (!data) throw new Error("No se pudo conectar al servidor");
      if (!ok || !data.success) {
        throw new Error(data.errors?.[0]?.message || data.message || "Error al importar");
      }
      setResult(data.data);
      setPreview(null);
      showToast(`${data.data.created} estudiantes importados`, "success");
      onSuccess?.();
    } catch (err) {
      showToast(err.message || "No se pudo completar la importación", "error");
    } finally {
      setImporting(false);
    }
  };

  const reset = () => {
    setPreview(null);
    setResult(null);
    setFileName("");
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-100 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-md shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-3">
          <div>
            <h3 className="text-xl font-bold">IMPORTAR ESTUDIANTES</h3>
            <p className="text-sm text-gray-600">Sube un archivo Excel con los datos</p>
          </div>
          <FiX size={23} className="cursor-pointer" onClick={closeModal} />
        </div>

        {/* Body */}
        <div className="px-6 py-3 overflow-y-auto flex flex-col gap-4">
          {/* Paso 1: elegir archivo */}
          {!preview && !result && (
            <>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`cursor-pointer border-2 border-dashed rounded-lg p-10 text-center transition-colors
                  ${dragging ? "border-[#06293a] bg-gray-100" : "border-gray-300 hover:bg-gray-50"}`}
              >
                <FaFileExcel size={40} className="mx-auto text-green-600 mb-3" />
                <p className="font-medium">
                  {parsing ? "Leyendo archivo..." : "Arrastra tu archivo aquí o haz clic para elegirlo"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Solo .xlsx · máximo 5 MB · hasta 1000 filas
                </p>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".xlsx"
                  className="hidden"
                  onChange={(e) => processFile(e.target.files?.[0])}
                />
              </div>

              <div className="text-sm text-gray-600 flex flex-col gap-1">
                <p>
                  <b>Obligatorias:</b> Nombres, Apellidos, DNI, Sexo.{" "}
                  <b>Opcionales:</b> Teléfono, Correo, Estado .
                </p>
                <button
                  type="button"
                  onClick={downloadTemplate}
                  className="self-start mt-1 inline-flex items-center gap-2 text-blue-700 hover:underline"
                >
                  <FaDownload size={14} /> Descargar plantilla
                </button>
              </div>
            </>
          )}

          {/* Paso 2: vista previa */}
          {preview && (
            <>
              <p className="text-sm text-gray-600">Archivo: <b>{fileName}</b></p>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-green-50 text-green-800 p-4 flex items-center gap-3">
                  <FaCheckCircle size={22} />
                  <div>
                    <p className="text-2xl font-bold leading-none">{preview.valid.length}</p>
                    <p className="text-sm">filas válidas</p>
                  </div>
                </div>
                <div className="rounded-lg bg-red-50 text-red-800 p-4 flex items-center gap-3">
                  <FaExclamationTriangle size={22} />
                  <div>
                    <p className="text-2xl font-bold leading-none">{preview.invalid.length}</p>
                    <p className="text-sm">filas con errores</p>
                  </div>
                </div>
              </div>

              {preview.invalid.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <p className="bg-gray-50 px-3 py-2 text-sm font-medium">
                    Filas con errores (no se importarán)
                  </p>
                  <div className="max-h-56 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-left sticky top-0">
                        <tr>
                          <th className="px-3 py-2 w-16">Fila</th>
                          <th className="px-3 py-2">Estudiante</th>
                          <th className="px-3 py-2">Errores</th>
                        </tr>
                      </thead>
                      <tbody>
                        {preview.invalid.map((r) => (
                          <tr key={r.row} className="border-t align-top">
                            <td className="px-3 py-2">{r.row}</td>
                            <td className="px-3 py-2">
                              {r.name}
                              <span className="block text-xs text-gray-500">{r.dni}</span>
                            </td>
                            <td className="px-3 py-2 text-red-700">
                              {r.errors.map((e, i) => <div key={i}>• {e}</div>)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Paso 3: resultado del back */}
          {result && (
            <>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-2xl font-bold">{result.total}</p>
                  <p className="text-sm text-gray-600">Procesadas</p>
                </div>
                <div className="rounded-lg bg-green-50 text-green-800 p-4">
                  <p className="text-2xl font-bold">{result.created}</p>
                  <p className="text-sm">Importadas</p>
                </div>
                <div className="rounded-lg bg-red-50 text-red-800 p-4">
                  <p className="text-2xl font-bold">{result.skipped}</p>
                  <p className="text-sm">Omitidas</p>
                </div>
              </div>

              {result.errors?.length > 0 && (
                <div className="border rounded-lg max-h-56 overflow-y-auto">
                  <p className="bg-gray-50 px-3 py-2 text-sm font-medium">Filas omitidas</p>
                  <ul className="text-sm divide-y">
                    {result.errors.map((e, i) => (
                      <li key={i} className="px-3 py-2">
                        Fila {e.row} · DNI {e.dni}:{" "}
                        <span className="text-red-700">{e.message}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-5 justify-end items-center px-6 py-5">
          {preview ? (
            <>
              <Button
                type="button"
                variant="primary"
                text="Elegir otro archivo"
                onClick={reset}
                disabled={importing}
              />
              <Button
                type="button"
                variant="primary"
                text={importing ? "Importando..." : `Importar ${preview.valid.length} estudiantes`}
                onClick={handleImport}
                disabled={importing || preview.valid.length === 0}
              />
            </>
          ) : (
            <Button
              type="button"
              variant="primary"
              text={result ? "Finalizar" : "Cancelar"}
              onClick={closeModal}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export { ModalImportStudents };