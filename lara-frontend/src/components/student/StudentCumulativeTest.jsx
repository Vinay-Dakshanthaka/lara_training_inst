import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Checkbox, Button, TextField, Grid, FormControlLabel, Card, CardContent, Typography, Box, Table, TableBody, TableRow, TableCell, Alert } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../config';
import { BusAlert } from '@mui/icons-material';

const StudentCumulativeTest = () => {
    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [numQuestions, setNumQuestions] = useState(20);
    const [availableQuestions, setAvailableQuestions] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectAllTopics, setSelectAllTopics] = useState(false); // Added state for "Select All" topics
    const navigate = useNavigate();
    // const currentLocation = useLocation();
    // const message = currentLocation.state?.message;

    const handleNavigate = () => {
        navigate('/all-test-results');
    };

    useEffect(() => {
        const fetchSubjects = async () => {
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

                const response = await axios.get(`${baseURL}/api/cumulative-test/getAllSubjects`, config);
                setSubjects(response.data);
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        };

        fetchSubjects();
    }, []);

    const handleSubjectChange = async (e) => {
        const subjectId = e.target.value;
        setSelectedSubject(subjectId);
        setSelectedTopics([]); // Reset selected topics
        setAvailableQuestions(0); // Reset available questions
        setErrorMessage(''); // Reset error message

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

            const response = await axios.get(`${baseURL}/api/cumulative-test/getTopicsBySubjectId`, {
                params: { subject_id: subjectId },
                ...config,
            });

            setTopics(response.data);
        } catch (error) {
            console.error('Error fetching topics:', error);
        }
    };

    const handleTopicChange = (topicId) => {
        setSelectedTopics((prevSelectedTopics) => {
            const newSelectedTopics = prevSelectedTopics.includes(topicId)
                ? prevSelectedTopics.filter((id) => id !== topicId)
                : [...prevSelectedTopics, topicId];

            updateAvailableQuestions(newSelectedTopics);
            return newSelectedTopics;
        });
    };

    const handleSelectAllTopics = () => {
        setSelectAllTopics(!selectAllTopics);
        if (!selectAllTopics) {
            const allTopicIds = topics.map(topic => topic.topic_id);
            setSelectedTopics(allTopicIds);
            updateAvailableQuestions(allTopicIds);
        } else {
            setSelectedTopics([]);
            setAvailableQuestions(0);
        }
    };

    const updateAvailableQuestions = async (topicIds) => {
        if (topicIds.length === 0) {
            setAvailableQuestions(0);
            return;
        }

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

            const response = await axios.post(`${baseURL}/api/cumulative-test/getQuestionCountsByTopicIds`, {
                topic_ids: topicIds
            }, config);

            const totalAvailableQuestions = response.data.reduce((sum, topic) => sum + topic.question_count, 0);
            setAvailableQuestions(totalAvailableQuestions);
        } catch (error) {
            console.error('Error fetching available questions:', error);
        }
    };

    const handleNumQuestionsChange = (e) => {
        const value = e.target.value;
        setNumQuestions(value);
        if (value > availableQuestions) {
            setErrorMessage(`Enter less than ${availableQuestions}`);
        } else {
            setErrorMessage('');
        }
    };

    const handleStartTest = () => {
        if (numQuestions <= availableQuestions) {
            navigate('/start-test', { state: { selectedTopics, numQuestions } });
        }
    };

    const selectedSubjectName = subjects.find(subject => subject.subject_id === selectedSubject)?.name || '';
    const selectedTopicsNames = topics.filter(topic => selectedTopics.includes(topic.topic_id)).map(topic => topic.name);
    const duration = numQuestions * 1; // 1 minute per question

    return (
        <>

            {/* {message && (
                <Alert severity="warning" style={{ marginTop: '20px', fontSize: '1.2em', fontWeight: 'bold', color: '#d32f2f', backgroundColor: '#ffebee' }}>
                    {message}
                </Alert>
            )} */}
            <Button
                variant="contained"
                color="secondary"
                onClick={handleNavigate}
                style={{ marginTop: '20px' }}
            >
                View All Test Results
            </Button>
            <br />
            <FormControl fullWidth margin="normal" style={{ maxWidth: '300px' }}>
                <InputLabel>Select Subject</InputLabel>
                <Select
                    value={selectedSubject}
                    onChange={handleSubjectChange}
                    required
                >
                    <MenuItem value="">
                        <em>-- Select Subject --</em>
                    </MenuItem>
                    {subjects.map((subject) => (
                        <MenuItem key={subject.subject_id} value={subject.subject_id}>
                            {subject.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <div>
                <h5>Select Topics</h5>
                <FormControl fullWidth margin="normal">
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={selectAllTopics}
                                onChange={handleSelectAllTopics}
                            />
                        }
                        label="Select All"
                    />
                    <Grid container spacing={2}>
                        {topics.map((topic) => (
                            <Grid item xs={3} key={topic.topic_id}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={selectedTopics.includes(topic.topic_id)}
                                            onChange={() => handleTopicChange(topic.topic_id)}
                                        />
                                    }
                                    label={topic.name}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </FormControl>
            </div>

            <TextField
                label="Number of Questions"
                type="number"
                value={numQuestions}
                onChange={handleNumQuestionsChange}
                margin="normal"
                required
                style={{ maxWidth: '300px' }}
                error={!!errorMessage}
                helperText={errorMessage}
            />

            {selectedTopics.length > 0 && numQuestions > 0 && availableQuestions === 0 ? (
                <Typography color="error" variant="body1" style={{ marginTop: '10px' }}>
                    Currently no questions are available. Questions will be updated soon.
                </Typography>
            ) : (
                <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" minHeight="50vh" padding={2}>
                    {selectedSubject && selectedTopics.length > 0 &&
                        (
                            <Card style={{ marginTop: '20px', maxWidth: '500px', width: '100%' }}>
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        Test Summary
                                    </Typography>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell><strong>Subject:</strong></TableCell>
                                                <TableCell>{selectedSubjectName}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell><strong>Topics:</strong></TableCell>
                                                <TableCell>{selectedTopicsNames.join(', ')}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell><strong>Number of Questions:</strong></TableCell>
                                                <TableCell>{numQuestions}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell><strong>Duration:</strong></TableCell>
                                                <TableCell>{duration} {duration > 1 ? 'minutes' : 'minute'}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                    <Alert severity="warning" style={{ marginTop: '20px', fontSize: '1.2em', fontWeight: 'bold', color: '#d32f2f', backgroundColor: '#ffebee' }}>
                                        Please avoid refreshing the page or opening a new tab to prevent loss of progress.
                                    </Alert>
                                    <Box display="flex" justifyContent="center" marginTop={2}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleStartTest}
                                            disabled={numQuestions > availableQuestions}
                                            style={{ marginTop: '20px' }}
                                        >
                                            Start
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        )}
                </Box>
            )}
        </>
    );
};

export default StudentCumulativeTest;
