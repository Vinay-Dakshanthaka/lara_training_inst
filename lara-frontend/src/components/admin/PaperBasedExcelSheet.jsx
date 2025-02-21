import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { toast } from 'react-toastify'; 
import PaperBasedExcelSheetImage from './Example_PaperBasedExcel_sheet.png';  
import PaperBasedExcel_Sheet from './Example_Paperbasedexcel_sheet.xlsx';  
import { baseURL } from '../config';
import { Modal, Button } from "react-bootstrap";  // Import necessary components

const PaperBasedExcelSheet = () => {
    const [file, setFile] = useState(null);
    const [conductedDate, setConductedDate] = useState("");
    const [skippedEmails, setSkippedEmails] = useState([]);
    const [showModal, setShowModal] = useState(false);  // State for showing modal

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file first!");
            return;
        }

        if (!conductedDate) {
            alert("Please select a conducted date!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("conducted_date", conductedDate);

        try {
            const response = await axios.post(`${baseURL}/api/paper-based-exams/uploadTestResults`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setSkippedEmails(response.data.skippedRecords);
            alert("File uploaded successfully!");

        } catch (error) {
            console.error("Error uploading file:", error.response);
            alert("Error uploading file!");
        }
    };

    const handleShowModal = () => setShowModal(true);
   
    const handleCloseModal = () => setShowModal(false);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = PaperBasedExcel_Sheet;
        link.download = 'example_PaperBasedExcel_Sheet.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Example Excel sheet downloaded successfully!");
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center">Upload Test Results (Excel)</h2>
            <div>           
            <Button variant="info" className="mt-2" onClick={handleShowModal}>
                Show Example Excel Sheet
            </Button>
            <Button variant="primary" className=" mt-2 ms-2" onClick={handleDownload}>
                Download Example Excel Sheet
            </Button>
            </div>
            <div className="mb-3">
                <label className="form-label">Conducted Date:</label>
                <input
                    type="date"
                    className="form-control"
                    value={conductedDate}
                    onChange={(e) => setConductedDate(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="form-control" />
            </div>

            <button onClick={handleUpload} className="btn btn-primary">Upload</button>

            {skippedEmails.length > 0 && (
                <div className="mt-4">
                    <h3>Skipped Emails</h3>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Email ID</th>
                                <th>Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            {skippedEmails.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.email || "N/A"}</td>
                                    <td>{item.reason}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal for showing example Excel sheet */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Example Excel Sheet Format</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <img src={PaperBasedExcelSheetImage} alt="Example Excel Sheet" className="img-fluid" />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PaperBasedExcelSheet;