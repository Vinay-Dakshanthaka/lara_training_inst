import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { baseURL } from '../../config';

const BranchForm = ({ branchIdToUpdate, fetchBranches }) => {
    const [branchName, setBranchName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (branchIdToUpdate) {
                await axios.put(`${baseURL}/api/placement-test/updateBranch/${branchIdToUpdate}`, { branch_name: branchName });
                toast.success('Branch updated successfully');
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

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                placeholder="Enter Branch Name"
                required
            />
            <button type="submit">{branchIdToUpdate ? 'Update Branch' : 'Add Branch'}</button>
        </form>
    );
};

export default BranchForm;
