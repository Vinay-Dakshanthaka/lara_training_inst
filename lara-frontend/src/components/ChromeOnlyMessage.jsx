import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ChromeOnlyMessage = () => {
    return (
        <div className="chrome-only-container text-center mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h1 className="chrome-warning-title text-warning">Unsupported Browser</h1>
                    <h2 className="mb-4">Please Use Google Chrome</h2>
                    <p className="lead mb-4">
                        This Test is optimized for Google Chrome and may not function correctly on other browsers. 
                        To ensure the best experience, please switch to or download Google Chrome.
                    </p>
                    <a
                        href="https://www.google.com/chrome/"
                        className="btn btn-primary btn-lg"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Download Google Chrome
                    </a>
                    <p className="mt-3">
                        Already using Chrome? <Link to="/">Go back to the homepage</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChromeOnlyMessage;
