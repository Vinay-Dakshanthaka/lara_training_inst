// import React, { useState } from "react";
// import axios from "axios";
// import  * as XLSX from "xlsx";
// import { baseURL } from '../config';

// const PaperBasedExcelSheet = () => {
//     const [file, setFile] = useState(null);
//     const [skippedEmails, setSkippedEmails] = useState([]);

//     const handleFileChange = (event) => {
//         setFile(event.target.files[0]);
//     };

//     const handleUpload = async () => {
//         if (!file) {
//             alert("Please select a file first!");
//             return;
//         }
    
//         const formData = new FormData();
//         formData.append("file", file);
//         console.log("Uploading file:", file);  // ✅ Debug file
//         console.log("FormData content:", formData);  // ✅ Debug FormData
    
//         try {
//             const response = await axios.post(`${baseURL}/api/paper-based-exams/uploadTestResults`, formData, {
//                 headers: { "Content-Type": "multipart/form-data" }
//             });
    
//             setSkippedEmails(response.data.skippedRecords);
//             console.log(response.data.skippedRecords,"--------------------------skipede")
//             alert("File uploaded successfully!");
    
//         } catch (error) {
//             console.error("Error uploading file:", error.response);
//             alert("Error uploading file!");
//         }
//     };
    
//     return (
//         <div className="container mt-4">
//             <h2 className="text-center">Upload Test Results (Excel)</h2>
//             <div className="mb-3">
//                 <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="form-control" />
//             </div>
//             <button onClick={handleUpload} className="btn btn-primary">Upload</button>

//             {skippedEmails.length > 0 && (
//                 <div className="mt-4">
//                     <h3>Skipped Emails</h3>
//                     <table className="table table-bordered">
//                         <thead>
//                             <tr>
//                                 <th>Email ID</th>
//                                 <th>Reason</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {skippedEmails.map((item, index) => (
//                                 <tr key={index}>
//                                     <td>{item.email || "N/A"}</td>
//                                     <td>{item.reason}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PaperBasedExcelSheet;
import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { baseURL } from '../config';

const PaperBasedExcelSheet = () => {
    const [file, setFile] = useState(null);
    const [conductedDate, setConductedDate] = useState("");
    const [skippedEmails, setSkippedEmails] = useState([]);

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

    return (
        <div className="container mt-4">
            <h2 className="text-center">Upload Test Results (Excel)</h2>

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
        </div>
    );
};

export default PaperBasedExcelSheet;

