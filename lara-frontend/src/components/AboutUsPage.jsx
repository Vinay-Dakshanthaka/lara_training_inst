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
import './aboutUs.css';
import RecruitersCarousel from './homeComponents/RecruitersCarousel';
// import CourseDetails from './homeComponents/CourseDetails';

const AboutUsPage = () => {
  return (
    <>
      {/* <CourseDetails /> */}

      <section className="about-us py-5">
        <div className="container">
          <h2 className="text-center mb-4 text-warning">About Lara Technologies</h2>
        <p className="lead text-center">Accelerate your career with expert-led Java Full Stack training at Lara Technologies.</p>

          <div className="highlights my-5">
            <div className="highlight-item">
              <h3 className="text-info">Since 2005</h3>
              <p>Lara Technologies has been a leader in Java Full Stack training for nearly two decades, offering top-quality education.</p>
            </div>
            <div className="highlight-item">
              <h3 className="text-info">100,000+ Students Trained</h3>
              <p>We have successfully trained over 100,000 students, equipping them with the skills to thrive in the tech industry.</p>
            </div>
            <div className="highlight-item">
              <h3 className="text-info">250+ Batches Completed</h3>
              <p>Our structured programs ensure comprehensive learning and practical experience, with over 250 batches completed.</p>
            </div>
          </div>

          <div className="courses my-5">
            <h3 className="text-center mb-4">Master Data Structures & Algorithms (DSA)</h3>
            <p>Our DSA course offers hands-on practice with 100+ LeetCode problems, preparing you for coding interviews with in-depth knowledge of data structures and algorithms.</p>
          </div>

          <div className="features my-5">
            <h3 className="text-center mb-4">Flexible Learning & Robust LMS</h3>
            <p>Choose between online and offline formats, with access to 600 hours of content, 15,000 MCQs, and unlimited exams. We offer ongoing support with weekly doubt-clearing sessions and job application assistance.</p>
          </div>

          <RecruitersCarousel />

        </div>
      </section>
    </>
  );
};

export default AboutUsPage;
