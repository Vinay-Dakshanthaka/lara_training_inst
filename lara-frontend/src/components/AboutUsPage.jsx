// import React, { useEffect, useState } from 'react';
// import { Card, Container, Row, Col } from 'react-bootstrap';

// const AboutUsPage = () => {
//   return (
//     <>

//     <Container className='mt-5'>
//     <h2 className="text-center mb-4">About Lara Technologies</h2>
//     <h4 className="text-center mb-4">Its not just an Institute... Its not just a placement agency...</h4>
//     <h4 className="text-center mb-4">Its more than a University... Its more than a Company...</h4>

//     <Container className="mt-5">
//       <h2 className="text-center mb-5">Lara's Vision and Mission</h2>
//       <Row xs={1} md={2} className="g-4">
//         <Col>
//           <Card className="h-100 shadow-sm" style={{ backgroundColor: "#9cc3b2" }}>
//             <Card.Body>
//               <Card.Title className="text-center">Coaching Excellence, Building Futures</Card.Title>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col>
//           <Card className="h-100 shadow-sm" style={{ backgroundColor: "#9cc3b2" }}>
//             <Card.Body>
//               <Card.Title className="text-center">Focused Coaching, Lasting Achievements</Card.Title>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col>
//           <Card className="h-100 shadow-sm" style={{ backgroundColor: "#9cc3b2" }}>
//             <Card.Body>
//               <Card.Title className="text-center">Practical Knowledge, Real-world Impact</Card.Title>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col>
//           <Card className="h-100 shadow-sm" style={{ backgroundColor: "#9cc3b2" }}>
//             <Card.Body>
//               <Card.Title className="text-center">Striving for Excellence, Shaping Careers</Card.Title>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>

//     <div className="container mt-5" >
//       <h2 className="text-center mb-4">Four Pillars to Every Learner</h2>
//       <div className="row">
//         <div className="col-lg-3 col-md-6 mb-4">
//           <div className="card h-100 shadow-sm" style={{ backgroundColor: "#adacfe" }}>
//             <div className="card-body">
//               <h4 className="card-title text-center">Technical Skills</h4>
//               <p className="card-text">
//                 Develop proficiency in programming languages, tools, and technologies relevant to your field of study or career path.
//               </p>
//             </div>
//           </div>
//         </div>
//         <div className="col-lg-3 col-md-6 mb-4">
//           <div className="card h-100 shadow-sm" style={{ backgroundColor: "#adacfe" }}>
//             <div className="card-body">
//               <h4 className="card-title text-center">Aptitude and Reasoning</h4>
//               <p className="card-text">
//                 Enhance problem-solving abilities, logical reasoning, and critical thinking skills to tackle challenges effectively.
//               </p>
//             </div>
//           </div>
//         </div>
//         <div className="col-lg-3 col-md-6 mb-4">
//           <div className="card h-100 shadow-sm" style={{ backgroundColor: "#adacfe" }}>
//             <div className="card-body">
//               <h4 className="card-title text-center">Soft Skills</h4>
//               <p className="card-text">
//                 Develop communication, teamwork, leadership, and time management skills to excel in both professional and personal life.
//               </p>
//             </div>
//           </div>
//         </div>
//         <div className="col-lg-3 col-md-6 mb-4">
//           <div className="card h-100 shadow-sm" style={{ backgroundColor: "#adacfe" }}>
//             <div className="card-body">
//               <h4 className="card-title text-center">Internship</h4>
//               <p className="card-text">
//                 Gain practical experience and exposure by working on real-world projects through internships and industry collaborations.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//     </Container>
//     </>
//   )
// }

// export default AboutUsPage

import React from 'react';
import { motion } from 'framer-motion';
import './aboutUs.css';
import RecruitersCarousel from './homeComponents/RecruitersCarousel';

const AboutUsPage = () => {
  // Framer Motion animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <>
      <section className="about-us py-5" style={{ color: '#6600FF' }}>
        <div className="container">
          {/* Title with motion effect */}
          <motion.h2
            className="text-center mb-4 display-4 fw-bold"
            style={{ color: '#FF6A00' }} // Gold color for heading
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            About Lara Technologies
          </motion.h2>

          {/* Subheading with motion effect */}
          <motion.p
            className="display-6 text-center mb-5 fw-300"
            style={{ color: '#6600FF' }}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            Accelerate your career with expert-led Java Full Stack training at Lara Technologies.
          </motion.p>

          {/* Highlights Section */}
          <div className="highlights row mb-5">
            {[
              { title: 'Since 2005', text: 'Lara Technologies has been a leader in Java Full Stack training for nearly two decades, providing unparalleled education and mentorship to budding software developers worldwide.' },
              { title: '100,000+ Students Trained', text: 'With a proven track record, we have successfully empowered over 100,000 students with the skills and confidence to excel in the dynamic tech landscape.' },
              { title: '250+ Batches Completed', text: 'Our comprehensive and structured programs ensure practical experience and mastery, with more than 250 batches completed to date.' },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="col-md-4 mb-4"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <div className="highlight-item p-4" style={{ backgroundColor: '#fff', color: '#6600FF', borderRadius: '8px', height:'220px' }}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Courses Section */}
          <div className="more-info">
          <div className="courses mb-5">
            <motion.h3
              className="text-center mb-4 display-5 fw-bold"
              style={{ color: '#FF6A00' }} 
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              Master Data Structures & Algorithms (DSA)
            </motion.h3>
            <motion.p
              style={{ color: '#fff' }}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className='lead'
            >
              Dive deep into Data Structures and Algorithms with our hands-on DSA course, solving over 100 LeetCode problems. This course is designed to equip you with a thorough understanding, preparing you for coding interviews and real-world challenges with confidence.
            </motion.p>
          </div>

          {/* Features Section */}
          <div className="features display-5 mb-5 fw-bold">
            <motion.h3
              className="text-center mb-4"
              style={{ color: '#FF6A00' }}
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              Flexible Learning & Robust LMS
            </motion.h3>
            <motion.p
              style={{ color: '#fff' }}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className='lead'
            >
              Enjoy the flexibility of online and offline learning formats with our state-of-the-art Learning Management System (LMS). Access over 600 hours of content, 15,000 MCQs, and participate in unlimited exams to hone your skills. We provide continuous support through weekly doubt-clearing sessions and personalized job application assistance.
            </motion.p>
          </div>
          </div>

          {/* Recruiters Carousel Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <RecruitersCarousel />
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default AboutUsPage;
