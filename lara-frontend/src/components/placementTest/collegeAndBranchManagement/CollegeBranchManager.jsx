import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CollegeForm from './CollegeForm';
import BranchForm from './BranchForm';
import CollegeTable from './CollegeTable';
import BranchTable from './BranchTable';
import AssignBranches from './AssignBranches';
import { baseURL } from '../../config';

const CollegeBranchManager = () => {
    const [activeTab, setActiveTab] = useState('colleges');
    const [colleges, setColleges] = useState([]);
    const [branches, setBranches] = useState([]);
    const [collegeIdToUpdate, setCollegeIdToUpdate] = useState(null);
    const [branchIdToUpdate, setBranchIdToUpdate] = useState(null);
    const [assignedBranches, setAssignedBranches] = useState({}); // To store branches for each college

    // Fetch Colleges and Branches
    const fetchColleges = async () => {
        const res = await axios.get(`${baseURL}/api/placement-test/getAllColleges`);
        setColleges(res.data);
    };

    const fetchBranches = async () => {
        const res = await axios.get(`${baseURL}/api/placement-test/getAllBranches`);
        setBranches(res.data);
    };

    const fetchAssignedBranches = async (collegeId) => {
        const res = await axios.get(`${baseURL}/api/placement-test/getAssignedBranchesToCollege/${collegeId}`);
        setAssignedBranches((prevState) => ({
            ...prevState,
            [collegeId]: res.data, // Store branches for the given collegeId
        }));
    };

    useEffect(() => {
        fetchColleges();
        fetchBranches();
    }, []);

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">College & Branch Management</h2>

            {/* Tabs */}
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'colleges' ? 'active' : ''}`}
                        onClick={() => setActiveTab('colleges')}
                    >
                        Colleges
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'branches' ? 'active' : ''}`}
                        onClick={() => setActiveTab('branches')}
                    >
                        Branches
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'assignBranches' ? 'active' : ''}`}
                        onClick={() => setActiveTab('assignBranches')}
                    >
                        Assign Branches
                    </button>
                </li>
            </ul>

            {/* Render active tab components */}
            {activeTab === 'colleges' && (
                <>
                    <CollegeForm collegeIdToUpdate={collegeIdToUpdate} fetchColleges={fetchColleges} />
                    <CollegeTable
                        colleges={colleges}
                        assignedBranches={assignedBranches}
                        onEdit={setCollegeIdToUpdate}
                        onDelete={fetchColleges}
                        fetchAssignedBranches={fetchAssignedBranches}
                    />
                </>
            )}

            {activeTab === 'branches' && (
                <>
                    <BranchForm branchIdToUpdate={branchIdToUpdate} fetchBranches={fetchBranches} />
                    <BranchTable branches={branches} onEdit={setBranchIdToUpdate} onDelete={fetchBranches} />
                </>
            )}

            {activeTab === 'assignBranches' && (
                <AssignBranches colleges={colleges} branches={branches} fetchAssignedBranches={fetchAssignedBranches} />
            )}
        </div>
    );
};

export default CollegeBranchManager;
