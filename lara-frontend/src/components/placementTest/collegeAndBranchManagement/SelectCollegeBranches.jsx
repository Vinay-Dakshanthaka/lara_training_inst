import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../../config';

const SelectCollegeBranches = ({ onSelectionChange }) => {
    const [universities, setUniversities] = useState([]);
    const [colleges, setColleges] = useState([]);
    const [branches, setBranches] = useState([]);

    const [selectedUniversityId, setSelectedUniversityId] = useState('');
    const [selectedCollegeId, setSelectedCollegeId] = useState('');
    const [assignedBranches, setAssignedBranches] = useState([]);
    const [selectedBranchIds, setSelectedBranchIds] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const [uniRes, collegeRes, branchRes] = await Promise.all([
                axios.get(`${baseURL}/api/placement-test/getAllUniversities`),
                axios.get(`${baseURL}/api/placement-test/getAllColleges`),
                axios.get(`${baseURL}/api/placement-test/getAllBranches`)
            ]);
            setUniversities(uniRes.data);
            setColleges(collegeRes.data);
            setBranches(branchRes.data);
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchAssigned = async () => {
            if (selectedCollegeId) {
                const res = await axios.get(`${baseURL}/api/placement-test/getAssignedBranchesToCollege/${selectedCollegeId}`);
                const branchIds = res.data.map(b => b.branch_id);
                setAssignedBranches(branchIds);
                setSelectedBranchIds(branchIds);
            } else {
                setAssignedBranches([]);
                setSelectedBranchIds([]);
            }
        };

        fetchAssigned();
    }, [selectedCollegeId]);

    useEffect(() => {
        if (onSelectionChange) {
            onSelectionChange({
                universityId: selectedUniversityId || null,
                collegeId: selectedCollegeId || null,
                branchIds: selectedBranchIds
            });
        }
    }, [selectedUniversityId, selectedCollegeId, selectedBranchIds]);

    const handleBranchChange = (branchId) => {
        setSelectedBranchIds(prev =>
            prev.includes(branchId)
                ? prev.filter(id => id !== branchId)
                : [...prev, branchId]
        );
    };

    return (
        <div className="mb-4">
            <div className="mb-3">
                <label className="form-label fw-bold">Select University:</label>
                <select
                    className="form-select"
                    value={selectedUniversityId}
                    onChange={(e) => setSelectedUniversityId(e.target.value)}
                >
                    <option value="">-- Choose University    --</option>
                    {universities.map((uni) => (
                        <option key={uni.university_id} value={uni.university_id}>
                            {uni.university_name}
                        </option>
                    ))}
                </select>
            </div>

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
                    <label className="form-label fw-bold">Select Branches:</label>
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
