import React, { useEffect } from 'react';
import { Container, Carousel } from 'react-bootstrap';
import company1 from './brandImages/1.jpg';
import company2 from './brandImages/2.jpg';
import company3 from './brandImages/3.jpg';
import company4 from './brandImages/4.jpg';
import company5 from './brandImages/5.jpg';

const CompaniesCarousel = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      const carouselInner = document.querySelector('.carousel-inner');
      if (carouselInner) {
        carouselInner.style.transition = 'transform 1s ease-in-out';
        carouselInner.style.transform = 'translateX(-25%)'; // Adjust the translation distance
        setTimeout(() => {
          const firstItem = carouselInner.firstElementChild;
          carouselInner.appendChild(firstItem);
          carouselInner.style.transition = 'none';
          carouselInner.style.transform = 'translateX(0)';
        }, 1000);
      }
    }, 3000); // Increase the interval to 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Container className="mt-5" style={{ width: '80%' }}> {/* Set the width to 80% */}
      <h2 className="text-center mb-4">Brands</h2>
      <div className="d-flex overflow-hidden"> {/* Use Flexbox and overflow to achieve horizontal scrolling */}
        <Carousel
          indicators={false}
          pause={false}
          interval={null}
          wrap={false}
          className="d-flex justify-content-start align-items-center"
        >
          <Carousel.Item>
            <img src={company1} alt="Brand 1" className="img-fluid mx-auto d-block" style={{ maxHeight: '100px', width: 'auto' }} /> {/* Adjusted the width style */}
          </Carousel.Item>
          <Carousel.Item>
            <img src={company2} alt="Brand 2" className="img-fluid mx-auto d-block" style={{ maxHeight: '100px', width: 'auto' }} />
          </Carousel.Item>
          <Carousel.Item>
            <img src={company3} alt="Brand 3" className="img-fluid mx-auto d-block" style={{ maxHeight: '100px', width: 'auto' }} />
          </Carousel.Item>
          <Carousel.Item>
            <img src={company4} alt="Brand 4" className="img-fluid mx-auto d-block" style={{ maxHeight: '100px', width: 'auto' }} />
          </Carousel.Item>
          <Carousel.Item>
            <img src={company5} alt="Brand 5" className="img-fluid mx-auto d-block" style={{ maxHeight: '100px', width: 'auto' }} />
          </Carousel.Item>
        </Carousel>
      </div>
    </Container>
  );
};

export default CompaniesCarousel;
