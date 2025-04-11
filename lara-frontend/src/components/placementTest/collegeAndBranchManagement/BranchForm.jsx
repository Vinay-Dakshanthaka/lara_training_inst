import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { baseURL } from '../../config';

const BranchForm = ({ branchIdToUpdate, fetchBranches, setBranchIdToUpdate }) => {
    const [branchName, setBranchName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (branchIdToUpdate) {
                await axios.put(`${baseURL}/api/placement-test/updateBranch/${branchIdToUpdate.branch_id}`, { branch_name: branchName });
                // toast.success('Branch updated successfully');
                alert('Updated successfully')
                setBranchIdToUpdate(null);
                setBranchName('');
            } else {
                await axios.post(`${baseURL}/api/placement-test/createBranch`, { branch_name: branchName });
                toast.success('Branch added successfully');
            }
            setBranchName('');
            fetchBranches();
        } catch (error) {
            toast.error('Error saving branch');
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchBranches = async () => {
            if (branchIdToUpdate) {
                try {
                    const res = await axios.get(`${baseURL}/api/placement-test/getBranchById/${branchIdToUpdate.branch_id}`);
                    setBranchName(res.data.branch_name);
                } catch (error) {
                    console.error('Error fetching branch:', error);
                    toast.error('Failed to load branch details');
                }
            } else {
                setBranchName('');
            }
        };

        fetchBranches();
    }, [branchIdToUpdate]);

    return (
        <form onSubmit={handleSubmit} className="mb-3">
            <div className="row g-2 align-items-center">
                <div className="col-7">
                    <input
                        type="text"
                        value={branchName}
                        onChange={(e) => setBranchName(e.target.value)}
                        placeholder="Enter Branch Name"
                        className='form-control'
                        required
                    />
                </div>
                <div className="col-5">
                    <button type="submit" className="btn btn-primary w-100">{branchIdToUpdate ? 'Update Branch' : 'Add Branch'}</button>
                </div>
                {branchIdToUpdate && (
                    <div className="mt-2">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                setBranchIdToUpdate(null);
                                setBranchName('');
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

export default BranchForm;
