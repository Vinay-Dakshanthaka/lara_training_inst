import React from 'react';
import './discoverSection.css';

const DiscoverSection = () => {
  return (
    <section className="bg-light py-2 " id="discover">
      <div className="container py-lg-2">
        <div className="row ">
          
          <div className="col-md-4">
            <div className="lc-block mb-4 pb-3 text-center text-md-start">
              {/* Add an icon or image here if needed */}
            </div>
            <div className="lc-block mb-6 mb-md-0">
              <h2 className="h4">Since 2005</h2>
              <p className="lead">Lara Technologies has been a pioneer in Java Full Stack training <span style={{textDecoration:'underline dotted'}}>since 2005</span>, committed to providing top-quality education.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="lc-block mb-4 pb-3 text-center text-md-start">
              {/* Add an icon or image here if needed */}
            </div>
            <div className="lc-block mb-6 mb-md-0">
              <h2 className="h4">100,000+ Students Trained</h2>
              <p className="lead">Our institute has successfully trained <span style={{textDecoration:'underline dotted'}} >over 100,000</span> students, empowering them with the skills needed to excel in the tech industry.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="lc-block mb-4 pb-3 text-center text-md-start">
              {/* Add an icon or image here if needed */}
            </div>
            <div className="lc-block mb-6 mb-md-0">
              <h2 className="h4">250+ Batches Completed</h2>
              <p className="lead">With more than <span style={{textDecoration:'underline dotted'}}> 250 batches</span>  completed, our structured training programs ensure comprehensive learning and practical experience.</p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default DiscoverSection;
