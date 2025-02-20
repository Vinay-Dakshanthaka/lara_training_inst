import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, InputGroup, FormControl, Button } from 'react-bootstrap';
import { baseURL } from '../config';
import Paginate from '../common/Paginate';

const TransactionDetails = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [studentIds, setStudentIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/transaction/get`);
        const data = response.data.transactions;
        if (Array.isArray(data)) {
          setTransactions(data);
          setFilteredTransactions(data);
        } else {
          setTransactions([]);
          setFilteredTransactions([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transaction details:', error);
        setLoading(false);
      }
    };

    const fetchBatches = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${baseURL}/api/student/getAllBatches`, config);
        setBatches(response.data || []);
      } catch (error) {
        console.error('Error fetching batch details:', error);
      }
    };

    fetchTransactions();
    fetchBatches();
  }, []);

  useEffect(() => {
    const fetchStudentsByBatch = async () => {
      if (selectedBatch) {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;

          const config = { headers: { Authorization: `Bearer ${token}` } };
          const response = await axios.post(`${baseURL}/api/student/getStudentsByBatchId`, { batchId: selectedBatch }, config);
          const studentData = response.data;
          const studentIdsList = Array.isArray(studentData.students) ? studentData.students.map(student => student.id) : [];
          setStudentIds(studentIdsList);
        } catch (error) {
          console.error('Error fetching student details:', error);
        }
      }
    };
    fetchStudentsByBatch();
  }, [selectedBatch]);

  useEffect(() => {
    const filterTransactions = () => {
      if (selectedBatch && studentIds.length > 0) {
        setFilteredTransactions(transactions.filter(transaction => studentIds.includes(transaction.student_id)));
      } else {
        setFilteredTransactions(transactions);
      }
    };
    filterTransactions();
  }, [selectedBatch, studentIds, transactions]);

  const handleSearch = () => {
    setFilteredTransactions(transactions.filter(transaction => 
      transaction.transaction_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.Student?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    ));
  };

  const handleBatchChange = (e) => {
    setSelectedBatch(e.target.value);
    setCurrentPage(1);
  };

  const downloadImage = async (imageUrl, transactionId) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${transactionId}.jpeg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Transaction Details</h2>
      <InputGroup className="mb-4">
        <FormControl placeholder="Search by Transaction ID or Student Name" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <Button variant="primary" onClick={handleSearch}>Search</Button>
      </InputGroup>

      <div className="mb-3">
        <label>Select Batch:</label>
        <select className="form-select" value={selectedBatch} onChange={handleBatchChange}>
          <option value="">All Batches</option>
          {batches.map(batch => (
            <option key={batch.batch_id} value={batch.batch_id}>{batch.batch_name}</option>
          ))}
        </select>
      </div>

      {loading ? <div>Loading...</div> : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Transaction ID</th>
                <th>Student Name</th>
                <th>Transaction Details</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.slice((currentPage - 1) * transactionsPerPage, currentPage * transactionsPerPage).map((transaction, index) => (
                  <tr key={transaction.sno}>
                    <td>{(currentPage - 1) * transactionsPerPage + index + 1}</td>
                    <td>{transaction.transaction_id}</td>
                    <td>{transaction.Student.name}</td>
                    <td>
                      {transaction.transactionslip_img ? (
                        <a href={transaction.transactionslip_img} target="_blank" rel="noopener noreferrer" className="btn btn-link">
                          View Transaction Details
                        </a>
                      ) : 'No Image'}
                    </td>
                    <td>
                      {transaction.transactionslip_img ? (
                        <Button variant="secondary" onClick={() => downloadImage(transaction.transactionslip_img, transaction.transaction_id)}>
                          Download
                        </Button>
                      ) : 'No Image'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No transactions found</td>
                </tr>
              )}
            </tbody>
          </Table>

          <Paginate
            currentPage={currentPage}
            totalItems={filteredTransactions.length}
            itemsPerPage={transactionsPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default TransactionDetails;