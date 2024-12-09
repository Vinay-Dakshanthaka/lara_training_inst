import React from 'react';
import './heroSectionNew.css';
import { motion } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import Announcement from './Announcement';

const HeroSectionNew = () => {
  const text2 = "Lara Technologies".split(" ");

  // Define animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const textVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const imageVariant = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  const svgVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  const imgVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, delay: 0.5 } },
  };

  return (
    <section className="bg-top-wave d-flex justify-content-center align-items-center">
      <div className="px-4 col-xxl-8 py-3 hero-container">
        {/* <Announcement /> */}
        <div className="table-responsive announcement-table">
          <table className="table  table-hover text-center">
            <tbody>
              <tr>
                <td>
                  <span className="bullet-icon">📅</span> New Batch
                </td>
                <td>Jan 17</td>
              </tr>
              <tr>
                <td>
                  <span className="bullet-icon">⏳</span> Duration
                </td>
                <td>4 Months</td>
              </tr>
              <tr>
                <td colSpan="2">
                  <span className="bullet-icon">💳</span> Monthly Easy Installments
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="row flex-lg-row-reverse align-items-center g-5 ">
          <motion.div
            className="col-12 col-sm-8 col-lg-6 position-relative d-flex justify-content-center align-items-center text-center svg-bg"
            variants={imageVariant}
            initial="hidden"
            animate="visible"
          >

            {/* Inline SVG Animation */}
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 512"
              width="80%"
              height="auto"
              variants={svgVariants}
              initial="hidden"
              animate="visible"
              className="d-block mx-lg-auto img-fluid position-relative"
            >
              {/* Example SVG Path */}
              <motion.path
                d="M320 0C143.7 0 0 143.7 0 320s143.7 320 320 320 320-143.7 320-320S496.3 0 320 0zm0 480c-88.4 0-160-71.6-160-160s71.6-160 160-160 160 71.6 160 160-71.6 160-160 160z"
                fill="#FF6A00"
                variants={svgVariants}
              />
            </motion.svg>

            {/* Fading In External SVG Image */}
            <motion.img
              src="https://cdn.livecanvas.com/media/svg/pixeltrue/blogging.svg"
              alt="Java Full Stack Training"
              className="d-block mx-lg-auto img-fluid position-absolute"
              style={{ width: '70%', height: 'auto', top: '0', left: '7' }}  // Adjust width and position
              variants={imgVariants}
              initial="hidden"
              animate="visible"
            />
          </motion.div>
          <div className="col-lg-6">
            <motion.div
              className="lc-block mb-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="display-6 font-weight-bold text-info" style={{ height: '150px' }}>
                <Typewriter
                  options={{
                    strings: [
                      "Master Java Full Stack Development and advance your career.",
                      "Learn Data Structures and Algorithms with real-world projects.",
                      "Join the best courses to become a coding expert!",
                    ],
                    autoStart: true,
                    loop: true,
                    pauseFor: 2500,
                    deleteSpeed: 30,
                  }}
                />
              </div>

              <h1 className="fw-bold display-2 text2">
                {text2.map((el, i) => (
                  <motion.span variants={textVariant} key={i}>
                    {el}{" "}
                  </motion.span>
                ))}
              </h1>
            </motion.div>
            <motion.div
              className="lc-block mb-5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <p className="fs-5 text-warning text-lead fw-bold">
                Leading institute in Java Full Stack training, join and accelerate your career with expert-led courses and real-world projects.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionNew;
