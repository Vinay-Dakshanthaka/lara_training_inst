import React, { useEffect, useState } from 'react';

const CollegeTable = ({ colleges, assignedBranches, onEdit, onDelete, fetchAssignedBranches }) => {
    useEffect(() => {
        colleges.forEach(college => {
            if (!assignedBranches[college.college_id]) {
                fetchAssignedBranches(college.college_id);
            }
        });
    }, [colleges, assignedBranches, fetchAssignedBranches]);

    return (
        <table className="table table-striped table-bordered table-hover table-responsive">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Assigned Branches</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {colleges.map((college) => (
                    <tr key={college.college_id}>
                        <td>{college.college_id}</td>
                        <td>{college.college_name}</td>
                        <td>
                            {assignedBranches[college.college_id] ? (
                                assignedBranches[college.college_id].map((branch) => (
                                    <span key={branch.branch_id} className="badge bg-info m-1">
                                        {branch.branch_name}
                                    </span>
                                ))
                            ) : (
                                <span>No branches assigned</span>
                            )}
                        </td>
                        <td>
                            <button className="btn btn-warning mx-2" onClick={() => onEdit(college)}>
                                Edit
                            </button>
                            <button className="btn btn-danger" onClick={() => onDelete(college.college_id)}>
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default CollegeTable;
