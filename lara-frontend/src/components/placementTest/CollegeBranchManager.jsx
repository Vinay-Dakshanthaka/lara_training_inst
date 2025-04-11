import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseURL } from '../config';

const CollegeBranchManager = () => {
    const [activeTab, setActiveTab] = useState('colleges');

    const [colleges, setColleges] = useState([]);
    const [branches, setBranches] = useState([]);
    const [assignedBranches, setAssignedBranches] = useState([]);

    const [collegeName, setCollegeName] = useState('');
    const [collegeIdToUpdate, setCollegeIdToUpdate] = useState(null);

    const [branchName, setBranchName] = useState('');
    const [branchIdToUpdate, setBranchIdToUpdate] = useState(null);

    // === API Calls ===
    const fetchColleges = async () => {
        const res = await axios.get(`${baseURL}/api/placement-test/getAllColleges`);
        setColleges(res.data);
    };

    const fetchBranches = async () => {
        const res = await axios.get(`${baseURL}/api/placement-test/getAllBranches`);
        setBranches(res.data);
    };

    const fetchAssignedBranches = async (college_id) => {
        const res = await axios.get(`${baseURL}/api/placement-test/getAssignedBranchesToCollege/${college_id}`);
        setAssignedBranches(res.data);
    };

    useEffect(() => {
        fetchColleges();
        fetchBranches();
    }, []);

    // === College Handlers ===
    const handleCollegeSubmit = async (e) => {
        e.preventDefault();
        try {
            if (collegeIdToUpdate) {
                await axios.put(`${baseURL}/api/placement-test/updateCollege/${collegeIdToUpdate}`, { college_name: collegeName });
                toast.success('Updated Successfully');
            } else {
                await axios.post(`${baseURL}/api/placement-test/createCollege`, { college_name: collegeName });
                toast.success('Added Successfully');
            }
            setCollegeName('');
            setCollegeIdToUpdate(null);
            fetchColleges();
        } catch (error) {
            console.error('error while updating or creating college name ', error);
            toast.error("Error while modifying college name");
        }
    };

    const handleEditCollege = (college) => {
        setCollegeName(college.college_name);
        setCollegeIdToUpdate(college.college_id);
    };

    const handleDeleteCollege = async (id) => {
        await axios.delete(`${baseURL}/api/placement-test/deleteCollege/${id}`);
        fetchColleges();
    };

    // === Branch Handlers ===
    const handleBranchSubmit = async (e) => {
        e.preventDefault();
        try {
            if (branchIdToUpdate) {
                await axios.put(`${baseURL}/api/placement-test/updateBranch/${branchIdToUpdate}`, { branch_name: branchName });
                toast.success('Updated Successfully');
            } else {
                await axios.post(`${baseURL}/api/placement-test/createBranch`, { branch_name: branchName });
                toast.success('Added Successfully');
            }
            setBranchName('');
            setBranchIdToUpdate(null);
            fetchBranches();
        } catch (error) {
            console.error("Error while updating or saving Branch ", error);
            toast.error('Something went wrong');
        }
    };

    const handleEditBranch = (branch) => {
        setBranchName(branch.branch_name);
        setBranchIdToUpdate(branch.branch_id);
    };

    const handleDeleteBranch = async (id) => {
        await axios.delete(`${baseURL}/api/placement-test/deleteBranch/${id}`);
        fetchBranches();
    };

    // === Assign Branches to College ===
    const handleAssignBranchesToCollege = async (e) => {
        e.preventDefault();
        try {
            const selectedBranchIds = assignedBranches.map(branch => branch.branch_id);
            await axios.post(`${baseURL}/api/placement-test/assignBranchesToCollegeNoTestId`, {
                college_id: collegeIdToUpdate,
                branch_ids: selectedBranchIds
            });
            toast.success('Branches assigned to college successfully');
        } catch (error) {
            console.error('Error while assigning branches to college', error);
            toast.error('Error while assigning branches');
        }
    };

    const handleToggleBranchSelection = (branch) => {
        const isSelected = assignedBranches.some(b => b.branch_id === branch.branch_id);
        if (isSelected) {
            setAssignedBranches(assignedBranches.filter(b => b.branch_id !== branch.branch_id));
        } else {
            setAssignedBranches([...assignedBranches, branch]);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">College & Branch Management</h2>

            {/* Tabs */}
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'colleges' ? 'active' : ''}`} onClick={() => setActiveTab('colleges')}>
                        Colleges
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'branches' ? 'active' : ''}`} onClick={() => setActiveTab('branches')}>
                        Branches
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'assignBranches' ? 'active' : ''}`} onClick={() => setActiveTab('assignBranches')}>
                        Assign Branches to College
                    </button>
                </li>
            </ul>

            {/* === College Form === */}
            {activeTab === 'colleges' && (
                <>
                    <form onSubmit={handleCollegeSubmit} className="mb-3 row g-3">
                        <div className="col-md-8">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="College Name"
                                value={collegeName}
                                onChange={(e) => setCollegeName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <button className="btn btn-primary w-100">{collegeIdToUpdate ? 'Update College' : 'Add College'}</button>
                        </div>
                    </form>

                    {/* College Table */}
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {colleges.map((college) => (
                                    <tr key={college.college_id}>
                                        <td>{college.college_id}</td>
                                        <td>{college.college_name}</td>
                                        <td>
                                            <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditCollege(college)}>Edit</button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteCollege(college.college_id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* === Branch Form === */}
            {activeTab === 'branches' && (
                <>
                    <form onSubmit={handleBranchSubmit} className="mb-3 row g-3">
                        <div className="col-md-8">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Branch Name"
                                value={branchName}
                                onChange={(e) => setBranchName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <button className="btn btn-primary w-100">{branchIdToUpdate ? 'Update Branch' : 'Add Branch'}</button>
                        </div>
                    </form>

                    {/* Branch Table */}
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {branches.map((branch) => (
                                    <tr key={branch.branch_id}>
                                        <td>{branch.branch_id}</td>
                                        <td>{branch.branch_name}</td>
                                        <td>
                                            <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditBranch(branch)}>Edit</button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteBranch(branch.branch_id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* === Assign Branches to College === */}
            {activeTab === 'assignBranches' && (
                <>
                    <form onSubmit={handleAssignBranchesToCollege} className="mb-3 row g-3">
                        <div className="col-md-8">
                            <select
                                className="form-select"
                                value={assignedBranches.map(b => b.branch_id)}
                                onChange={(e) => handleToggleBranchSelection(e.target.value)}
                                multiple
                            >
                                {branches.map((branch) => (
                                    <option key={branch.branch_id} value={branch.branch_id}>{branch.branch_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <button className="btn btn-primary w-100">Assign Branches</button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default CollegeBranchManager;
