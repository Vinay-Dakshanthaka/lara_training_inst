import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './notFound.css'

const TestNotActiveYet = () => {
    return (
        <div className="not-found-container text-center mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h1 className="not-found-display-1 text-danger">Test wil be available at the scheduled time</h1>
                    <h2 className="mb-4">The Test is Not Active yet</h2>
                    
                </div>
            </div>
        </div>
    );
};

export default TestNotActiveYet;
