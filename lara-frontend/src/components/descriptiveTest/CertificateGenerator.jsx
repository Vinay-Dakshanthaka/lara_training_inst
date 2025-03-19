import React, { useState } from "react";
import { jsPDF } from "jspdf";

const CertificateGenerator = ({
  studentDetails,
  testDetails,
  marksForCertificate,
  totalMarks,
  logoUrl,
  qrCodeUrl,
}) => {
  const [pdfUrl, setPdfUrl] = useState(null);

  const generateCertificate = () => {
    const doc = new jsPDF("landscape");
    const presentDate = new Date().toLocaleString();
    const imgWidth = 40;
    const imgHeight = 40;

    // Check if studentDetails exists
    if (!studentDetails) {
      alert("Missing required data. Please ensure all fields are filled.");
      return;
    }

    // Create background for the certificate
    doc.setFillColor(76, 149, 228);
    doc.rect(0, 0, 297, 210, "F");
    doc.setFillColor(255, 173, 63);
    doc.circle(297, 105, 150, "F");

    // Load logo and QR code images
    const loadImage = new Promise((resolve, reject) => {
      const image = new Image();
      image.src = logoUrl;
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Failed to load logo image."));
    });

    const loadQRCode = new Promise((resolve, reject) => {
      const qrCode = new Image();
      qrCode.src = qrCodeUrl;
      qrCode.onload = () => resolve(qrCode);
      qrCode.onerror = () => reject(new Error("Failed to load QR code image."));
    });

    Promise.all([loadImage, loadQRCode])
      .then(([logoImage, qrCodeImage]) => {
        doc.addImage(logoImage, "PNG", 20, 15, imgWidth, imgHeight);
        const pageWidth = doc.internal.pageSize.getWidth();
        const centerX = pageWidth / 2;

        // Add the text for the certificate
        doc.setFont("times", "bold");
        doc.setFontSize(28);
        doc.setTextColor(255);
        doc.text("LARA TECHNOLOGIES", 80, 25);
        doc.setFont("times", "normal");
        doc.setFontSize(12);
        doc.setTextColor(40, 40, 40);
        doc.text("8, 100 Feet Ring Road, 2nd Stage, BTM Layout, Bengaluru, Karnataka 560076", 80, 32);
        doc.text("+91 79759 38871 | ramesh@lara.co.in", 80, 39);

        doc.setFont("times", "bold");
        doc.setFontSize(28);
        doc.setTextColor(255);
        doc.text("CERTIFICATE OF RECOGNITION", centerX, 60, null, null, "center");

        doc.setFont("times", "italic");
        doc.setFontSize(18);
        doc.setTextColor(255);
        const certificateName = testDetails.test_title || "Core Java";
        doc.text(`in ${certificateName}`, centerX, 70, null, null, "center");

        doc.setFont("times", "italic");
        doc.setFontSize(26);
        doc.setTextColor(255);
        doc.text("This certificate is hereby bestowed upon", centerX, 80, null, null, "center");
        doc.setFont("times", "bold");
        doc.setFontSize(28);
        doc.setTextColor(0, 0, 0);
        doc.text(studentDetails.student_name, centerX, 95, null, null, "center");

        doc.setFont("times", "normal");
        doc.setFontSize(16);
        doc.text(`Marks Obtained: ${marksForCertificate} out of ${totalMarks}`, centerX, 105, null, null, "center");

        doc.setFont("times", "normal");
        doc.setFontSize(14);
        doc.setTextColor(40, 40, 40);
        doc.text("For successfully completing the Test conducted by Lara Technologies.", centerX, 112, null, null, "center");

        doc.addImage(qrCodeImage, "PNG", 10, 150, 40, 40);
        doc.setFont("times", "italic");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Join our WhatsApp channel for more updates", 10, 195);

        // Generate and save the PDF
        const pdfBlob = doc.output("blob");
        const pdfObjectUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(pdfObjectUrl);
        doc.save(`${studentDetails.student_name}_Lara_Technologies_Certificate.pdf`);
      })
      .catch((err) => {
        console.error(err.message);
        alert("Unable to load the logo or QR code. Please check the URLs.");
      });
  };

  return (
    <button onClick={generateCertificate} className="btn btn-success">
      Download Certificate
    </button>
  );
};

export default CertificateGenerator;
