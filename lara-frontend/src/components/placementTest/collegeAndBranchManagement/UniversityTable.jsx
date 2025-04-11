import React from 'react';

const UniversityTable = ({ universities, onEdit, onDelete }) => {
    return (
        <table className="table table-bordered table-hover table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>University Name</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {universities.map((uni) => (
                    <tr key={uni.university_id}>
                        <td>{uni.university_id}</td>
                        <td>{uni.university_name}</td>
                        <td>
                            <button className="btn btn-warning mx-2" onClick={() => onEdit(uni)}>
                                Edit
                            </button>
                            <button className="btn btn-danger" onClick={() => onDelete(uni.university_id)}>
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default UniversityTable;
