import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "../config"; // Your backend URL config

const StudentExamResults = () => {
    const [examResults, setExamResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    
    const dateCount = {};
    examResults.forEach((result) => {
        const formattedDate = new Date(result.conducted_date).toLocaleDateString("en-GB");
        dateCount[formattedDate] = (dateCount[formattedDate] || 0) + 1;
    });

    let dateTracker = {}; 

    return (
        <div className="container mt-4">
            <h2 className="text-center">Paper Based Exam Results</h2>

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
                        {examResults.map((result, index) => {
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
        </div>
    );
};

export default StudentExamResults;
