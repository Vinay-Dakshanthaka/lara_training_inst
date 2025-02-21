import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../config";
import Paginate from "../common/Paginate";

const TestResults = () => {
  const { id } = useParams(); // Get student ID from URL
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;


  useEffect(() => {
    const fetchResults = async () => {
      try {
       
        const response = await axios.get(
          `${baseURL}/api/paper-based-exams/getStudentIDExamResults/${id}`
        );
        setResults(response.data.results || []);
        
      } catch (error) {
        console.error("Error fetching test results:", error);
      }
    };

    fetchResults();
  }, [id]);

  // Pagination logic
  const totalItems = results.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResults = results.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container">
      <h2>Test Results</h2>
      <table className="table table-striped table-bordered">
  <thead className="thead-dark">
    <tr>
      <th>#</th>
      <th>Email</th>
      <th>Obtained Marks</th>
      <th>Total Marks</th>
      <th>Percentage</th> {/* New column for percentage */}
      <th>Test Name</th>
      <th>Conducted Date</th>
    </tr>
  </thead>
  <tbody>
    {currentResults.length > 0 ? (
      currentResults.map((result, index) => {
        const percentage = result.totalMarks > 0 ? ((result.obtainedMarks / result.totalMarks) * 100).toFixed(2) : "0.00";
        return (
          <tr key={result.id}>
            <td>{indexOfFirstItem + index + 1}</td>
            <td>{result.email}</td>
            <td>{result.obtainedMarks}</td>
            <td>{result.totalMarks}</td>
            <td>{percentage}%</td>
            <td>{result.testName}</td>
            <td>{new Date(result.conducted_date).toLocaleDateString()}</td>
          </tr>
        );
      })
    ) : (
      <tr>
        <td colSpan="8" className="text-center">
          No test results available
        </td>
      </tr>
    )}
  </tbody>
</table>


      {/* Pagination Component */}
      <Paginate
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default TestResults;
