import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../config';
import { Button, Spinner, Row, Col } from 'react-bootstrap';

const DetailedResult = () => {
    const { test_id } = useParams();
    const [testResult, setTestResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const questionRefs = useRef([]);

    useEffect(() => {
        const fetchTestResult = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No token provided.");
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                };

                const response = await axios.post(`${baseURL}/api/cumulative-test/getTestResultsByTestId`, { test_id }, config);
                setTestResult(response.data);
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching test result:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTestResult();
    }, [test_id]);

    const handleQuestionClick = (index) => {
        questionRefs.current[index].scrollIntoView({ behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (!testResult) {
        return <div>No test result found.</div>;
    }

    const { test_result, cumulativequestions } = testResult;
    const { total_marks, obtained_marks, question_ans_data } = test_result;

    const getAnsweredQuestionsCount = () => {
        return cumulativequestions.filter(question => question_ans_data[question.cumulative_question_id]).length;
    };

    const getUnansweredQuestionsCount = () => {
        return cumulativequestions.filter(question => !question_ans_data[question.cumulative_question_id]).length;
    };

    const getWrongAnswersCount = () => {
        return cumulativequestions.filter(question => {
            const selectedOption = question_ans_data[question.cumulative_question_id];
            return selectedOption && selectedOption !== question.correct_option;
        }).length;
    };

    return (
        <div className="container mt-4">
            <Row className="mb-3">
                <Col><h6>Total Marks: {total_marks}</h6></Col>
                <Col><h6>Obtained Marks: {obtained_marks}</h6></Col>
            </Row>
            <div className="row">
                <div className="col-lg" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                    {cumulativequestions.map((question, index) => {
                        const selectedOption = question_ans_data[question.cumulative_question_id];
                        const isCorrect = selectedOption === question.correct_option;
                        return (
                            <div key={question.cumulative_question_id} ref={el => questionRefs.current[index] = el} className={`p-2 mb-2 border position-relative ${isCorrect ? 'border-success' : 'border-danger'}`}>
                            <span className="position-absolute top-0 end-0">Marks: {question.no_of_marks_allocated}</span>
                            <p>{index + 1}. {question.question_description}</p>
                            <ul>
                                <li className={`text-black`}>a : {question.option_1}</li>
                                <li className={`text-black`}>b : {question.option_2}</li>
                                <li className={`text-black`}>c : {question.option_3}</li>
                                <li className={`text-black`}>d : {question.option_4}</li>
                            </ul>
                            <p className={`text-${isCorrect ? 'success' : 'danger'}`}>Your Answer: {selectedOption ? selectedOption : "Not Attempted"}</p>
                            {!isCorrect && (
                                <p className="text-success">Correct Answer: {question.correct_option}</p>
                            )}
                        </div>                        
                        );
                    })}
                </div>
                <div className="col-lg-3 ml-lg-2" style={{ position: 'sticky', top: '10px' }}>
                    <h6>Results Summary</h6>
                    <table className="table">
                        <tbody>
                            <tr>
                                <td className='bg-warning'>Total Marks:</td>
                                <td className='bg-warning fw-bolder'>{total_marks}</td>
                            </tr>
                            <tr>
                                <td className='bg-warning'>Obtained Marks:</td>
                                <td className='text-success bg-warning fw-bolder'>{obtained_marks}</td>
                            </tr>
                            <tr>
                                <td className='bg-warning'>Answered Questions:</td>
                                <td className='text-dark bg-warning fw-bolder'>{getAnsweredQuestionsCount()}</td>
                            </tr>
                            <tr>
                                <td className='bg-warning'>Unanswered Questions:</td>
                                <td className='text-secondary bg-warning fw-bolder'>{getUnansweredQuestionsCount()}</td>
                            </tr>
                            <tr>
                                <td className='bg-warning'>Wrong Answers:</td>
                                <td className='text-danger bg-warning fw-bolder'>{getWrongAnswersCount()}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="d-flex flex-wrap mb-2">
                        {cumulativequestions.map((question, index) => {
                            const selectedOption = question_ans_data[question.cumulative_question_id];
                            const isCorrect = selectedOption === question.correct_option;
                            return (
                                <Button
                                    key={question.cumulative_question_id}
                                    variant={selectedOption ? (isCorrect ? 'success' : 'danger') : 'secondary'}
                                    className="m-1"
                                    onClick={() => handleQuestionClick(index)}
                                >
                                    {index + 1}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailedResult;
