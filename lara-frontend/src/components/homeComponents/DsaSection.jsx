import React from 'react';
import './dsaSection.css';
import dsaImage from './hierarchical-structure.png'; // Replace with your image path
import networkGif from './brandImages/network.gif'

const DsaSection = () => {
  return (
    <section className=" text-light py-6 my-3">
      <div className="container py-md-6">
        <div className="row align-items-center">
          
          {/* Text Section */}
          <div className="col-lg-7">
            <div className="lc-block mb-5">
              <h3 className="text-warning">
              <img src={networkGif} alt='bullet' width={50} height={50}/>
                Master Data Structures & Algorithms (DSA)</h3>
              <p className='lead'>
                Our DSA course is designed to help you become proficient in solving complex problems. With over 100+ LeetCode problems from easy, medium, and hard categories, you’ll gain the skills needed to excel in coding interviews.
              </p>
            </div>

            <div className="lc-block mb-4">
              <div className="d-inline-flex">
                <div className="ms-2 align-self-center">
                  <h5>
                    Comprehensive Coverage</h5>
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
          
          {/* Image Section */}
          <div className="col-lg-5">
            <div className="lc-block">
              <img className="img-fluid mx-auto" src={dsaImage} alt="DSA Classes" width="640" />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default DsaSection;
