import React from 'react'
import HeroSectionNew from './homeComponents/HeroSectionNew';
import DiscoverSection from './homeComponents/DiscoverSection';
import FeaturesSection from './homeComponents/FeaturesSection';
import DsaSection from './homeComponents/DsaSection';
import RecruitersCarousel from './homeComponents/RecruitersCarousel';
import CourseDetails from './homeComponents/CourseDetails';

const Home = () => {
  return (
    <>
    {/* <img src={blogging} alt="blogging" /> */}
     {/* <HeroSection /> */}
     <HeroSectionNew />
     <CourseDetails />
    <DiscoverSection />
    <FeaturesSection />
    <DsaSection />
    <RecruitersCarousel />
    </>
  )
}

export default Home;