import React from 'react';
import { motion } from 'framer-motion';
import './dsaSection.css';
import dsaImage from './hierarchical-structure.png'; // Replace with your image path
import networkGif from './brandImages/network.gif';

// Define SVG animation variants
const svgVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const DsaSection = () => {
  return (
    <section className="text-light py-6 my-3">
      <div className="container py-md-6">
        <div className="row align-items-center">
          
          {/* Image Section */}
          <div className="col-lg-5 order-lg-1 position-relative">
            {/* Animated SVG behind the image */}
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 512"
              width="100%"  // Responsive width
              height="auto"  // Maintain aspect ratio
              variants={svgVariants}
              initial="hidden"
              animate="visible"
              className="d-block mx-lg-auto img-fluid position-absolute top-50 start-50 translate-middle"
              style={{ zIndex: 0 }} // Place SVG behind the image
            >
              {/* Example SVG Path */}
              <motion.path
                d="M320 0C143.7 0 0 143.7 0 320s143.7 320 320 320 320-143.7 320-320S496.3 0 320 0zm0 480c-88.4 0-160-71.6-160-160s71.6-160 160-160 160 71.6 160 160-71.6 160-160 160z"
                fill="#FF6A00"
                variants={svgVariants}
              />
            </motion.svg>

            <div className="lc-block position-relative" style={{ zIndex: 1 }}>
              <img className="img-fluid mx-auto d-block" src={dsaImage} alt="DSA Classes" width="640" />
            </div>
          </div>
          
          {/* Text Section */}
          <div className="col-lg-7 order-lg-2">
            <div className="lc-block mb-5">
              <h3 className="" style={{color:'#FF6A00'}}>
                <img src={networkGif} alt='bullet' width={50} height={50}/>
                Master Data Structures & Algorithms (DSA)
              </h3>
              <p className='lead'>
                Our DSA course is designed to help you become proficient in solving complex problems. With over 100+ LeetCode problems from easy, medium, and hard categories, you’ll gain the skills needed to excel in coding interviews.
              </p>
            </div>

            <div className="lc-block mb-4">
              <div className="d-inline-flex">
                <div className="ms-2 align-self-center">
                  <h5>Comprehensive Coverage</h5>
                  <p className="text-muted">
                    Our curriculum covers all major data structures and algorithms, ensuring you understand the underlying concepts and how to apply them in real-world scenarios.
                  </p>
                </div>
              </div>
            </div>

            <div className="lc-block">
              <div className="d-inline-flex">
                <div className="ms-2 align-self-center">
                  <h5>Practical Problem-Solving</h5>
                  <p className="text-muted">
                    With hands-on practice on 100+ LeetCode problems, you’ll be well-prepared for any coding challenge.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DsaSection;
