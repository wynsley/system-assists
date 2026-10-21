import QRCode from "qrcode";
import { jsPDF } from "jspdf";

const QR_OPTIONS = { width: 600, margin: 2, errorCorrectionLevel: "M" };

// Quita caracteres no permitidos en nombres de archivo (\ / : * ? " < > |)
const safeName = (text) =>
  String(text ?? "").replace(/[\\/:*?"<>|]/g, "").trim();

const fileName = (student) =>
  `QR de ${safeName(student.firstname) || student.dni}`;

const downloadQrPng = async (student) => {
  const dni = String(student.dni);
  const dataUrl = await QRCode.toDataURL(dni, QR_OPTIONS);
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = `${fileName(student)}.png`;
  a.click();
};

const downloadQrPdf = async (student) => {
  const dni = String(student.dni);
  const dataUrl = await QRCode.toDataURL(dni, QR_OPTIONS);
  const doc = new jsPDF({ unit: "mm", format: "a6" });
  const w = doc.internal.pageSize.getWidth();

  doc.setFontSize(14);
  doc.text(`${student.firstname} ${student.lastname}`, w / 2, 20, { align: "center" });
  doc.addImage(dataUrl, "PNG", (w - 70) / 2, 30, 70, 70);
  doc.setFontSize(12);
  doc.text(`DNI: ${dni}`, w / 2, 110, { align: "center" });
  doc.save(`${fileName(student)}.pdf`);
};

export { downloadQrPng, downloadQrPdf };