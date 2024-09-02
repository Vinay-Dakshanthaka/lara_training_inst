import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './courseDetails.css'
import { FaCheckCircle } from 'react-icons/fa';

const CourseDetails = () => {
    const courseDetails = {
        title: 'Enhance Your Skills with Our Java Fullstack Development Course',
        subtitle:
            'Develop core competencies and advanced techniques in Java technologies and frameworks. Learn from the basics to advanced topics and transform yourself into a full-fledged developer.',
        duration: '3 months',
        courseHours: '300',
        prerequisites: 'No Prerequisites',
        skills1: [
            'Core Java',
            'SQL',
            'Data Structures and Algorithms',
            'JavaScript',
            'Angular',
            'Rest WebServices',
        ],
        skills2: [
            'Spring Core',
            'Spring Boot',
            'Spring Data JPA',
            'Spring Security',
            'Spring MicroServices',
        ],
    };

    // Track the scroll progress
    const { scrollYProgress } = useScroll();

    // Adjust the scale based on the scroll progress
    const scale = useTransform(scrollYProgress, [0.1, 0.5], [0.8, 1]);

    // State for managing current visible skill
    const [currentSkillIndex, setCurrentSkillIndex] = useState(0);

    // Combine both skill lists
    const combinedSkills = [...courseDetails.skills1, ...courseDetails.skills2];

    // UseEffect to cycle through skills
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSkillIndex((prevIndex) => (prevIndex + 1) % combinedSkills.length);
        }, 2000); // Change skill every 1 second

        return () => clearInterval(interval);
    }, [combinedSkills.length]);

    return (
        <div className="course-details">
            <div className="row justify-content-center py-5">
                {/* Motion Title with fade and slide-up effect */}
                <motion.div
                    className="col-lg-8 text-center mb-4"
                    initial={{ opacity: 0, y: 50 }} // Start below and invisible
                    animate={{ opacity: 1, y: 0 }} // Animate to visible and its position
                    transition={{ duration: 0.8, ease: 'easeOut' }} // Smooth transition
                >
                    <h1 className="display-4 fw-bolder " style={{color:'#FF6A00'}}>{courseDetails.title}</h1>

                    {/* Motion Subtitle with fade and slide-up effect */}
                    <motion.p
                        className="h4 text-primary fw-bold"
                        initial={{ opacity: 0, y: 30 }} // Start slightly below and invisible
                        animate={{ opacity: 1, y: 0 }} // Animate to visible and its position
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }} // Slight delay for better effect
                    >
                        {courseDetails.subtitle}
                    </motion.p>
                </motion.div>
            </div>

            {/* Animated skill above the card */}
            <div className='row text-center'>
                <h4 className='h4 display-5 text-warning fw-bold'>You will master:</h4>
                <motion.div
                    className="text-center mt-4"
                    key={combinedSkills[currentSkillIndex]}
                    initial={{ opacity: 0, y: 20 }} // Start slightly below and invisible
                    animate={{ opacity: 1, y: 0 }} // Fade in and slide up
                    exit={{ opacity: 0, y: -20 }} // Fade out and slide up
                    transition={{ duration: 0.6 }} // Smooth transition
                >
                    <h4 className="display-5 fw-bold" style={{ color: "#6600FF" }}> {combinedSkills[currentSkillIndex]}</h4>
                </motion.div>
            </div>

            {/* Motion card with scale effect */}
            <motion.div
                className="row justify-content-center mt-5"
                style={{ scale }} // Apply scale dynamically
            >
                <div className="col-lg-12  shadow-lg rounded-lg p-4 course-card">
                    <h2 className="display-4 fw-bold text-warning mb-4 text-center">Course Overview</h2>
                    <div className="row text-center">
                        <p className="text-warning mb-4 col-4">
                            <strong>Duration:</strong> {courseDetails.duration}
                        </p>
                        <p className="text-warning mb-4 col-4">
                            <strong>Course Hours:</strong> {courseDetails.courseHours}
                        </p>
                        <p className="text-warning mb-4 col-4">
                            <strong>Prerequisites:</strong> {courseDetails.prerequisites}
                        </p>
                    </div>

                    <h3 className="fs-4  font-weight-bold text-white mb-4 text-center">Skills You Will Learn</h3>

                    <div className="row">
                        {combinedSkills.map((skill, index) => (
                            <div key={index} className="col-md-4 mb-3 d-flex align-items-stretch">
                                <div className="skill-item list-group-item d-flex fs-5 align-items-center justify-content-start">
                                    <FaCheckCircle className="text-info me-2" /> {/* Bootstrap or React icon */}
                                    <span className="text-white fw-bold">{skill}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CourseDetails;
