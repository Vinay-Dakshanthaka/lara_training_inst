import React from 'react';
import './heroSectionNew.css';

const HeroSectionNew = () => {
  return (
    <section className="">
      <div className="container col-xxl-8  py-3">
        <div className="row flex-lg-row-reverse align-items-center g-5 py-2">
          <div className="col-10 col-sm-8 col-lg-6">
            <img 
              src="https://cdn.livecanvas.com/media/svg/pixeltrue/blogging.svg" 
              className="d-block mx-lg-auto img-fluid" 
              alt="Java Full Stack Training" 
              loading="lazy" 
              width="640" 
            />
            
          </div>
          <div className="col-lg-6">
            <div className="lc-block mb-3">
              <p className='display-6 font-weight-bold text-info'> Want to become a Java Full Stack Developer, then join</p>
              <h1 className="fw-bold display-2 text-warning" >Lara&nbsp;Technologies</h1>
            </div>
            <div className="lc-block mb-5">
              <p className="lead text-muted">
              leading institute in Java Full Stack training, join and accelerate your career with expert-led courses and real-world projects.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSectionNew;
