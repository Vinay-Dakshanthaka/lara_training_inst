import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { baseURL } from '../config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const CollegeDetails = () => {
    const [collegeDetails, setCollegeDetails] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCollege, setSelectedCollege] = useState({});
    const [newCollege, setNewCollege] = useState({ college_name: '', place: '' });
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [collegeIdToDelete, setCollegeIdToDelete] = useState(null);
    const [studentsList, setStudentsList] = useState({})
    const navigate = useNavigate();

    useEffect(() => {
        fetchCollegeDetails();
    }, []);

    const fetchCollegeDetails = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            const response = await axios.get(`${baseURL}/api/student/getAllCollegeDetails`, config);

            setCollegeDetails(response.data);
        } catch (error) {
            console.error('Error fetching college details:', error);
        }
    };

    const handleAddModalClose = () => {
        setShowAddModal(false);
        setNewCollege({ college_name: '', place: '' });
    };

    const handleEditModalClose = () => {
        setShowEditModal(false);
    };

    const handleEditModalShow = (college) => {
        setSelectedCollege(college);
        setShowEditModal(true);
    };

    const handleAddCollege = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            const response = await axios.post(`${baseURL}/api/student/saveCollegeDetails`, newCollege, config);
            setCollegeDetails([...collegeDetails, response.data]);
            handleAddModalClose();
            toast.success("College Added Successfully")
        } catch (error) {
            console.error('Error adding college:', error);
            toast.error("Something went wrong")
        }
    };

    const handleEditCollege = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            await axios.post(`${baseURL}/api/student/updateCollegeDetails`, { ...selectedCollege, collegeId: selectedCollege.id }, config);
            fetchCollegeDetails();
            handleEditModalClose();

            toast.success("Updated Successfully")
        } catch (error) {
            console.error('Error editing college:', error);
            toast.error("Something went wrong")
        }
    };

    const handleDeleteCollege = async (collegeId) => {
        try {
            // Show confirmation modal before deleting
            setShowConfirmationModal(true);
            setCollegeIdToDelete(collegeId);
        } catch (error) {
            console.error('Error deleting college:', error);
            toast.error('Something went wrong');
        }
    };

    const handleConfirmDelete = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            await axios.post(`${baseURL}/api/student/deleteCollegeDetails`, { collegeId: collegeIdToDelete }, config);
            setCollegeDetails(collegeDetails.filter(college => college.id !== collegeIdToDelete));
            toast.success('Deleted Successfully');
            setShowConfirmationModal(false);
        } catch (error) {
            console.error('Error deleting college:', error);
            toast.error('Something went wrong');
            setShowConfirmationModal(false);
        }
    };

    const handleGetStudentsByCollegeId = async (collegeId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.post(`${baseURL}/api/student/getAllStudentsByCollegeId`, { collegeId }, config);
            setStudentsList(response.data);
            console.log("student list :", response.data)
        } catch (error) {
            console.error('Error fetching students by college ID:', error);
            toast.error('Something went wrong');
        }
    };


    return (
        <div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            <Button onClick={() => setShowAddModal(true)} className='m-2'>Add College</Button>
            <Button onClick={() => navigate('/assignStudentsToCollege')} className='m-2'>Upload Students</Button>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>College Name</th>
                        <th>Place</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {collegeDetails.map(college => (
                        <tr key={college.id}>
                            <td>{college.college_name}</td>
                            <td>{college.place}</td>
                            <td>
                                <Button onClick={() => handleEditModalShow(college)} className='btn-primary m-2'>Edit</Button>
                                <Button onClick={() => handleDeleteCollege(college.id)} className='btn-danger m-2'>Delete</Button>
                                <Button onClick={() => handleGetStudentsByCollegeId(college.id)} className='btn-secondary m-2'>Students List</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <hr />
            {studentsList.length > 0 ? (
                <table className="table table-striped m-3">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentsList.map(student => (
                            <tr key={student.id}>
                                <td>{student.name}</td>
                                <td>{student.email}</td>
                                <td>{student.phoneNumber}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
            ) : (
                <p>No students found for this college.</p>
            )}

            

            {/* Add College Modal */}
            <Modal show={showAddModal} onHide={handleAddModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add College</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="formCollegeName">
                        <Form.Label>College Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter college name" value={newCollege.college_name} onChange={(e) => setNewCollege({ ...newCollege, college_name: e.target.value })} />
                    </Form.Group>
                    <Form.Group controlId="formPlace">
                        <Form.Label>Place</Form.Label>
                        <Form.Control type="text" placeholder="Enter place" value={newCollege.place} onChange={(e) => setNewCollege({ ...newCollege, place: e.target.value })} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleAddModalClose}>Close</Button>
                    <Button variant="primary" onClick={handleAddCollege}>Add</Button>
                </Modal.Footer>
            </Modal>

            {/* Edit College Modal */}
            <Modal show={showEditModal} onHide={handleEditModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit College</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="formCollegeName">
                        <Form.Label>College Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter college name" value={selectedCollege.college_name} onChange={(e) => setSelectedCollege({ ...selectedCollege, college_name: e.target.value })} />
                    </Form.Group>
                    <Form.Group controlId="formPlace">
                        <Form.Label>Place</Form.Label>
                        <Form.Control type="text" placeholder="Enter place" value={selectedCollege.place} onChange={(e) => setSelectedCollege({ ...selectedCollege, place: e.target.value })} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleEditModalClose}>Close</Button>
                    <Button variant="primary" onClick={handleEditCollege}>Save Changes</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this college from Database?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CollegeDetails;
