import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { baseURL } from '../../config';

const UniversityForm = ({ universityToEdit, fetchUniversities, setUniversityToEdit }) => {
    const [universityName, setUniversityName] = useState('');

    useEffect(() => {
        if (universityToEdit) {
            setUniversityName(universityToEdit.university_name || '');
        } else {
            setUniversityName('');
        }
    }, [universityToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (universityToEdit) {
                await axios.put(`${baseURL}/api/placement-test/updateUniversity/${universityToEdit.university_id}`, {
                    university_name: universityName,
                });
                toast.success('University updated');
                setUniversityToEdit(null);
            } else {
                await axios.post(`${baseURL}/api/placement-test/createUniversity`, {
                    university_name: universityName,
                });
                toast.success('University created');
            }
            setUniversityName('');
            fetchUniversities();
        } catch (err) {
            toast.error('Error saving university');
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-3">
            <div className="row g-2 align-items-center">
                <div className="col-7">
                    <input
                        type="text"
                        className="form-control"
                        value={universityName}
                        onChange={(e) => setUniversityName(e.target.value)}
                        placeholder="Enter University Name"
                        required
                    />
                </div>
                <div className="col-5">
                    <button type="submit" className="btn btn-primary w-100">
                        {universityToEdit ? 'Update University' : 'Add University'}
                    </button>
                </div>
                {universityToEdit && (
                    <div className="mt-2">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                setUniversityToEdit(null);
                                setUniversityName('');
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

export default UniversityForm;
