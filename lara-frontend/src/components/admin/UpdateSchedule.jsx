import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseURL } from '../config';


const UpdateSchedule = () => {
    const [id, setId] = useState('');
    const [todaySchedule, setTodaySchedule] = useState('');
    const [tomorrowSchedule, setTomorrowSchedule] = useState('');

    useEffect(() => {
        const fetchHomeContent = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/student/fetchHomeContent`);
                const data = response.data[0]; // Assuming there's only one object
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
            console.log(" success")
            toast.success("Schedule Updated Successfully ")
        } catch (error) {
            console.error('Error updating home content:', error);
            toast.error("Something went wrong")
        }
    };

    return (
        <div className="container my-4">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
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
        </div>
    );
};

export default UpdateSchedule;
