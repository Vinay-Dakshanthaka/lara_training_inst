import React from 'react';
import './featuresSection.css';
import chatbotImage from '../chatbot.svg'; // Replace with your image path

const FeaturesSection = () => {
  return (
    <section className="bg-light py-6 my-5">
      <div className="container py-md-6">
        <div className="row align-items-center">
          
          {/* Text Section */}
          <div className="col-lg-5">
            <div className="lc-block mb-5">
              <h3 className="text-warning">Flexible Learning: Available in both online and offline formats with up to 50% discounts.</h3>
              <p className='lead'>
                Our courses are designed to fit your schedule, whether you prefer online or offline learning. Take advantage of our discounts and start your journey today!
              </p>
            </div>

            <div className="lc-block mb-4">
              <div className="d-inline-flex">
                <div className="ms-2 align-self-center">
                  <h5>Robust LMS</h5>
                  <p className="text-muted">
                    Access <a href="https://lara.co.in" target="_blank" rel="noopener noreferrer">600 hours of content through our LMS platform</a>, 15,000 MCQ questions, and unlimited exams and reviews to prepare yourself thoroughly.
                  </p>
                </div>
              </div>
            </div>

            <div className="lc-block">
              <div className="d-inline-flex">
                <div className="ms-2 align-self-center">
                  <h5>Continuous Support</h5>
                  <p className="text-muted">
                    Benefit from weekly doubt clearing sessions, FB and WhatsApp groups, and ongoing job application support until you get placed.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Image Section */}
          <div className="col-lg-7">
            <div className="lc-block">
              <img className="img-fluid mx-auto" src={chatbotImage} alt="LMS and Support" width="640" />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
