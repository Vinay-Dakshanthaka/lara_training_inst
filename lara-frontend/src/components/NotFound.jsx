import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './notFound.css'

const NotFound = () => {
    return (
        <div className="not-found-container text-center mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h1 className="not-found-display-1 text-danger">404</h1>
                    <h2 className="mb-4">Oops! Page not found</h2>
                    <p className="lead mb-4">
                        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
