import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './discoverSection.css';

const DiscoverSection = () => {
  const [counter2005, setCounter2005] = useState(0);
  const [counter100k, setCounter100k] = useState(0);
  const [counter250, setCounter250] = useState(0);

  const animateCounters = () => {
    const duration = 2000; // 2 seconds
    const steps2005 = 2005;
    const steps100k = 100000;
    const steps250 = 250;

    const interval2005 = duration / steps2005;
    const interval100k = duration / steps100k;
    const interval250 = duration / steps250;

    let count2005 = 0;
    let count100k = 0;
    let count250 = 0;

    const timer2005 = setInterval(() => {
      count2005 += 5;
      setCounter2005(count2005);
      if (count2005 >= steps2005) clearInterval(timer2005);
    }, interval2005);

    const timer100k = setInterval(() => {
      count100k += 100;
      setCounter100k(count100k);
      if (count100k >= steps100k) clearInterval(timer100k);
    }, interval100k);

    const timer250 = setInterval(() => {
      count250 += 1;
      setCounter250(count250);
      if (count250 >= steps250) clearInterval(timer250);
    }, interval250);
  };

  useEffect(() => {
    animateCounters();
  }, []);

  return (
    <motion.section
      className="discover-section bg-light py-5"
      id="discover"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="container py-lg-4">
        <div className="row">
          {/* First column */}
          <div className="col-md-4">
            <motion.div
              className="card text-center mb-4"
              whileHover={{ scale: 1.05, boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)' }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <div className="card-body">
                <h2 className="card-title display-4">{counter2005}</h2>
                <p className="card-text">
                  Lara Technologies has been a pioneer in Java Full Stack training{' '}
                  <span className="highlight-text">since 2005</span>, committed to providing top-quality education.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Second column */}
          <div className="col-md-4">
            <motion.div
              className="card text-center mb-4"
              whileHover={{ scale: 1.05, boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)' }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <div className="card-body">
                <h2 className="card-title display-4">{counter100k.toLocaleString()}+</h2>
                <p className="card-text">
                  Our institute has successfully trained{' '}
                  <span className="highlight-text">over 1,00,000</span> students, empowering them with the skills needed
                  to excel in the tech industry.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Third column */}
          <div className="col-md-4">
            <motion.div
              className="card text-center mb-4"
              whileHover={{ scale: 1.05, boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)' }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <div className="card-body">
                <h2 className="card-title display-4">{counter250}+</h2>
                <p className="card-text">
                  With more than <span className="highlight-text">250 batches</span> completed, our structured training
                  programs ensure comprehensive learning and practical experience.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default DiscoverSection;
