// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { baseURL } from '../config';
// import Paginate from '../common/Paginate';

// const TestBasedResults = () => {
//     const [testNames, setTestNames] = useState([]);
//     const [selectedTestName, setSelectedTestName] = useState('');
//     const [studentResults, setStudentResults] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
    
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 5; // Number of results per page

//     useEffect(() => {
//         const fetchTestNames = async () => {
//             try {
//                 const response = await axios.get(`${baseURL}/api/paper-based-exams/getUniqueTestNames`);
                
//                 if (response.data && Array.isArray(response.data.uniqueTestNames)) {
//                     setTestNames(response.data.uniqueTestNames);
//                 } else {
//                     setTestNames([]);
//                 }
//             } catch (err) {
//                 setError('Failed to fetch test names.');
//             }
//         };
    
//         fetchTestNames();
//     }, []);
    
//     useEffect(() => {
//         const fetchStudentResults = async () => {
//             if (!selectedTestName) return;

//             setLoading(true);
//             setError(null);

//             try {
//                 const response = await axios.get(`${baseURL}/api/paper-based-exams/getStudentResultsByTestName/${selectedTestName}`);
//                 let results = response.data.results;
                
//                 // Sort the results by id in descending order
//                 results = results.sort((a, b) => b.id - a.id);

//                 setStudentResults(results);
//             } catch (err) {
//                 setError('Failed to fetch student results.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchStudentResults();
//     }, [selectedTestName]);

//     const handleTestNameChange = (e) => {
//         setSelectedTestName(e.target.value);
//         setCurrentPage(1); // Reset to first page when test changes
//     };

//     // Pagination logic
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentResults = studentResults.slice(indexOfFirstItem, indexOfLastItem);

//     return (
//         <div className="container mt-4">
//             <h2 className="text-center">Test-Based Student Results</h2>

//             {/* Dropdown to select test name */}
//             <div className="mb-4">
//                 <label htmlFor="testName" className="form-label">Select Test</label>
//                 <select
//                     id="testName"
//                     className="form-select"
//                     value={selectedTestName}
//                     onChange={handleTestNameChange}
//                 >
//                     <option value="">Select a Test</option>
//                     {testNames.map((test, index) => (
//                         <option key={index} value={test}>
//                             {test}
//                         </option>
//                     ))}
//                 </select>
//             </div>

//             {error && <div className="alert alert-danger">{error}</div>}
//             {loading && <div>Loading student results...</div>}

//             {currentResults.length > 0 && !loading && (
//                 <>
//                     <table className="table table-bordered table-striped">
//                         <thead>
//                             <tr>
//                                 <th>Student Name</th>
//                                 <th>Email</th>
//                                 <th>Subject</th>
//                                 <th>Topic</th>
//                                 <th>Obtained Marks</th>
//                                 <th>Total Marks</th>
//                                 <th>Percentage</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {currentResults.map((result, index) => {
//                                 const percentage = (result.obtainedMarks / result.totalMarks) * 100;
//                                 return (
//                                     <tr key={index}>
//                                         <td>{result.studentName}</td>
//                                         <td>{result.email}</td>
//                                         <td>{result.subjectName}</td>
//                                         <td>{result.topicName}</td>
//                                         <td>{result.obtainedMarks}</td>
//                                         <td>{result.totalMarks}</td>
//                                         <td>{percentage.toFixed(2)}%</td>
//                                     </tr>
//                                 );
//                             })}
//                         </tbody>
//                     </table>

//                     <Paginate
//                         currentPage={currentPage}
//                         totalItems={studentResults.length}
//                         itemsPerPage={itemsPerPage}
//                         onPageChange={setCurrentPage}
//                     />
//                 </>
//             )}

//             {studentResults.length === 0 && !loading && !error && selectedTestName && (
//                 <div>No results found for the selected test.</div>
//             )}
//         </div>
//     );
// };

// export default TestBasedResults;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../config';
import Paginate from '../common/Paginate';
import * as XLSX from 'xlsx'; // Import xlsx for downloading Excel

const TestBasedResults = () => {
    const [testNames, setTestNames] = useState([]);
    const [selectedTestName, setSelectedTestName] = useState('');
    const [studentResults, setStudentResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Number of results per page

    // Fetch available test names
    useEffect(() => {
        const fetchTestNames = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/paper-based-exams/getUniqueTestNames`);

                if (response.data && Array.isArray(response.data.uniqueTestNames)) {
                    setTestNames(response.data.uniqueTestNames);
                } else {
                    setTestNames([]);
                }
            } catch (err) {
                setError('Failed to fetch test names.');
            }
        };

        fetchTestNames();
    }, []);

    // Fetch student results based on selected test name
    useEffect(() => {
        const fetchStudentResults = async () => {
            if (!selectedTestName) return;

            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`${baseURL}/api/paper-based-exams/getStudentResultsByTestName/${selectedTestName}`);
                let results = response.data.results;

                // Sort the results by obtainedMarks in descending order
                results = results.sort((a, b) => b.obtainedMarks - a.obtainedMarks);

                setStudentResults(results);
            } catch (err) {
                setError('Failed to fetch student results.');
            } finally {
                setLoading(false);
            }
        };

        fetchStudentResults();
    }, [selectedTestName]);

    // Handle test name selection
    const handleTestNameChange = (e) => {
        setSelectedTestName(e.target.value);
        setCurrentPage(1); // Reset to first page when test changes
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentResults = studentResults.slice(indexOfFirstItem, indexOfLastItem);

    // Handle download of results as Excel file
    // const handleDownloadExcel = () => {
    //     const sortedResults = [...studentResults].sort((a, b) => b.obtainedMarks - a.obtainedMarks);

    //     const exportData = sortedResults.map(result => ({
    //         'Student Name': result.studentName,
    //         // 'Email': result.email,
    //         'Subject': result.subjectName,
    //         'Topic': result.topicName,
    //         'Obtained Marks': result.obtainedMarks,
    //         'Total Marks': result.totalMarks,
    //         'Percentage': ((result.obtainedMarks / result.totalMarks) * 100).toFixed(2) + '%'
    //     }));

    //     const ws = XLSX.utils.json_to_sheet(exportData);
    //     const wb = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, "Test Results");

    //     // Download the workbook as an Excel file
    //     XLSX.writeFile(wb, `${selectedTestName}_Test_Results.xlsx`);
    // };
   
    const handleDownloadExcel = () => {
        const sortedResults = [...studentResults].sort((a, b) => b.obtainedMarks - a.obtainedMarks);
    
        const exportData = sortedResults.map(result => ({
            'Student Name': result.studentName,
            'Obtained Marks': result.obtainedMarks,
            'Total Marks': result.totalMarks,
            'Percentage': ((result.obtainedMarks / result.totalMarks) * 100).toFixed(2) + '%'
        }));
    
        const ws = XLSX.utils.json_to_sheet([]);
    
        const subjectName = sortedResults[0]?.subjectName || 'Subject Name';
        const topicName = sortedResults[0]?.topicName || 'Topic Name';
        XLSX.utils.sheet_add_aoa(ws, [[`Subject: ${subjectName}`, `Topic: ${topicName}`]], { origin: 'A1' });
        
        
        XLSX.utils.sheet_add_json(ws, exportData, { origin: 'A2', skipHeader: false });
    
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Test Results");
    
        XLSX.writeFile(wb, `${selectedTestName}_Test_Results.xlsx`);
    };
    
    
    return (
        <div className="container mt-4">
            <h2 className="text-center">Test-Based Student Results</h2>

            {/* Dropdown to select test name */}
            <div className="mb-4">
                <label htmlFor="testName" className="form-label">Select Test</label>
                <select
                    id="testName"
                    className="form-select"
                    value={selectedTestName}
                    onChange={handleTestNameChange}
                >
                    <option value="">Select a Test</option>
                    {testNames.map((test, index) => (
                        <option key={index} value={test}>
                            {test}
                        </option>
                    ))}
                </select>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading && <div>Loading student results...</div>}

            {currentResults.length > 0 && !loading && (
                <>
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                {/* <th>Email</th> */}
                                <th>Subject</th>
                                <th>Topic</th>
                                <th>Obtained Marks</th>
                                <th>Total Marks</th>
                                <th>Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentResults.map((result, index) => {
                                const percentage = (result.obtainedMarks / result.totalMarks) * 100;
                                return (
                                    <tr key={index}>
                                        <td>{result.studentName}</td>
                                        {/* <td>{result.email}</td> */}
                                        <td>{result.subjectName}</td>
                                        <td>{result.topicName}</td>
                                        <td>{result.obtainedMarks}</td>
                                        <td>{result.totalMarks}</td>
                                        <td>{percentage.toFixed(2)}%</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* Button to download results as Excel */}
                    <button onClick={handleDownloadExcel} className="btn btn-primary mb-4">
                        Download Excel
                    </button>

                    <Paginate
                        currentPage={currentPage}
                        totalItems={studentResults.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}

            {studentResults.length === 0 && !loading && !error && selectedTestName && (
                <div>No results found for the selected test.</div>
            )}
        </div>
    );
};

export default TestBasedResults;
