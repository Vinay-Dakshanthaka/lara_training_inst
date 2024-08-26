import React from 'react';
import { Carousel, Image, Container } from 'react-bootstrap';
import './recruitersCarousel.css'; // For custom styles

const RecruitersCarousel = () => {
  // Create an array with numbers from 1 to 42
  const images = Array.from({ length: 42 }, (_, i) => i + 1);

  // Split the images into chunks of 6 for each carousel item
  const chunkedImages = [];
  for (let i = 0; i < images.length; i += 6) {
    chunkedImages.push(images.slice(i, i + 6));
  }

  return (
  <section className="my-5">
    <h2 className="text-info text-center">Our Recruiting Partners</h2>
      <Container className="my-2">
      <Carousel>
        {chunkedImages.map((chunk, idx) => (
          <Carousel.Item key={idx}>
            <div className="d-flex justify-content-center">
              {chunk.map((num) => (
                <Image
                  key={num}
                  src={require(`./recruiters/${num}.jpg`)} // Adjust the path as per your structure
                  alt={`Recruiter ${num}`}
                  className="recruiter-img"
                />
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </Container>
  </section>
  );
};

export default RecruitersCarousel;
