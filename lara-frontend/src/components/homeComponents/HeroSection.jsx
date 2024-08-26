// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Container, Row, Col, ListGroup } from 'react-bootstrap';
// import defaultProfileImage from "../default-profile.png";
// import { baseURL } from '../config';
// import Carousel from 'react-bootstrap/Carousel';

// // const HeroSection = () => {
// //   const [homeContent, setHomeContent] = useState(null);
// //   const [bestPerformer, setBestPerformer] = useState([]);
// //   const [images, setImages] = useState([]);
// //   const [batchSchedules, setBatchSchedules] = useState([]);
// //   const [todaySchedule, setTodaySchedule] = useState({});
// //   const [availableBatches, setAvailableBatches] = useState([]);

// //     // Fetching Available Batches
// //     const fetchAvailableBatches = async () => {
// //       try {
// //           const token = localStorage.getItem("token");
// //           if (!token) {
// //               return;
// //           }

// //           const config = {
// //               headers: {
// //                   Authorization: `Bearer ${token}`,
// //               },
// //           };

// //           const response = await axios.get(`${baseURL}/api/student/getAllBatches`, config);
// //           setAvailableBatches(response.data);
// //       } catch (error) {
// //           console.error('Error fetching batches:', error);
// //       }
// //   };

// //   useEffect(() => {
// //       fetchAvailableBatches();
// //   }, []);


// //     const fetchHomeContent = async () => {
// //         try {
// //             const response = await axios.get(`${baseURL}/api/student/fetchHomeContent`);
// //             const data = response.data;
// //             const schedules = {};
// //             data.forEach(item => {
// //                 schedules[item.batch_id] = item.today_schedule;
// //             });
// //             setTodaySchedule(schedules);
// //             setBatchSchedules(data);
// //         } catch (error) {
// //             console.error('Error fetching home content:', error);
// //         }
// //     }
  

// //   // const fetchHomeContent = async () => {
// //   //   try {
// //   //     const response = await axios.get(`${baseURL}/api/student/fetchHomeContent`);
// //   //     const data = response.data[0];
// //   //     setHomeContent(data);
// //   //   } catch (error) {
// //   //     console.error('Error fetching home content:', error);
// //   //   }
// //   // };

// //   useEffect(() => {
// //     fetchHomeContent();
// //     fetchBestPerformer();
// //   }, []);

// //   const fetchBestPerformer = async () => {
// //     try {
// //       const response = await axios.get(`${baseURL}/api/student/getBestPerformersByDate`);
// //       const data = response.data;
// //       setBestPerformer(data);

// //       const performerImages = await Promise.all(data.map(async (performer) => {
// //         try {
// //           const response = await axios.post(`${baseURL}/api/student/getProfileImageFor`, { id: performer.student.id }, {
// //             responseType: 'arraybuffer',
// //           });
// //           const base64Image = btoa(
// //             new Uint8Array(response.data).reduce(
// //               (data, byte) => data + String.fromCharCode(byte),
// //               '',
// //             ),
// //           );
// //           return `data:${response.headers['content-type']};base64,${base64Image}`;
// //         } catch (error) {
// //           console.error('Error fetching profile image:', error);
// //           return defaultProfileImage;
// //         }
// //       }));

// //       setImages(performerImages);
// //     } catch (error) {
// //       console.error('Error fetching best performer:', error);
// //     }
// //   };

// //   const splitBySingleSpace = (text) => {
// //     return text.split(/\s+/).filter(Boolean);
// //   };

// //   return (
// //     <Container className="my-4">
// //       <Row>
// //         {/* Schedule Section */}
// //         <Col md={6} >
// //           <div className="schedule-section card p-3">
// //             {/* <h2 className="display-6">Today's Schedule</h2> */}
// //             <div className="container my-4">
// //               <h2 className='my-4'>Today's Schedules</h2>
// //               {batchSchedules.map((batch) => (
// //                   <div key={batch.batch_id}>
// //                       <div className='card m-4 px-2 py-2'>
// //                         <h5>{availableBatches.find(b => b.batch_id === batch.batch_id)?.batch_name}</h5>
// //                         <pre className='fs-6'>{todaySchedule[batch.batch_id]}</pre>
// //                       </div>
// //                   </div>
// //               ))}
// //             </div>
// //             {/* <ListGroup>
// //               {homeContent && splitBySingleSpace(homeContent.today_schedule).map((url, index) => (
// //                 <ListGroup.Item key={index}><a href={url} target='_blank'>{url}</a></ListGroup.Item>
// //               ))}
// //             </ListGroup> */}
// //             {/*<h2 className="mt-5 mb-4 display-6">Tomorrow's Schedule</h2>
// //             <ListGroup>
// //               {homeContent && splitBySingleSpace(homeContent.tomorrow_schedule).map((url, index) => (
// //                 <ListGroup.Item key={index}><a href={url} target='_blank'>{url}</a></ListGroup.Item>
// //               ))}
// //             </ListGroup>
// //             */}
// //           </div>
// //         </Col>
// //         {/* Best Performer Section */}
// //         <Col md={6}>
// //           <div className="best-performer-section d-flex align-items-center justify-content-center flex-column p-3">
// //             <h2>Best Performers</h2>
// //             {bestPerformer.length > 0 ? (
// //             <Carousel nextIcon={<span className="carousel-control-next-icon mt-5" style={{ backgroundColor: '#C0C0C0' }} />} prevIcon={<span className="carousel-control-prev-icon mt-5" style={{ backgroundColor: '#C0C0C0' }} />}>
// //             {bestPerformer.map((performer, index) => (
// //               <Carousel.Item key={index}>
// //                 <p className='text-center'> Assignement No : {performer.bestPerformers[index].question_no || ' '}</p>
// //                 <div className="text-center mt-4">
// //                   <img src={images[index] || defaultProfileImage} alt="Best Performer" className="rounded-circle mb-3" style={{ width: '200px', height: '200px' }} />
// //                   {performer.profile ? (
// //                     <>
// //                       <p className="my-2 display-4">{performer.student.name}</p>
// //                       <p className="my-2 h6">{performer.collegeName || ' '}</p>
// //                       <p className="my-2 h6">
// //                         {performer.profile.highest_education || ' '}
// //                         {performer.profile.highest_education && performer.profile.specialization && ', '}
// //                         {performer.profile.specialization || ' '}
// //                       </p>
// //                     </>
// //                   ) : (
// //                     <>
// //                       <p className="my-2 display-4">{performer.student.name}</p>
// //                       <p className="my-2 h6">{performer.collegeName || ' '}</p>
// //                       <p className="my-2 h6"> </p>
// //                     </>
// //                   )}
// //                 </div>
// //               </Carousel.Item>
// //             ))}
// //           </Carousel>
          
// //             ) : (
// //               <div className="text-center mt-4">
// //                 <img src={defaultProfileImage} alt="Default Profile" className="rounded-circle mb-3" style={{ width: '200px', height: '200px' }} />
// //                 <p className="my-2 h6">Best performer data not available</p>
// //               </div>
// //             )}
// //           </div>
// //         </Col>
// //       </Row>
// //     </Container>
// //   );
// // };

// const HeroSection = () => {
//   const [homeContent, setHomeContent] = useState(null);
//   const [bestPerformer, setBestPerformer] = useState([]);
//   const [images, setImages] = useState([]);
//   const [batchSchedules, setBatchSchedules] = useState([]);
//   const [todaySchedule, setTodaySchedule] = useState({});
//   const [availableBatches, setAvailableBatches] = useState([]);
//   const [bestPerformerData, setBestPerformerData] = useState([]);
//   const [date, setDate] = useState(new Date());

//   useEffect(() => {
//     fetchAvailableBatches();
//     fetchHomeContent();
//     fetchBestPerformer();
//     fetchBestPerformersByDate()
//   }, [date]);


//   const fetchBestPerformersByDate = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         return;
//       }

//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       const response = await axios.get(`${baseURL}/api/student/getBestPerformersByDate`, {
//         params: { date: date.toISOString().slice(0, 10) },
//         ...config
//       });
//       const data = response.data;
//       setBestPerformerData(data);
//       // fetchProfileImages(data); 
//     } catch (error) {
//       console.error('Error fetching best performer:', error);
//     }
//   };

//   // Fetching Available Batches
//   const fetchAvailableBatches = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         return;
//       }

//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       const response = await axios.get(`${baseURL}/api/student/getAllBatches`, config);
//       setAvailableBatches(response.data);
//     } catch (error) {
//       console.error('Error fetching batches:', error);
//     }
//   };

//   const fetchHomeContent = async () => {
//     try {
//       const response = await axios.get(`${baseURL}/api/student/fetchHomeContent`);
//       const data = response.data;
//       const schedules = {};
//       data.forEach(item => {
//         schedules[item.batch_id] = item.today_schedule;
//       });
//       setTodaySchedule(schedules);
//       setBatchSchedules(data);
//     } catch (error) {
//       console.error('Error fetching home content:', error);
//     }
//   };

//   const fetchBestPerformer = async () => {
//     // console.log("1");
//     try {
//         // console.log("inside try");
//         const response = await axios.get(`${baseURL}/api/student/getBestPerformersByDate`);
//         // console.log("data:", response);
//         const data = response.data;
//         setBestPerformer(data);
//         // console.log("Start");

//         const performerImages = await Promise.all(data.map(async (performer) => {
//             // console.log("performer:", JSON.stringify(performer));
//             try {
//                 const response = await axios.post(`${baseURL}/api/student/getProfileImageFor`, { id: performer.student.id }, {
//                     responseType: 'arraybuffer',
//                 });
//                 // console.log("Response:", response);
//                 const base64Image = btoa(
//                     new Uint8Array(response.data).reduce(
//                         (data, byte) => data + String.fromCharCode(byte),
//                         '',
//                     ),
//                 );
//                 return `data:${response.headers['content-type']};base64,${base64Image}`;
//             } catch (error) {
//                 console.error('Error fetching profile image:', error);
//                 return defaultProfileImage;
//             }
//         }));

//         setImages(performerImages);
//     } catch (error) {
//         console.error('Error fetching best performer:', error);
//     }
// };


//   const splitBySingleSpace = (text) => {
//     return text.split(/\s+/).filter(Boolean);
//   };

//   // return (
//   //   <Container className="my-4">
//   //     <Row>
//   //       {/* Schedule Section */}
//   //       <Col md={6} >
//   //         <div className="schedule-section card p-3">
//   //           <div className="container my-4">
//   //             <h2 className='my-4'>Today's Schedules</h2>
//   //             {batchSchedules.map((batch) => (
//   //               <div key={batch.batch_id}>
//   //                 <div className='card m-4 px-2 py-2'>
//   //                   <h5>{availableBatches.find(b => b.batch_id === batch.batch_id)?.batch_name}</h5>
//   //                   <pre className='fs-6'>{todaySchedule[batch.batch_id]}</pre>
//   //                 </div>
//   //               </div>
//   //             ))}
//   //           </div>
//   //         </div>
//   //       </Col>
//   //       {/* Best Performer Section */}
//   //       <Col md={6}>
//   //         <div className="best-performer-section d-flex align-items-center justify-content-center flex-column p-3">
//   //           <h2>Best Performers</h2>
//   //           {bestPerformer.length > 0 ? (
//   //             <Carousel nextIcon={<span className="carousel-control-next-icon mt-5" style={{ backgroundColor: '#C0C0C0' }} />} prevIcon={<span className="carousel-control-prev-icon mt-5" style={{ backgroundColor: '#C0C0C0' }} />}>
//   //               {bestPerformer.map((performer, index) => (
//   //                 <Carousel.Item key={index}>
//   //                   <p className='text-center'> Assignment No : {performer.question_no || ' '}</p>
//   //                   <div className="text-center mt-4">
//   //                     <img src={images[index] || defaultProfileImage} alt="Best Performer" className="rounded-circle mb-3" style={{ width: '200px', height: '200px' }} />
//   //                     {performer.profile ? (
//   //                       <>
//   //                         <p className="my-2 display-4">{performer.student.name}</p>
//   //                         <p className="my-2 h6">{performer.collegeName || ' '}</p>
//   //                         <p className="my-2 h6">
//   //                           {performer.profile.highest_education || ' '}
//   //                           {performer.profile.highest_education && performer.profile.specialization && ', '}
//   //                           {performer.profile.specialization || ' '}
//   //                         </p>
//   //                       </>
//   //                     ) : (
//   //                       <>
//   //                         <p className="my-2 display-4">{performer.student.name}</p>
//   //                         <p className="my-2 h6">{performer.collegeName || ' '}</p>
//   //                         <p className="my-2 h6"> </p>
//   //                       </>
//   //                     )}
//   //                   </div>
//   //                 </Carousel.Item>
//   //               ))}
//   //             </Carousel>
//   //           ) : (
//   //             <div className="text-center mt-4">
//   //               <img src={defaultProfileImage} alt="Default Profile" className="rounded-circle mb-3" style={{ width: '200px', height: '200px' }} />
//   //               <p className="my-2 h6">Best performer data not available</p>
//   //             </div>
//   //           )}
//   //         </div>
//   //       </Col>
//   //     </Row>
//   //   </Container>
//   // );

//   return (
//     <Container className="my-4">
//       <Row>
//         {/* Schedule Section */}
//         <Col md={7}>
//           <div className="schedule-section card p-1">
//             <div className="container my-4">
//               <h2 className='my-4'>Today's Schedules</h2>
//               {batchSchedules.map((batch) => (
//                 <div key={batch.batch_id}>
//                   <div className=' py-2'>
//                     <div className='text-center text-decoration-underline'><span className='fw-400'>Batch Name : </span> <span className='fw-bolder fs-4'>{availableBatches.find(b => b.batch_id === batch.batch_id)?.batch_name}</span></div>
//                     <pre className='py-2'>{todaySchedule[batch.batch_id]} <br /></pre>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </Col>
//         {/* Best Performer Section */}
//         <Col md={5}>
//           <div className="best-performer-section d-flex align-items-center justify-content-center flex-column p-3">
//             <h2>Best Performers</h2>
//             {bestPerformerData.length > 0 ? (
//               <Carousel nextIcon={<span className="carousel-control-next-icon mt-5" style={{ backgroundColor: '#C0C0C0' }} />} prevIcon={<span className="carousel-control-prev-icon mt-5" style={{ backgroundColor: '#C0C0C0' }} />}>
//                 {bestPerformerData.map((performer, index) => (
//                   <Carousel.Item key={index}>
//                     {/* {console.log(performer.date)} */}
//                     <p className='text-center'> For Date: {performer.bestPerformer.date}</p>
//                     <div className="text-center mt-4">
//                       <img src={images[index] || defaultProfileImage} alt="Best Performer" className="rounded-circle mb-3" style={{ width: '200px', height: '200px' }} />
//                       {performer.profile ? (
//                         <>
//                           <p className="my-2 display-4">{performer.student.name}</p>
//                           <p className="my-2 h6">{performer.collegeName || ' '}</p>
//                           <p className="my-2 h6">
//                             {performer.profile.highest_education || ' '}
//                             {performer.profile.highest_education && performer.profile.specialization && ', '}
//                             {performer.profile.specialization || ' '}
//                           </p>
//                         </>
//                       ) : (
//                         <>
//                           <p className="my-2 display-4">{performer.student.name}</p>
//                           <p className="my-2 h6">{performer.collegeName || ' '}</p>
//                           <p className="my-2 h6"> </p>
//                         </>
//                       )}
//                     </div>
//                   </Carousel.Item>
//                 ))}
//               </Carousel>
//             ) : (
//               <div className="text-center mt-4">
//                 <img src={defaultProfileImage} alt="Default Profile" className="rounded-circle mb-3" style={{ width: '200px', height: '200px' }} />
//                 <p className="my-2 h6">Best performer data not available</p>
//               </div>
//             )}
//           </div>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default HeroSection;