import React, { useState, useEffect } from "react";
import { Table, Form, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import { baseURL } from "../config";

const RecruitersTable = ({ selectedRecruiters, setSelectedRecruiters }) => {
  const [recruiters, setRecruiters] = useState([]);
  const [filteredRecruiters, setFilteredRecruiters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch recruiters and their WhatsApp channel links
  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseURL}/api/placement-test/getAllStudentsWithWhatsAppChannelLinks`);
        setRecruiters(response.data.students || []);
        setFilteredRecruiters(response.data.students || []); // Initialize filtered list
      } catch (error) {
        console.error("Error fetching recruiters:", error.message);
        setErrorMessage("Failed to fetch recruiters");
      } finally {
        setLoading(false);
      }
    };
    fetchRecruiters();
  }, []);

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = recruiters.filter(
      (recruiter) =>
        recruiter.name.toLowerCase().includes(value) ||
        recruiter.email.toLowerCase().includes(value) ||
        recruiter.phoneNumber.toLowerCase().includes(value)
    );
    setFilteredRecruiters(filtered);
  };

  // Handle checkbox toggle for selecting recruiters
  const handleRecruiterSelection = (recruiterId) => {
    setSelectedRecruiters((prev) =>
      prev.includes(recruiterId)
        ? prev.filter((id) => id !== recruiterId)
        : [...prev, recruiterId]
    );
  };

  return (
    <div>
      <h5>Select Recruiters to Assign</h5>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Form.Group controlId="search" className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by name, email, or phone number"
          value={searchTerm}
          onChange={handleSearch}
        />
      </Form.Group>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Select</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Assigned Channels</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecruiters.length > 0 ? (
              filteredRecruiters.map((recruiter) => (
                <tr key={recruiter.id}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedRecruiters.includes(recruiter.id)}
                      onChange={() => handleRecruiterSelection(recruiter.id)}
                    />
                  </td>
                  <td>{recruiter.name}</td>
                  <td>{recruiter.email}</td>
                  <td>{recruiter.phoneNumber}</td>
                  <td>
                    {recruiter.WhatsAppChannelLinks && recruiter.WhatsAppChannelLinks.length > 0 ? (
                      recruiter.WhatsAppChannelLinks.map((link) => (
                        <div key={link.channel_id}>
                          <strong>{link.channel_name}:</strong>{" "}
                          <a href={link.link} target="_blank" rel="noopener noreferrer">
                            {link.link}
                          </a>
                        </div>
                      ))
                    ) : (
                      <span>No channels assigned</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No recruiters found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default RecruitersTable;
