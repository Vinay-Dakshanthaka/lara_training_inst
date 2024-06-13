import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../config';
import 'bootstrap/dist/css/bootstrap.min.css';

// const UpdateSchedule = () => {
//     const [id, setId] = useState('');
//     const [todaySchedule, setTodaySchedule] = useState('');
//     //const [tomorrowSchedule, setTomorrowSchedule] = useState('');
//     const [showSuccessToast, setShowSuccessToast] = useState(false);
//     const [availableBatches, setAvailableBatches] = useState([]);
//     const [selectedBatches, setSelectedBatches] = useState([]);
    


//     //Fetching Available Batches
//     const fetchAvailableBatches = async () => {
//         try {
//           const token = localStorage.getItem("token");
//           if (!token) {
//             return;
//           }
    
//           const config = {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           };
    
//           const response = await axios.get(`${baseURL}/api/student/getAllBatches`, config);
//           setAvailableBatches(response.data);
//         } catch (error) {
//           console.error('Error fetching batches:', error);
//         }
//       };

//     useEffect(() => {
//         fetchAvailableBatches();
//     }, []);

//     useEffect(() => {
//         const fetchHomeContent = async () => {
//             try {
//                 const response = await axios.get(`${baseURL}/api/student/fetchHomeContent`);
//                 const data = response.data[0]; 
//                 setId(data.id);
//                 setTodaySchedule(formatSchedule(data.today_schedule));
//                 //setTomorrowSchedule(formatSchedule(data.tomorrow_schedule));
//             } catch (error) {
//                 console.error('Error fetching home content:', error);
//             }
//         };
    
//         fetchHomeContent();
//     }, []);
    
//     // Function to format schedule URLs
//     const formatSchedule = (schedule) => {
//         // Split by multiple spaces and trim
//         const urls = schedule.split(/\s+/).map(url => url.trim());
//         // Join the URLs with newline character
//         return urls.join('\n');
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const token = localStorage.getItem("token");
//             if (!token) {
//                 return;
//             }

//             const config = {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             };
//             await axios.post(`${baseURL}/api/student/saveOrUpdateHomeContent`, {
//                 today_schedule: todaySchedule,
//                 //tomorrow_schedule: tomorrowSchedule
//             }, config);
//             alert("Schedule Updated Successfully");
//             console.log("Success");
//         } catch (error) {
//             console.error('Error updating home content:', error);
//             alert("Something went wrong");
//         }
//     };

//     // Updating schedule according to Batch by Selecting Batch first
//     const handleBatchSelection = (batch_id) => {
//         setSelectedBatches(prevSelected => 
//             prevSelected.includes(batch_id) 
//             ? prevSelected.filter(id => id !== batch_id) 
//             : [...prevSelected, batch_id]
//         );
//     };

//     // return (
//     //     <div className="container my-4">
//     //         <h2 className='my-4'>Update Schedule</h2>
//     //         <div className="accordion accordion-flush" id="accordionFlushExample">
//     //             <div className="accordion-item w-50">
//     //                 <h2 className="accordion-header" id="flush-headingOne">
//     //                 <button className="accordion-button collapsed fw-bold border border-light" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
//     //                     Available Batches
//     //                 </button>
//     //                 </h2>

//     //                 {/* Rendering Available Batches */}
//     //                 <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
//     //                     {availableBatches.map((batches) => {
//     //                         return (
//     //                         <div class="accordion-body" key={batches.batch_id}>
//     //                             {batches.batch_name}
//     //                         </div>);
//     //                     })}
                    
//     //                 </div>
//     //             </div>
//     //         </div>    


//     //             {/* <h3>Available Batches</h3> */}
//     //             {/* <ul className='list-group-item'>
//     //                 {availableBatches.map((batches) => {
//     //                     return <li key={batches.batch_id}>{batches.batch_name}</li>
//     //                 })}
//     //             </ul> */}
            
//     //         <form onSubmit={handleSubmit}>
//     //             <div className="mb-3">
//     //                 <label htmlFor="todayScheduleInput" className="form-label">Today's Schedule</label>
//     //                 <textarea className="form-control" id="todayScheduleInput" rows="3" value={todaySchedule} onChange={(e) => setTodaySchedule(e.target.value)}></textarea>
//     //             </div>
//     //             {/* <div className="mb-3">
//     //                 <label htmlFor="tomorrowScheduleInput" className="form-label">Tomorrow's Schedule</label>
//     //                 <textarea className="form-control" id="tomorrowScheduleInput" rows="3" value={tomorrowSchedule} onChange={(e) => setTomorrowSchedule(e.target.value)}></textarea>
//     //             </div> */}
//     //             <button type="submit" className="btn btn-primary my-3">Update Schedule</button>
//     //         </form>
//     //         <div className="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
//     //             <div className="d-flex">
//     //                 <div className="toast-body">
//     //                     Schedule Updated Successfully
//     //                 </div>
//     //                 <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
//     //             </div>
//     //         </div>
//     //         <div className="toast align-items-center text-white bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">
//     //             <div className="d-flex">
//     //                 <div className="toast-body">
//     //                     Something went wrong
//     //                 </div>
//     //                 <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
//     //             </div>
//     //         </div>
//     //     </div>
//     // );
//     return (
//     <div className="container my-4">
//             <h2 className='my-4'>Update Schedule</h2>
//             <div className="accordion accordion-flush" id="accordionFlushExample">
//                 <div className="accordion-item w-50">
//                     <h2 className="accordion-header" id="flush-headingOne">
//                         <button className="accordion-button collapsed fw-bold border border-light" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
//                             Available Batches
//                         </button>
//                     </h2>

//                     <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
//                         {availableBatches.map((batch) => (
//                             <div className="accordion-body" key={batch.batch_id}>
//                                 <input 
//                                     type="checkbox" 
//                                     id={`batch-${batch.batch_id}`} 
//                                     checked={selectedBatches.includes(batch.batch_id)} 
//                                     onChange={() => handleBatchSelection(batch.batch_id)} 
//                                 />
//                                 <label htmlFor={`batch-${batch.batch_id}`} className="ms-2">{batch.batch_name}</label>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             <form onSubmit={handleSubmit}>
//                 <div className="mb-3">
//                     <label htmlFor="todayScheduleInput" className="form-label">Today's Schedule</label>
//                     <textarea 
//                         className="form-control" 
//                         id="todayScheduleInput" 
//                         rows="3" 
//                         value={todaySchedule} 
//                         onChange={(e) => setTodaySchedule(e.target.value)}>
//                     </textarea>
//                 </div>
//                 <button type="submit" className="btn btn-primary my-3">Update Schedule</button>
//             </form>
//             <div className="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
//                 <div className="d-flex">
//                     <div className="toast-body">
//                         Schedule Updated Successfully
//                     </div>
//                     <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
//                 </div>
//             </div>
//             <div className="toast align-items-center text-white bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">
//                 <div className="d-flex">
//                     <div className="toast-body">
//                         Something went wrong
//                     </div>
//                     <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
//                 </div>
//             </div>
//         </div>
//     );

// };


const UpdateSchedule = () => {
    const [id, setId] = useState('');
    const [todaySchedule, setTodaySchedule] = useState('');
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [availableBatches, setAvailableBatches] = useState([]);
    const [selectedBatches, setSelectedBatches] = useState([]);

    // Fetching Available Batches
    const fetchAvailableBatches = async () => {
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

            const response = await axios.get(`${baseURL}/api/student/getAllBatches`, config);
            setAvailableBatches(response.data);
        } catch (error) {
            console.error('Error fetching batches:', error);
        }
    };

    useEffect(() => {
        fetchAvailableBatches();
    }, []);

    useEffect(() => {
        const fetchHomeContent = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/student/fetchHomeContent`);
                const data = response.data[0]; 
                setId(data.id);
                setTodaySchedule(formatSchedule(data.today_schedule));
            } catch (error) {
                console.error('Error fetching home content:', error);
            }
        };
    
        fetchHomeContent();
    }, []);
    
    // Function to format schedule URLs
    const formatSchedule = (schedule) => {
        const urls = schedule.split(/\s+/).map(url => url.trim());
        return urls.join('\n');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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

            const batchSchedules = selectedBatches.map(batchId => ({
                batch_id: batchId,
                schedule: todaySchedule
            }));

            await axios.post(`${baseURL}/api/student/saveOrUpdateHomeContent`, {
                batchSchedules
            }, config);
            setShowSuccessToast(true);
            console.log("Schedule Updated Successfully");
        } catch (error) {
            console.error('Error updating home content:', error);
            setShowErrorToast(true);
        }
    };

    const handleBatchSelection = (batch_id) => {
        setSelectedBatches(prevSelected => 
            prevSelected.includes(batch_id) 
            ? prevSelected.filter(id => id !== batch_id) 
            : [...prevSelected, batch_id]
        );
    };

    return (
        <div className="container my-4">
            <h2 className='my-4'>Update Schedule</h2>
            <div className="accordion accordion-flush" id="accordionFlushExample">
                <div className="accordion-item">
                    <h2 className="accordion-header" id="flush-headingOne">
                        <button className="accordion-button collapsed fw-bold border border-light" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                            Available Batches
                        </button>
                    </h2>

                    <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                        {availableBatches.map((batch) => (
                            <div className="accordion-body" key={batch.batch_id}>
                                <input 
                                    type="checkbox" 
                                    id={`batch-${batch.batch_id}`} 
                                    checked={selectedBatches.includes(batch.batch_id)} 
                                    onChange={() => handleBatchSelection(batch.batch_id)} 
                                />
                                <label htmlFor={`batch-${batch.batch_id}`} className="ms-2">{batch.batch_name}</label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {selectedBatches.length > 0 && (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="todayScheduleInput" className="form-label">Today's Schedule</label>
                        <textarea 
                            className="form-control" 
                            id="todayScheduleInput" 
                            rows="3" 
                            value={todaySchedule} 
                            onChange={(e) => setTodaySchedule(e.target.value)}>
                        </textarea>
                    </div>
                    <button type="submit" className="btn btn-primary my-3">Update Schedule</button>
                </form>
            )}

            <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
                <div id="successToast" className={`toast ${showSuccessToast ? 'show' : ''}`} role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="toast-header text-white bg-success">
                        <strong className="me-auto">Success</strong>
                        <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => setShowSuccessToast(false)}></button>
                    </div>
                    <div className="toast-body">
                        Schedule Updated Successfully
                    </div>
                </div>

                <div id="errorToast" className={`toast ${showErrorToast ? 'show' : ''}`} role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="toast-header text-white bg-danger">
                        <strong className="me-auto">Error</strong>
                        <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => setShowErrorToast(false)}></button>
                    </div>
                    <div className="toast-body">
                        Something went wrong
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateSchedule;

