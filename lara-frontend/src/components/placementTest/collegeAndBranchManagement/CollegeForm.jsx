import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { baseURL } from '../../config';

const CollegeForm = ({ collegeIdToUpdate, fetchColleges, setCollegeIdToUpdate, }) => {
    const [collegeName, setCollegeName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (collegeIdToUpdate) {
                await axios.put(`${baseURL}/api/placement-test/updateCollege/${collegeIdToUpdate.college_id}`, { college_name: collegeName });
                // toast.success('College updated successfully');
                alert('Updated Successfully');
                setCollegeIdToUpdate(null);
                setCollegeName('');
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

    useEffect(() => {
        const fetchCollege = async () => {
            if (collegeIdToUpdate) {
                try {
                    const res = await axios.get(`${baseURL}/api/placement-test/getCollegeById/${collegeIdToUpdate.college_id}`);
                    setCollegeName(res.data.college_name);
                } catch (error) {
                    console.error('Error fetching college:', error);
                    toast.error('Failed to load college details');
                }
            } else {
                setCollegeName('');
            }
        };
    
        fetchCollege();
    }, [collegeIdToUpdate]);
    

    return (
        <form onSubmit={handleSubmit} className="mb-3">
            <div className="row g-2 align-items-center">
                <div className="col-7">
                    <input
                        type="text"
                        className="form-control"
                        value={collegeName}
                        onChange={(e) => setCollegeName(e.target.value)}
                        placeholder="Enter College Name"
                        required
                    />
                </div>
                <div className="col-5">
                    <button type="submit" className="btn btn-primary w-100">
                        {collegeIdToUpdate ? 'Update College' : 'Add College'}
                    </button>
                </div>
                {collegeIdToUpdate && (
                    <div className="mt-2">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                setCollegeIdToUpdate(null);
                                setCollegeName('');
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                )}

            </div>
        </form>
    );
};

export default CollegeForm;
