import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { baseURL } from "../config";

const UpdatePlacementTestModal = ({ placement_test_id, show, handleClose }) => {
    const [formData, setFormData] = useState({
        number_of_questions: "",
        description: "",
        start_time: "",
        end_time: "",
        show_result: true,
        is_Monitored: false,
        topic_ids: [],
        channel_link: "",
        test_title: "",
        certificate_name: "",
    });

    console.log("Received placment test id in update modal : ", placement_test_id)

    const [topics, setTopics] = useState([]);

    // Fetch existing test details when modal is shown
    useEffect(() => {
        if (placement_test_id && show) {
            fetchTestDetails();
        }
    }, [placement_test_id, show]);

    const fetchTestDetails = async () => {
        try {
            const response = await axios.get(
                `${baseURL}/api/placement-test/getPlacementTestDetailsById/${placement_test_id}`
            );
            const data = response.data.data;

            setFormData({
                number_of_questions: data.number_of_questions,
                description: data.description,
                start_time: data.start_time,
                end_time: data.end_time,
                show_result: data.show_result,
                is_Monitored: data.is_Monitored,
                topic_ids: Array.isArray(data.topics) ? data.topics.map((topic) => topic.topic_id) : [],
                channel_link: data.whatsAppChannelLink,
                test_title: data.test_title,
                certificate_name: data.certificate_name,
            });

            setTopics(Array.isArray(data.topics) ? data.topics : []); // Ensure topics is always an array
        } catch (error) {
            toast.error("Failed to fetch test details");
            console.error("Error fetching test details:", error);
        }
    };

    // Handle form submission to update the placement test
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token provided.");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            await axios.put(
                `${baseURL}/api/placement-test/updatePlacementTest/${placement_test_id}`,
                formData,
                config
            );
            toast.success("Placement test updated successfully!");
            handleClose(); // Close the modal after successful update
        } catch (error) {
            toast.error("Failed to update placement test");
            console.error("Error updating placement test:", error);
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Update Placement Test</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {/* Test Title */}
                    <Form.Group controlId="testTitle">
                        <Form.Label>Test Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="test_title"
                            value={formData.test_title}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    {/* Description */}
                    <Form.Group controlId="description" className="mt-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                        />
                    </Form.Group>

                    {/* Number of Questions */}
                    <Form.Group controlId="numberOfQuestions" className="mt-3">
                        <Form.Label>Number of Questions</Form.Label>
                        <Form.Control
                            type="number"
                            name="number_of_questions"
                            value={formData.number_of_questions}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    {/* Start Time */}
                    <Form.Group controlId="startTime" className="mt-3">
                        <Form.Label>Start Time</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="start_time"
                            value={formData.start_time}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    {/* End Time */}
                    <Form.Group controlId="endTime" className="mt-3">
                        <Form.Label>End Time</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="end_time"
                            value={formData.end_time}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    {/* WhatsApp Channel Link */}
                    <Form.Group controlId="channelLink" className="mt-3">
                        <Form.Label>WhatsApp Channel Link</Form.Label>
                        <Form.Control
                            type="text"
                            name="channel_link"
                            value={formData.channel_link}
                            onChange={handleChange}
                            disabled
                        />
                    </Form.Group>

                    {/* Certificate Name */}
                    <Form.Group controlId="certificateName" className="mt-3">
                        <Form.Label>Certificate Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="certificate_name"
                            value={formData.certificate_name}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {/* Show Result Checkbox */}
                    <Form.Group controlId="showResult" className="mt-3">
                        <Form.Check
                            type="checkbox"
                            label="Show Result"
                            name="show_result"
                            checked={formData.show_result}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {/* Monitored Test Checkbox */}
                    <Form.Group controlId="isMonitored" className="mt-3">
                        <Form.Check
                            type="checkbox"
                            label="Monitored Test"
                            name="is_Monitored"
                            checked={formData.is_Monitored}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {/* Submit Button */}
                    <Button variant="primary" type="submit" className="mt-4 w-100">
                        Update Test
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default UpdatePlacementTestModal;
