import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseURL } from '../config';
import BackButton from '../BackButton';
import WeeklyTestDetails from '../weeklyTest/WeeklyTestDetails';
import DescriptiveTestData from './DescriptiveTestData';


const AnswerUpdateFormDescriptiveQuestions = () => {
    const { placement_test_id } = useParams(); // Get placement_test_id from URL
    const [questions, setQuestions] = useState([]);
    const [totalMarks, setTotalMarks] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [answers, setAnswers] = useState({}); // Store answers for each question
    const [correctAnswers, setCorrectAnswers] = useState({}); // Store correct answers for each question

    // Fetching the questions from the API
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/weekly-test/getQuestionsByPlacementTestId/${placement_test_id}`);
                setQuestions(response.data.questions);
                setTotalMarks(response.data.totalMarks)
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [placement_test_id]);

    // Fetch the correct answer for each question
    useEffect(() => {
        const fetchCorrectAnswers = async () => {
            try {
                const answersFetched = {};
                for (const question of questions) {
                    const response = await axios.get(`${baseURL}/api/weekly-test/getCorrectAnswerForQuestion/${question.wt_question_id}`);
                    if (response.data.answer) {
                        answersFetched[question.wt_question_id] = response.data.answer;
                    } else {
                        answersFetched[question.wt_question_id] = ''; // No correct answer available
                    }
                }
                setCorrectAnswers(answersFetched);
            } catch (error) {
                toast.error('Error fetching correct answers.');
                console.error(error);
            }
        };

        if (questions.length > 0) {
            fetchCorrectAnswers();
        }
    }, [questions]);

    // Handle the text change for each editor (per question)
    const handleEditorChange = (value, questionId) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: value,
        }));
    };

    // Handle answer submission
    const handleSubmit = async (e, questionId) => {
        e.preventDefault();
        const answer = answers[questionId];
        if (!answer) {
            toast.error('Please provide an answer before submitting.');
            return;
        }

        try {
            const response = await axios.post(`${baseURL}/api/weekly-test/saveAnswerFortheQuestion/${questionId}`, { answer });

            if (response.status === 200) {
                toast.success('Answer updated successfully!');
                // console.log(response);
            } else if (response.status === 201) {
                toast.success('Answer saved successfully!');
                console.log(response);
            } else {
                toast.error('Failed to save the answer.');
                console.error(response);
            }
        } catch (error) {
            toast.error(`Error: ${error.message}`);
            console.error(error);
        }
    };

    if (loading) {
        return <p>Loading questions...</p>;
    }

    if (error) {
        return <p>Error fetching questions: {error}</p>;
    }

    return (
        <div>
            <BackButton />  
            <DescriptiveTestData />
            <ToastContainer />
            <div>
                <h5>Total Marks : {totalMarks}</h5>
            </div>
            <h2>Provide Answer</h2>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Question</th>
                        <th>Your Answer</th>
                        <th>Submit</th>
                    </tr>
                </thead>
                <tbody>
                    {questions.map((question, index) => (
                        <tr key={question.wt_question_id}>
                            <td>{index + 1}</td>
                            <td>
                                <pre>{question.wt_question_description}</pre>
                            </td>
                            <td>
                                <ReactQuill
                                    theme="snow"
                                    value={answers[question.wt_question_id] || correctAnswers[question.wt_question_id] || ''} // Show correct answer if available
                                    onChange={(value) => handleEditorChange(value, question.wt_question_id)}
                                    style={{ minHeight: '300px' }}
                                />
                            </td>
                            <td>
                                <Button
                                    variant="primary"
                                    onClick={(e) => handleSubmit(e, question.wt_question_id)}
                                >
                                    Submit
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default AnswerUpdateFormDescriptiveQuestions;
