import React from 'react';
import { motion } from 'framer-motion';
import HeroSectionNew from './homeComponents/HeroSectionNew';
import DiscoverSection from './homeComponents/DiscoverSection';
import FeaturesSection from './homeComponents/FeaturesSection';
import DsaSection from './homeComponents/DsaSection';
import RecruitersCarousel from './homeComponents/RecruitersCarousel';
import CourseDetails from './homeComponents/CourseDetails';
import './home.css'
import PlacementTestStudentResults from './student/PlacementTestStudentResults';

const Home = () => {
  // Define animation variants for the sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 }, // Initial state: invisible and slightly below the viewport
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 } // Animate to visible state over 0.6 seconds
    },
  };

  return (
    <>
      {/* <PlacementTestStudentResults />  */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }} // Trigger animation when 20% of the component is in the viewport
      >
        <HeroSectionNew />
      </motion.div>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <CourseDetails />
      </motion.div>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <DiscoverSection />
      </motion.div>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <FeaturesSection />
      </motion.div>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <DsaSection />
      </motion.div>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <RecruitersCarousel />
      </motion.div>
    </>
  );
}

export default Home;
