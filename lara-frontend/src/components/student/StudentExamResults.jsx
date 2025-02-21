import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "../config"; // Your backend URL config
import Paginate from "../common/Paginate";  // Assuming Paginate component is in this path

const StudentExamResults = () => {
    const [examResults, setExamResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [resultsPerPage] = useState(5);  // Number of results per page

    useEffect(() => {
        const fetchExamResults = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const response = await axios.get(`${baseURL}/api/paper-based-exams/exam-results`, config);
                setExamResults(response.data.results);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch exam results.");
                setLoading(false);
            }
        };

        fetchExamResults();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    // Pagination Logic
    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentResults = examResults.slice(indexOfFirstResult, indexOfLastResult);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const dateCount = {};
    currentResults.forEach((result) => {
        const formattedDate = new Date(result.conducted_date).toLocaleDateString("en-GB");
        dateCount[formattedDate] = (dateCount[formattedDate] || 0) + 1;
    });

    let dateTracker = {};

    // Calculate total and obtained marks for performance
    const totalMarks = examResults.reduce((total, result) => total + result.totalMarks, 0);
    const obtainedMarks = examResults.reduce((total, result) => total + result.obtainedMarks, 0);
    const performancePercentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;

    return (
        <div className="container mt-4">
            <h2 className="text-center">Paper Based Exam Results</h2>

            {/* Overall Performance Section */}
            <div className="overall-performance mt-4 text-center">
                <h4>Overall Performance</h4>
                <div className="progress">
                    <div
                        className="progress-bar bg-warning"
                        role="progressbar"
                        style={{ width: `${performancePercentage}%` }}
                        aria-valuenow={performancePercentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                    ></div>
                </div>
                <p>Performance: {performancePercentage.toFixed(2)}%</p>
            </div>

            {/* Simple Pie Chart for Marks Distribution using Bootstrap */}
            {/* <div className="pie-chart mt-4 text-center">
                <h4>Marks Distribution</h4>
                <div
                    className="rounded-circle"
                    style={{
                        width: "150px",
                        height: "150px",
                        background: `conic-gradient(#4caf50 ${performancePercentage}%, #ccc ${performancePercentage}% 100%)`,
                        margin: "20px auto",
                    }}
                ></div>
                <p>{obtainedMarks}/{totalMarks} Obtained</p>
            </div> */}

            {/* Exam Results Table */}
            {examResults.length === 0 ? (
                <div>No exam results found.</div>
            ) : (
                <table className="table table-bordered responsive">
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Topic</th>
                            <th>Obtained Marks</th>
                            <th>Total Marks</th>
                            <th>Conducted Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentResults.map((result, index) => {
                            const formattedDate = new Date(result.conducted_date).toLocaleDateString("en-GB");

                            const rowSpanValue = dateTracker[formattedDate] ? 0 : dateCount[formattedDate];
                            dateTracker[formattedDate] = true; // Mark date as displayed

                            return (
                                <tr key={result.id}>
                                    <td>{result.subjectName}</td>
                                    <td>{result.topicName}</td>
                                    <td>{result.obtainedMarks}</td>
                                    <td>{result.totalMarks}</td>

                                    {rowSpanValue > 0 ? (
                                        <td rowSpan={rowSpanValue} className="text-center align-middle">
                                            {formattedDate}
                                        </td>
                                    ) : null}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}

            {/* Pagination */}
            <div className="d-flex justify-content-center">
                <Paginate
                    currentPage={currentPage}
                    totalItems={examResults.length}
                    itemsPerPage={resultsPerPage}
                    onPageChange={paginate}
                />
            </div>
        </div>
    );
};

export default StudentExamResults;
