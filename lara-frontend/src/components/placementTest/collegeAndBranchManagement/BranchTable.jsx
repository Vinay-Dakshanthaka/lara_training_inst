import React from 'react';

const BranchTable = ({ branches, onEdit, onDelete }) => {
    return (
        <table>
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
                            <button onClick={() => onEdit(branch)}>Edit</button>
                            <button onClick={() => onDelete(branch.branch_id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default BranchTable;
