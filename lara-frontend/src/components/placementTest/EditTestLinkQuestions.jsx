import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Badge } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { baseURL } from '../config';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify'; // Importing toast
import { BsExclamation } from 'react-icons/bs';

const EditTestLinkQuestions = () => {
    const [questionsWithOptions, setQuestionsWithOptions] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [formData, setFormData] = useState({ question_description: '', options: [], correct_answers: [] });
    const { test_id } = useParams();
    const [placementTestDetails, setPlacementTestDetails] = useState();

    useEffect(() => {
        const fetchPlacementTestDetails = async () => {
            try {
                const response = await axios.post(
                    `${baseURL}/api/placement-test/getPlacementTestById`,
                    { placement_test_id: test_id },
                );
                setPlacementTestDetails(response.data);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    toast.info('No Test details found');
                } else {
                    toast.error('Something went wrong');
                }
            }
        };

        fetchPlacementTestDetails(); // Call the function inside useEffect
    }, [test_id]); 

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.post(`${baseURL}/api/cumulative-test/fetchQuestionsByTestId`, {
                    placement_test_id: test_id
                });

                const formattedQuestions = response.data.map(question => ({
                    ...question,
                    options: question.QuestionOptions.map(opt => ({
                        option_id: opt.option_id,
                        option_description: opt.option_description
                    })),
                    correct_answers: question.CorrectAnswers.map(ans => ans.answer_description)
                }));

                setQuestionsWithOptions(formattedQuestions);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestions();

    }, [test_id]);

    const handleEdit = (question) => {
        setSelectedQuestion(question);
        setFormData({
            question_description: question.question_description,
            options: question.options,
            correct_answers: question.correct_answers
        });
        setShowEditModal(true);
    };

    const handleDelete = async (questionId) => {
        try {
            await axios.delete(`${baseURL}/api/cumulative-test/deleteQuestionById/${questionId}`);
            setQuestionsWithOptions(questionsWithOptions.filter(q => q.cumulative_question_id !== questionId));
            toast.success("Question deleted successfully"); // Success message
        } catch (error) {
            console.error("Error deleting question:", error);
            toast.error("Error deleting question"); // Error message
        }
    };

    const handleAddOption = () => {
        setFormData(prevData => ({
            ...prevData,
            options: [...prevData.options, { option_id: Date.now(), option_description: '' }]
        }));
    };

    const handleChange = (e, index) => {
        const { name, value, checked } = e.target;
        if (name === 'question_description') {
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        } else if (name === 'option_description') {
            setFormData(prevData => {
                const newOptions = [...prevData.options];
                newOptions[index].option_description = value;
                return { ...prevData, options: newOptions };
            });
        } else if (name === 'correct_answers') {
            setFormData(prevData => ({
                ...prevData,
                correct_answers: checked
                    ? [...prevData.correct_answers, value]
                    : prevData.correct_answers.filter(answer => answer !== value)
            }));
        }
    };

    const handleUpdate = async () => {
        try {
            // Filter out empty options before sending to backend
            const nonEmptyOptions = formData.options.filter(option => option.option_description.trim() !== '');

            await axios.post(`${baseURL}/api/cumulative-test/updateQuestionById`, {
                ...selectedQuestion,
                ...formData,
                options: nonEmptyOptions // Send only non-empty options
            });

            // Update the local state
            setQuestionsWithOptions(questionsWithOptions.map(q =>
                q.cumulative_question_id === selectedQuestion.cumulative_question_id
                    ? { ...q, ...formData, options: nonEmptyOptions }
                    : q
            ));
            setShowEditModal(false);
            toast.success("Question updated successfully"); // Success message
        } catch (error) {
            console.error("Error updating question:", error);
            toast.error("Error updating question"); // Error message
        }
    };

    return (
        <div className="container mt-5">
            <ToastContainer />
            <div className="container">
                {placementTestDetails && (
                    <div className="mb-3 row">
                        <div className="my-3 col-5">
                            <h5>Test Link: <a href={placementTestDetails.test_link} target="_blank" rel="noopener noreferrer">{placementTestDetails.test_link}</a></h5>
                        </div>
                        <Link to={`/add-new-questions/${placementTestDetails.placement_test_id}`} className='col-5'>
                            <span className='btn btn-outline-primary'>Add New Questions for this test link</span>
                        </Link>
                    </div>
                )}
            </div>
            <h3>Edit Test Link Questions</h3>
            <Table bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Question</th>
                        <th>Options</th>
                        <th>Correct Answers</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {questionsWithOptions.map((question, index) => {
                        const optionDescriptions = question.options.map(opt => opt.option_description);
                        const hasMismatch = question.correct_answers.some(correct => !optionDescriptions.includes(correct));

                        return (
                            <tr key={question.cumulative_question_id} className={hasMismatch ? 'bg-danger text-white' : ''}>
                                <td>{index + 1}</td>
                                <td>
                                    {question.question_description}
                                    {hasMismatch && (
                                        <>
                                            <Badge bg="warning" text="dark" className="ml-2 my-2 ">
                                                Available options and correct options are not matching delete this question and add it again 
                                            </Badge>
                                            <BsExclamation className='bg-danger fs-1 rounded' />
                                        </>
                                    )}
                                </td>
                                <td>
                                    {question.options.map((option, idx) => (
                                        <div key={idx}>
                                            {option.option_description}
                                        </div>
                                    ))}
                                </td>
                                <td>
                                    {question.correct_answers.join(', ')}
                                </td>
                                <td>
                                    <Button variant="primary" onClick={() => handleEdit(question)} className='mx-2 fs-5 my-1'><FaEdit /></Button>
                                    <Button variant="danger" onClick={() => handleDelete(question.cumulative_question_id)} className='mx-2 fs-5 my-1'><FaTrash /></Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>

            {/* Edit Question Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Question</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="question_description">
                            <Form.Label>Question Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="question_description"
                                value={formData.question_description}
                                onChange={e => handleChange(e)}
                            />
                        </Form.Group>
                        <Form.Group controlId="options">
                            <Form.Label>Options</Form.Label>
                            {formData.options.map((option, index) => (
                                <div key={option.option_id} className="d-flex mb-2">
                                    <Form.Control
                                        type="text"
                                        name="option_description"
                                        value={option.option_description}
                                        onChange={e => handleChange(e, index)}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Correct Answer"
                                        name="correct_answers"
                                        value={option.option_description}
                                        checked={formData.correct_answers.includes(option.option_description)}
                                        onChange={e => handleChange(e)}
                                    />
                                </div>
                            ))}
                            <Button variant="secondary" onClick={handleAddOption}>Add Option</Button>
                        </Form.Group>
                        <Button variant="primary" onClick={handleUpdate}>Update Question</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default EditTestLinkQuestions;
