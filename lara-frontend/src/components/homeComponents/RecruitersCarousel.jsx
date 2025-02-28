import React from "react";
import { Carousel, Image, Container } from "react-bootstrap";
import "./recruitersCarousel.css"; // For custom styles

const images = import.meta.glob("./recruiters/*.jpg", { eager: true });

const RecruitersCarousel = () => {
  // Convert images object keys into an array of image URLs
  const imageUrls = Object.values(images).map((img) => img.default);

  // Split images into chunks of 6 for each carousel item
  const chunkedImages = [];
  for (let i = 0; i < imageUrls.length; i += 6) {
    chunkedImages.push(imageUrls.slice(i, i + 6));
  }

  return (
    <section className="my-5">
      <h2 className="text-center" style={{ color: "#FF6A00" }}>
        Our Recruiting Partners
      </h2>
      <Container className="my-2">
        <Carousel>
          {chunkedImages.map((chunk, idx) => (
            <Carousel.Item key={idx}>
              <div className="d-flex justify-content-center">
                {chunk.map((imgSrc, num) => (
                  <Image
                    key={num}
                    src={imgSrc}
                    alt={`Recruiter ${num + 1}`}
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
