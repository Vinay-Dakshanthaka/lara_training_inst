import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Spinner, Alert, Card, Container, Row, Col } from "react-bootstrap";
import { baseURL } from "../config";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import logoUrl from "./laralogo.png";
import qrCodeUrl from "./qr_code_whatsApp.png";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PlacementTestStudentResults = ({ email }) => {
  const [studentData, setStudentData] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testDetails, setTestDetails] = useState({});
  const [pdfUrl, setPdfUrl] = useState(null);
  const [sendingEmail, setSendingEmail] = useState({}); // Use an object to track loading for each button

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/placement-test/getPlacementTestResultsByEmail/${email}`);
        const { student, testResults } = response.data;
        setStudentData(student);
        setTestResults(testResults);
        setTestDetails(testResults[0]?.PlacementTest || {}); // Set first test details
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred while fetching data.");
        setLoading(false);
      }
    };

    fetchResults();
  }, [email]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  const sendPdfToEmail = async (pdfBlob, formData) => {
    const { student_name, email } = formData;
    if (!formData.student_name || !formData.email) {
      alert("Name and email are required.");
      return;
    }

    const formPayload = new FormData();
    formPayload.append("pdf", pdfBlob, `${formData.student_name}_Certificate.pdf`);
    formPayload.append("email", formData.email);
    formPayload.append("name", formData.student_name);

    try {
      setSendingEmail(prevState => ({ ...prevState, [formData.testIndex]: true })); // Set loading state for this test
      const response = await axios.post(
        `${baseURL}/api/placement-test/send-certificate-to-email`,
        formPayload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setSendingEmail(prevState => ({ ...prevState, [formData.testIndex]: false })); // Reset loading state after completion
      if (response.status === 200) {
        toast.success("The certificate has been sent to your registered email");
      }
    } catch (error) {
      setSendingEmail(prevState => ({ ...prevState, [formData.testIndex]: false })); // Reset loading state after failure
      console.error("Error:", error.response?.data || error.message);
      toast.warning("Sorry!! We are unable to send the certificate to your email!");
    }
  };

  const generateCertificate = (formData, testResults, index, result) => {
    const doc = new jsPDF("landscape");
    const presentDate = new Date().toLocaleString();
    const imgWidth = 40;
    const imgHeight = 40;

    if (!formData || !formData.student_name) {
      alert("Missing required data. Please ensure all fields are filled.");
      return;
    }

    doc.setFillColor(76, 149, 228);
    doc.rect(0, 0, 297, 210, "F");
    doc.setFillColor(255, 173, 63);
    doc.circle(297, 105, 150, "F");

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

        const certificateName = testResults[index].PlacementTest.certificate_name || "Logical Reasoning";
        doc.text(`in ${certificateName}`, centerX, 70, null, null, "center");

        doc.setFont("times", "italic");
        doc.setFontSize(26);
        doc.setTextColor(255);
        doc.text("This certificate is hereby bestowed upon", centerX, 80, null, null, "center");

        doc.setFont("times", "bold");
        doc.setFontSize(28);
        doc.setTextColor(0, 0, 0);
        doc.text(formData.student_name, centerX, 95, null, null, "center");

        doc.setFont("times", "normal");
        doc.setFontSize(16);
        doc.text(`Marks Obtained: ${result.marks_obtained} out of ${result.total_marks}`, 148.5, 105, null, null, "center");

        doc.setFont("times", "normal");
        doc.setFontSize(14);
        doc.setTextColor(40, 40, 40);
        doc.text("For successfully completing the Test conducted by Lara Technologies.", centerX, 112, null, null, "center");

        const tableStartY = 125;
        const columnSpacing = 70;
        const rowSpacing = 8;
        const tableData = [
          { label: "Email:", value: formData.email },
          { label: "College Name:", value: formData.college_name },
          { label: "University Name:", value: formData.university_name },
        ];

        doc.setFontSize(14);
        doc.setFont("times", "bold");
        tableData.forEach((row, index) => {
          let yPos = tableStartY + index * rowSpacing;
          if (yPos > 180) {
            doc.addPage();
            yPos = 20;
          }
          doc.setTextColor(40, 40, 40);
          doc.text(row.label, 80, yPos);
          const wrappedValue = doc.splitTextToSize(row.value || "N/A", 100);
          doc.text(wrappedValue, 80 + columnSpacing, yPos);
        });

        doc.setFont("times", "italic");
        doc.setFontSize(10);
        doc.setTextColor(200, 200, 200);
        doc.text("Certificate generated on " + presentDate, centerX, 190, null, null, "center");

        const qrCodeX = 10;
        const qrCodeY = 150;
        const qrCodeWidth = 40;
        const qrCodeHeight = 40;
        doc.addImage(qrCodeImage, "PNG", qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight);

        doc.setFont("times", "italic");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Join our whatsApp channel for more updates", qrCodeX + 0, qrCodeY + 45);

        const pdfBlob = doc.output("blob");
        const pdfObjectUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(pdfObjectUrl);
        sendPdfToEmail(pdfBlob, { ...formData, testIndex: index });
      })
      .catch((err) => {
        console.error(err.message);
        alert("Unable to load the logo or QR code. Please check the URLs.");
      });
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={6} className="mx-auto">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="text-center mb-3">Student Details</Card.Title>
              <p>
                <strong>Name:</strong> {studentData.student_name}
              </p>
              <p>
                <strong>Email:</strong> {studentData.email}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <h4 className="text-center mb-4">Test Results</h4>
          {testResults.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Test Title</th>
                  <th>Certificate</th>
                  <th>Total Marks</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {testResults.map((result, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{result.PlacementTest.test_title}</td>
                    <td>
                      <button onClick={() => generateCertificate(studentData, testResults, index, result)} className="btn btn-primary">
                        {sendingEmail[index] ? (
                         <> <Spinner animation="border" size="sm" /> Sending..... </>
                        ) : (
                          "Send Certificate To Email"
                        )}
                      </button>
                    </td>
                    <td>{result.total_marks}</td>
                    <td>{new Date(result.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Alert variant="info" className="text-center">
              No test results available.
            </Alert>
          )}
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
};

export default PlacementTestStudentResults;
