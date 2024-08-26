import React from 'react';

const CourseDetails = () => {
    const courseDetails = {
        title: 'Unlock Your Potential in Java Fullstack Development',
        subtitle: 'Master the skills and knowledge needed to thrive in the dynamic realm of Java technologies',
        duration: '3 months',
        courseHours: '300',
        prerequisites: 'No Prerequisites',
        skills1: [
            'Core Java',
            'SQL',
            'Data Structures and Algorithms',
            'JavaScript',
            'Angular',
            'Rest WebServices'
        ],
        skills2: [
            'Spring Core',
            'Spring Boot',
            'Spring Data JPA',
            'Spring Security',
            'Spring MicroServices'
        ]
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-8 text-center mb-5">
                    <h1 className="display-4 font-weight-bold text-info">{courseDetails.title}</h1>
                    <p className="lead text-secondary">{courseDetails.subtitle}</p>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-12 bg-transparent shadow-lg rounded-lg p-5">
                    <h2 className="h4 font-weight-bold text-primary mb-4 text-center">Course Overview</h2>
                    <div className="row">
                        <div className="row text-center">
                            <p className="text-secondary mb-4 col-4">
                                <strong>Duration:</strong> {courseDetails.duration}
                            </p>
                            <p className="text-secondary mb-4 col-4">
                                <strong>Course Hours:</strong> {courseDetails.courseHours}
                            </p>
                            <p className="text-secondary mb-4 col-4">
                                <strong>Prerequisites:</strong> {courseDetails.prerequisites}
                            </p>
                        </div>
                    </div>

                    <h3 className="h5 font-weight-bold text-primary mb-4">Skills You Will Learn</h3>
                    <div className="row">

                    <ul className="list-group list-group-flush col-6">
                        {courseDetails.skills1.map((skill, index) => (
                            <li key={index} className="list-group-item">{skill}</li>
                        ))}
                    </ul>
                    <ul className="list-group list-group-flush col-6">
                        {courseDetails.skills2.map((skill, index) => (
                            <li key={index} className="list-group-item">{skill}</li>
                        ))}
                    </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;