import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../config';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateSchedule = () => {
    const [id, setId] = useState('');
    const [todaySchedule, setTodaySchedule] = useState('');
    const [tomorrowSchedule, setTomorrowSchedule] = useState('');
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    useEffect(() => {
        const fetchHomeContent = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/student/fetchHomeContent`);
                const data = response.data[0]; 
                setId(data.id);
                setTodaySchedule(formatSchedule(data.today_schedule));
                setTomorrowSchedule(formatSchedule(data.tomorrow_schedule));
            } catch (error) {
                console.error('Error fetching home content:', error);
            }
        };
    
        fetchHomeContent();
    }, []);
    
    // Function to format schedule URLs
    const formatSchedule = (schedule) => {
        // Split by multiple spaces and trim
        const urls = schedule.split(/\s+/).map(url => url.trim());
        // Join the URLs with newline character
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
            await axios.post(`${baseURL}/api/student/saveOrUpdateHomeContent`, {
                today_schedule: todaySchedule,
                tomorrow_schedule: tomorrowSchedule
            }, config);
            alert("Schedule Updated Successfully");
            console.log("Success");
        } catch (error) {
            console.error('Error updating home content:', error);
            alert("Something went wrong");
        }
    };

    return (
        <div className="container my-4">
            <h1 className='my-4'>Update Schedule</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="todayScheduleInput" className="form-label">Today's Schedule</label>
                    <textarea className="form-control" id="todayScheduleInput" rows="3" value={todaySchedule} onChange={(e) => setTodaySchedule(e.target.value)}></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="tomorrowScheduleInput" className="form-label">Tomorrow's Schedule</label>
                    <textarea className="form-control" id="tomorrowScheduleInput" rows="3" value={tomorrowSchedule} onChange={(e) => setTomorrowSchedule(e.target.value)}></textarea>
                </div>
                <button type="submit" className="btn btn-primary my-3">Update Schedule</button>
            </form>
            <div className="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="d-flex">
                    <div className="toast-body">
                        Schedule Updated Successfully
                    </div>
                    <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
            <div className="toast align-items-center text-white bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="d-flex">
                    <div className="toast-body">
                        Something went wrong
                    </div>
                    <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        </div>
    );
};

export default UpdateSchedule;
