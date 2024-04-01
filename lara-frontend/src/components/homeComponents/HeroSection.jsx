  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import { Container, Row, Col, ListGroup } from 'react-bootstrap';
  import defaultProfileImage from "../default-profile.png";
  import { baseURL } from '../config';

  const HeroSection = () => {
    const [homeContent, setHomeContent] = useState(null);
    const [bestPerformer, setBestPerformer] = useState(null);
    const [image, setImage] = useState(null);

    useEffect(() => {
      fetchHomeContent();
      fetchBestPerformer();
    }, []);

    const fetchHomeContent = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/student/fetchHomeContent`);
        const data = response.data[0];
        setHomeContent(data);
      } catch (error) {
        console.error('Error fetching home content:', error);
      }
    };

    const fetchBestPerformer = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/student/getBestPerformerByDate`);
        const data = response.data;
        console.log(" data : ", data)
        setBestPerformer(data);
        fetchProfileImage(data.student.id);
      } catch (error) {
        console.error('Error fetching best performer:', error);
      }
    };
    
    const fetchProfileImage = async (id) => {
      try {
        const response = await axios.post(`${baseURL}/api/student/getProfileImageFor`, { id }, {
          responseType: 'arraybuffer',
        });
    
        const base64Image = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            '',
          ),
        );
    
        setImage(`data:${response.headers['content-type']};base64,${base64Image}`);
      } catch (error) {
        console.error('Error fetching profile image:', error);
        setImage(defaultProfileImage);
      }
    };
    

    const splitBySingleSpace = (text) => {
      return text.split(/\s+/).filter(Boolean);
    };

    return (
      <Container className="my-4">
        <Row>
          {/* Schedule Section */}
          <Col md={6} >
            <div className="schedule-section card p-3">
              <h2 className="display-6">Today's Schedule</h2>
              <ListGroup>
                {homeContent && splitBySingleSpace(homeContent.today_schedule).map((url, index) => (
                  <ListGroup.Item key={index}><a href={url} target='_blank'>{url}</a></ListGroup.Item>
                ))}
              </ListGroup>
              <h2 className="mt-5 mb-4 display-6">Tomorrow's Schedule</h2>
              <ListGroup>
                {homeContent && splitBySingleSpace(homeContent.tomorrow_schedule).map((url, index) => (
                  <ListGroup.Item key={index}><a href={url} target='_blank'>{url}</a></ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Col>
          {/* Best Performer Section */}
          <Col md={6}>
          <div className="best-performer-section d-flex align-items-center justify-content-center flex-column p-3">
  <h2>Yesterday’s Best Performer</h2>
  {bestPerformer ? (
    <div className="text-center mt-4">
      <img src={image || defaultProfileImage} alt="Best Performer" className="rounded-circle mb-3" style={{ width: '200px', height: '200px' }} />
      {bestPerformer.profile ? (
        <>
          <p className="my-2 display-4">{bestPerformer.student.name}</p>
          <p className="my-2 h6">{bestPerformer.collegeName || ' '}</p>
          <p className="my-2 h6">
            {bestPerformer.profile.highest_education || ' '}
            {bestPerformer.profile.highest_education && bestPerformer.profile.specialization && ', '}
            {bestPerformer.profile.specialization || ' '}
          </p>
        </>
      ) : (
        <>
          <p className="my-2 display-4">{bestPerformer.student.name}</p>
          <p className="my-2 h6">{bestPerformer.collegeName || ' '}</p>
          <p className="my-2 h6"> </p>
        </>
      )}
    </div>
  ) : (
    <div className="text-center mt-4">
      <img src={defaultProfileImage} alt="Default Profile" className="rounded-circle mb-3" style={{ width: '200px', height: '200px' }} />
      <p className="my-2 h6">Best performer data not available</p>
    </div>
  )}
</div>

          </Col>
        </Row>
      </Container>
    );
  };

  export default HeroSection;
