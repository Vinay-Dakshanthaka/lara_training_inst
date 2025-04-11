import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { baseURL } from '../../config';

const CollegeForm = ({ collegeIdToUpdate, fetchColleges }) => {
    const [collegeName, setCollegeName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (collegeIdToUpdate) {
                await axios.put(`${baseURL}/api/placement-test/updateCollege/${collegeIdToUpdate}`, { college_name: collegeName });
                toast.success('College updated successfully');
            } else {
                await axios.post(`${baseURL}/api/placement-test/createCollege`, { college_name: collegeName });
                toast.success('College added successfully');
            }
            setCollegeName('');
            fetchColleges();
        } catch (error) {
            toast.error('Error saving college');
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="Enter College Name"
                required
            />
            <button type="submit">{collegeIdToUpdate ? 'Update College' : 'Add College'}</button>
        </form>
    );
};

export default CollegeForm;
