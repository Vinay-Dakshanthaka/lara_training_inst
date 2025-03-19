import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { baseURL } from "../config";
import logoUrl from "./laralogo.png";
import qrCodeUrl from "./qr_code_whatsApp.png";
import QRCodeDisplay from "../student/QRCodeDisplay";

const SaveStudentForm = () => {
    const { placement_test_id } = useParams();
    const navigate = useNavigate();
    const timerRef = useRef(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone_number: "",
        university_name: "",
        college_name: "",
    });

    const [modalOpen, setModalOpen] = useState(true);
    const [savingStudent, setSavingStudent] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [placementTestStudentId, setPlacementTestStudentId] = useState(null);
    const [testDetails, setTestDetails] = useState(null);

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Save student details
    const handleSaveStudent = async (e) => {
        e.preventDefault();
        setSavingStudent(true);
        setSaveError(null);

        try {
            const studentData = {
                ...formData,
                placement_test_id: placement_test_id,
            };
            const response = await axios.post(`${baseURL}/api/placement-test/save-placement-test-student`, studentData);

            if (response.status === 200) {
                const student = response.data.existingStudent || response.data.newStudent;
                toast.success("Details saved successfully. Proceed to the test.");
                setPlacementTestStudentId(student.placement_test_student_id);
                setModalOpen(false);
                console.log("Student Data Placement test :", student)
                localStorage.setItem('placement_test_student_id',student.placement_test_student_id)
            } else {
                setSaveError("Failed to save student data. Please try again.");
            }
        } catch (error) {
            console.error("error saving student data :", error)
            if (error.response) {
                if (error.response.status === 403) {
                    alert("You have already completed this test.");
                    setSaveError("You have already completed this test.");
                    navigate("/not-found");
                }
            } else {
                console.error("Error saving student data:", error);
                setSaveError("Failed to save student data. Please try again.");
            }
        } finally {
            setSavingStudent(false);
        }
    };

    return (
        <>
            <Modal show={modalOpen} size="lg">
                <Modal.Header className="bg-warning d-flex align-items-center justify-content-center">
                    <div className="d-flex align-items-center w-100">
                        <img src={logoUrl} alt="Logo" className="img-fluid me-3" style={{ maxWidth: "100px" }} />
                        <div className="text-primary fs-5">
                            Please Fill the Form
                        </div>
                    </div>
                </Modal.Header>

                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6 d-flex flex-column align-items-center justify-content-center">
                                <p className="h6 text-center mb-3">
                                    Scan the QR code and join our WhatsApp channel for valuable knowledge and resources.
                                </p>
                                {testDetails ? (
                                    <QRCodeDisplay link={testDetails.whatsAppChannelLink} />
                                ) : (
                                    <img src={qrCodeUrl} alt="QR Code" className="img-fluid" style={{ maxWidth: "200px" }} />
                                )}
                            </div>

                            <div className="col-md-6 mt-4">
                                <Form onSubmit={handleSaveStudent}>
                                    <Form.Group controlId="name">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
                                    </Form.Group>
                                    <Form.Group controlId="email" className="mt-2">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                                    </Form.Group>
                                    <Form.Group controlId="phone_number" className="mt-2">
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
                                    </Form.Group>
                                    <Form.Group controlId="university_name" className="mt-2">
                                        <Form.Label>University Name</Form.Label>
                                        <Form.Control type="text" name="university_name" value={formData.university_name} onChange={handleChange} required />
                                    </Form.Group>
                                    <Form.Group controlId="college_name" className="mt-2">
                                        <Form.Label>College Name</Form.Label>
                                        <Form.Control type="text" name="college_name" value={formData.college_name} onChange={handleChange} required />
                                    </Form.Group>

                                    {saveError && <p className="text-danger mt-2">{saveError}</p>}
                                    <Button variant="primary" type="submit" disabled={savingStudent} className="mt-3 w-100">
                                        {savingStudent ? "Saving..." : "Submit"}
                                    </Button>
                                </Form>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default SaveStudentForm;
