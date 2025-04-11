import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseURL } from '../../config';

const AssignBranches = ({ colleges, branches, fetchAssignedBranches }) => {
    const [selectedCollege, setSelectedCollege] = useState('');
    const [assignedBranches, setAssignedBranches] = useState([]); // To hold assigned branches for the selected college
    const [selectedBranches, setSelectedBranches] = useState([]); // To hold selected branches for assignment

    useEffect(() => {
        if (selectedCollege) {
            fetchAssignedBranchesForCollege(selectedCollege);
        }
    }, [selectedCollege]);

    // Fetch assigned branches for the selected college
    const fetchAssignedBranchesForCollege = async (collegeId) => {
        try {
            const res = await axios.get(`${baseURL}/api/placement-test/getAssignedBranchesToCollege/${collegeId}`);
            setAssignedBranches(res.data); // Set the assigned branches for the selected college
            setSelectedBranches(res.data.map(branch => branch.branch_id)); // Pre-select assigned branches in checkboxes
        } catch (error) {
            toast.error('Error fetching assigned branches');
            console.error(error);
        }
    };

    const handleAssignBranches = async (e) => {
        e.preventDefault();
        
        // Only send the unassigned branches (exclude already assigned branches from selectedBranches)
        const unassignedBranchIds = selectedBranches.filter(
            (branchId) => !assignedBranches.some((assignedBranch) => assignedBranch.branch_id === branchId)
        );

        if (unassignedBranchIds.length > 0) {
            try {
                await axios.post(`${baseURL}/api/placement-test/assignBranchesToCollegeNoTestId`, {
                    college_id: selectedCollege,
                    branch_ids: unassignedBranchIds,
                });
                toast.success('Branches assigned successfully');
                fetchAssignedBranches(selectedCollege); // Refresh the assigned branches
            } catch (error) {
                toast.error('Error assigning branches');
                console.error(error);
            }
        } else {
            toast.warning('No unassigned branches selected.');
        }
    };

    const handleBranchChange = (branchId) => {
        setSelectedBranches((prev) =>
            prev.includes(branchId) ? prev.filter((id) => id !== branchId) : [...prev, branchId]
        );
    };

    // Filter out assigned branches from the full list of branches
    const unassignedBranches = branches.filter(
        (branch) => !assignedBranches.some((assignedBranch) => assignedBranch.branch_id === branch.branch_id)
    );

    return (
        <form onSubmit={handleAssignBranches} className="p-4 border rounded bg-light">
            <h3>Assign Branches to College</h3>

            <div className="mb-3">
                <label htmlFor="collegeSelect" className="form-label">Select College:</label>
                <select
                    id="collegeSelect"
                    className="form-select"
                    onChange={(e) => setSelectedCollege(e.target.value)}
                    value={selectedCollege}
                >
                    <option value="">--Select College--</option>
                    {colleges.map((college) => (
                        <option key={college.college_id} value={college.college_id}>
                            {college.college_name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">Assigned Branches:</label>
                <div className="list-group">
                    {assignedBranches.length > 0 ? (
                        assignedBranches.map((branch) => (
                            <span key={branch.branch_id} className="badge bg-primary m-1">
                                {branch.branch_name}
                            </span>
                        ))
                    ) : (
                        <p>No branches assigned yet</p>
                    )}
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label">Select Branches to Assign:</label>
                <div>
                    {unassignedBranches.map((branch) => (
                        <div key={branch.branch_id} className="form-check">
                            <input
                                type="checkbox"
                                id={`branch-${branch.branch_id}`}
                                className="form-check-input"
                                checked={selectedBranches.includes(branch.branch_id)}
                                onChange={() => handleBranchChange(branch.branch_id)}
                            />
                            <label className="form-check-label" htmlFor={`branch-${branch.branch_id}`}>
                                {branch.branch_name}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <button type="submit" className="btn btn-primary">Assign Branches</button>
        </form>
    );
};

export default AssignBranches;
