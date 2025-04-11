import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../../config';

const SelectCollegeBranches = ({ onSelectionChange }) => {
    const [colleges, setColleges] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedCollegeId, setSelectedCollegeId] = useState('');
    const [assignedBranches, setAssignedBranches] = useState([]);
    const [selectedBranchIds, setSelectedBranchIds] = useState([]);

    useEffect(() => {
        const fetchColleges = async () => {
            const res = await axios.get(`${baseURL}/api/placement-test/getAllColleges`);
            setColleges(res.data);
        };

        const fetchBranches = async () => {
            const res = await axios.get(`${baseURL}/api/placement-test/getAllBranches`);
            setBranches(res.data);
        };

        fetchColleges();
        fetchBranches();
    }, []);

    useEffect(() => {
        const fetchAssigned = async () => {
            if (selectedCollegeId) {
                const res = await axios.get(`${baseURL}/api/placement-test/getAssignedBranchesToCollege/${selectedCollegeId}`);
                const branchIds = res.data.map(b => b.branch_id);
                setAssignedBranches(branchIds);
                setSelectedBranchIds(branchIds); // Pre-check assigned ones
            } else {
                setAssignedBranches([]);
                setSelectedBranchIds([]);
            }
        };

        fetchAssigned();
    }, [selectedCollegeId]);

    const handleBranchChange = (branchId) => {
        setSelectedBranchIds(prev =>
            prev.includes(branchId)
                ? prev.filter(id => id !== branchId)
                : [...prev, branchId]
        );
    };

    if (onSelectionChange) {
        onSelectionChange({ collegeId: selectedCollegeId, branchIds: selectedBranchIds });
    }
    return (
        <div className="mb-4">
            <div className="mb-3">
                <label className="form-label fw-bold">Select College:</label>
                <select
                    className="form-select"
                    value={selectedCollegeId}
                    onChange={(e) => setSelectedCollegeId(e.target.value)}
                >
                    <option value="">-- Choose College --</option>
                    {colleges.map((college) => (
                        <option key={college.college_id} value={college.college_id}>
                            {college.college_name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedCollegeId && (
                <div className="mb-3">
                    <label className="form-label fw-bold">Assigned Branches:</label>
                    <div className="d-flex flex-wrap gap-2">
                        {branches.map((branch) => (
                            <div className="form-check" key={branch.branch_id}>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={selectedBranchIds.includes(branch.branch_id)}
                                    onChange={() => handleBranchChange(branch.branch_id)}
                                    id={`branch-${branch.branch_id}`}
                                />
                                <label className="form-check-label" htmlFor={`branch-${branch.branch_id}`}>
                                    {branch.branch_name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SelectCollegeBranches;
