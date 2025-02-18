// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { baseURL } from '../config';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import BackButton from '../BackButton';

// const EditWeeklyTestQuestion = () => {
//     const { question_id } = useParams();
//     const [question, setQuestion] = useState({
//         wt_question_description: '',
//         marks: '',
//         minutes: ''
//     });
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Fetch the question details by ID
//     useEffect(() => {
//         const fetchQuestion = async () => {
//             try {
//                 const response = await axios.get(`${baseURL}/api/weekly-test/getQuestionById/${question_id}`);
//                 setQuestion(response.data.question);
//                 setLoading(false);
//             } catch (error) {
//                 setError(error.message);
//                 setLoading(false);
//             }
//         };

//         fetchQuestion();
//     }, [question_id]);

//     // Handle form input change
//     const handleChange = (e) => {
//         setQuestion({
//             ...question,
//             [e.target.name]: e.target.value
//         });
//     };

//     // Handle form submission to update the question
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.put(`${baseURL}/api/weekly-test/updateQuestionHandler/${question_id}`, {
//                 wt_question_description: question.wt_question_description,
//                 marks: question.marks,
//                 minutes: question.minutes
//             });

//             if (response.status === 200) {
//                 toast.success('Question updated successfully!');
//             }
//         } catch (error) {
//             toast.error('Error updating question: ' + error.message);
//         }
//     };

//     if (loading) {
//         return <p>Loading...</p>;
//     }

//     if (error) {
//         return <p>Error: {error}</p>;
//     }

//     return (
//         <>
//         <BackButton />
//             <div className="container">
//                 <h3 className="mt-4">Edit Weekly Test Question</h3>
//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-3">
//                         <label htmlFor="wt_question_description" className="form-label">Question Description</label>
//                         <textarea
//                             id="wt_question_description"
//                             name="wt_question_description"
//                             className="form-control"
//                             value={question.wt_question_description}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>
//                     <div className="mb-3">
//                         <label htmlFor="marks" className="form-label">Marks</label>
//                         <input
//                             type="number"
//                             id="marks"
//                             name="marks"
//                             className="form-control"
//                             value={question.marks}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>
//                     <div className="mb-3">
//                         <label htmlFor="minutes" className="form-label">Minutes</label>
//                         <input
//                             type="number"
//                             id="minutes"
//                             name="minutes"
//                             className="form-control"
//                             value={question.minutes}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>
//                     <div className="mb-3">
//                         <button type="submit" className="btn btn-primary">Update Question</button>
//                     </div>
//                 </form>
//                 <ToastContainer />
//             </div>
//         </>

//     );
// };

// export default EditWeeklyTestQuestion;
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { baseURL } from '../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BackButton from '../BackButton';

const EditWeeklyTestQuestion = () => {
    const { question_id } = useParams();
    const [question, setQuestion] = useState({
        wt_question_description: '',
        marks: '',
        minutes: '',
        keywords: ''  // Comma-separated keywords
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch the question details by ID
    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/weekly-test/getQuestionById/${question_id}`);
                
                const questionData = response.data.question;
                const keywords = questionData.TestQuestionAnswerDetails?.map(ans => ans.keywords).join(", ") || "";

                setQuestion({
                    wt_question_description: questionData.wt_question_description,
                    marks: questionData.marks,
                    minutes: questionData.minutes,
                    keywords
                });

                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [question_id]);

    // Handle form input change
    const handleChange = (e) => {
        setQuestion({
            ...question,
            [e.target.name]: e.target.value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${baseURL}/api/weekly-test/updateQuestionHandler/${question_id}`, {
                wt_question_description: question.wt_question_description,
                marks: question.marks,
                minutes: question.minutes,
                keywords: question.keywords.split(",").map(keyword => keyword.trim())  // Convert to an array
            });

            if (response.status === 200) {
                toast.success('Question updated successfully!');
            }
        } catch (error) {
            toast.error('Error updating question: ' + (error.response?.data?.message || error.message));
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <BackButton />
            <div className="container">
                <h3 className="mt-4">Edit Weekly Test Question</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="wt_question_description" className="form-label">Question Description</label>
                        <textarea
                            id="wt_question_description"
                            name="wt_question_description"
                            className="form-control"
                            value={question.wt_question_description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="marks" className="form-label">Marks</label>
                        <input
                            type="number"
                            id="marks"
                            name="marks"
                            className="form-control"
                            value={question.marks}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="minutes" className="form-label">Minutes</label>
                        <input
                            type="number"
                            id="minutes"
                            name="minutes"
                            className="form-control"
                            value={question.minutes}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="keywords" className="form-label">Keywords (comma-separated)</label>
                        <input
                            type="text"
                            id="keywords"
                            name="keywords"
                            className="form-control"
                            value={question.keywords}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <button type="submit" className="btn btn-primary">Update Question</button>
                    </div>
                </form>
                <ToastContainer />
            </div>
        </>
    );
};

export default EditWeeklyTestQuestion;
