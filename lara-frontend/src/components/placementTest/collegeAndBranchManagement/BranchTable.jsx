import React from 'react';

const BranchTable = ({ branches, onEdit, onDelete }) => {
    return (
        <table className="table table-striped table-bordered table-hover table-responsive">
            <thead>
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
                            <button onClick={() => onEdit(branch)} className='btn btn-warning mx-2'>Edit</button>
                            <button onClick={() => onDelete(branch.branch_id)} className='btn btn-danger'>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default BranchTable;
