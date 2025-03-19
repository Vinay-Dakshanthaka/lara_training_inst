// import React, { useState, useEffect } from 'react';
// import * as faceapi from 'face-api.js';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';

// const OnlineTestMonitoring = ({ style, isCameraOn }) => {
//   const [video, setVideo] = useState(null);
//   const [toastId, setToastId] = useState(null);
//   const [toastCount, setToastCount] = useState(0);
//   const MAX_TOAST_COUNT = 3;
//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadModels = async () => {
//       try {
//         // Load face-api.js models
//         await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
//         await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
//         await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        
//       } catch (error) {
//         console.error('Error loading models:', error);
//       }
//     };

//     const startVideo = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: { width: 320, height: 240 },
//           audio: false,
//         });
//         const videoElement = document.getElementById('video');
//         if (videoElement) {
//           videoElement.srcObject = stream;
//           videoElement.muted = true;

//           videoElement.onloadedmetadata = () => {
//             videoElement.play().catch(err => console.error('Error playing video:', err));
//           };
//           setVideo(videoElement);
//         }
//       } catch (error) {
//         console.error('Error accessing camera:', error);
//       }
//     };

//     const initialize = async () => {
//       await loadModels();
//       if (isCameraOn) {
//         await startVideo();
//       }
//     };

//     initialize();

//     return () => {
//       if (video && video.srcObject) {
//         video.srcObject.getTracks().forEach(track => track.stop());
//       }
//     };
//   }, [isCameraOn]);

//   useEffect(() => {
//     let intervalId;
//     if (video) {
//       intervalId = setInterval(async () => {
//         if (video.readyState === 4) {
//           // Face Detection
//           const faceDetections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
//             .withFaceLandmarks()
//             .withFaceDescriptors();

//           if (faceDetections.length === 0) {
//             showWarningToast("No face detected! Malpractice identified.");
//           } else if (faceDetections.length > 1) {
//             showWarningToast("Multiple faces detected! Malpractice identified.");
//           } else {
//             dismissWarningToast();
//           }
//         }
//       }, 1000);

//       return () => clearInterval(intervalId);
//     }
//   }, [video]);

//   const showWarningToast = (message) => {
//     if (!toastId) {
//       const id = toast.warn(message, {
//         autoClose: false,
//         closeOnClick: false,
//       });
//       setToastId(id);
//       setToastCount(prevCount => {
//         const newCount = prevCount + 1;
//         if (newCount >= MAX_TOAST_COUNT) {
//           navigate('/malpractice-detected');
//         }
//         return newCount;
//       });
//     }
//   };

//   const dismissWarningToast = () => {
//     if (toastId) {
//       toast.dismiss(toastId);
//       setToastId(null);
//     }
//   };

//   return (
//     <div>
//       <video id="video" width="200" height="440" style={{ ...style }} />
//     </div>
//   );
// };

// export default OnlineTestMonitoring;




import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FilesetResolver } from '@mediapipe/tasks-vision';
import { ObjectDetector } from '@mediapipe/tasks-vision';

const DescriptiveTestOnlineMonitoring = ({ style, isCameraOn }) => {
  const [detector, setDetector] = useState(null);
  const [video, setVideo] = useState(null);
  const [toastId, setToastId] = useState(null);
  const [toastCount, setToastCount] = useState(0);
  const [phoneDetected, setPhoneDetected] = useState(false);
  const [detectedPersons, setDetectedPersons] = useState([]);
  const MAX_TOAST_COUNT = 10;
  const malpracticeCount = useRef(0); // To track malpractice occurrences
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );
        const objectDetector = await ObjectDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float32/latest/efficientdet_lite0.tflite',
            delegate: 'GPU',
          },
          scoreThreshold: 0.5,
        });
        setDetector(objectDetector);
      } catch (error) {
        console.error('Error loading MediaPipe model:', error);
      }
    };

    loadModel();
  }, []);

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240 },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true;

          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch((err) => console.error('Error playing video:', err));
          };
          setVideo(videoRef.current);
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    if (isCameraOn) {
      startVideo();
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraOn]);

  useEffect(() => {
    let intervalId;
    if (detector && videoRef.current) {
      intervalId = setInterval(async () => {
        const detections = await detector.detect(videoRef.current);
        if (!detections || !detections.detections) return;

        processDetections(detections.detections);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [detector]);

  const processDetections = (detections) => {
    let persons = [];
    let phoneDetectedFlag = false;

    detections.forEach((obj) => {
      if (!obj.boundingBox || !obj.categories || obj.categories.length === 0) return;

      const { score, categoryName } = obj.categories[0];

      if (categoryName.toLowerCase() === "person") {
        persons.push({ id: persons.length + 1, confidence: Math.round(score * 100) });
      }

      if (categoryName.toLowerCase().includes("cell phone")) {
        phoneDetectedFlag = true;
      }
    });

    setDetectedPersons(persons);
    setPhoneDetected(phoneDetectedFlag);

    // Displaying specific messages based on detected malpractice
    if (persons.length === 0) {
      showWarningToast("No person detected! Malpractice identified.");
    } else if (persons.length > 1) {
      showWarningToast("Multiple people detected! Malpractice identified.");
    } else if (phoneDetectedFlag) {
      showWarningToast("Phone detected! Malpractice identified.");
    } else {
      dismissWarningToast();
    }
  };

  const showWarningToast = (message) => {
    if (!toastId) {
      const id = toast.warn(message, {
        autoClose: true,
        closeOnClick: true,
      });
      setToastId(id);

      malpracticeCount.current += 1;
      setToastCount((prevCount) => prevCount + 1);

      // If we've seen 5 malpractices, terminate the test
      if (malpracticeCount.current >= MAX_TOAST_COUNT) {
        terminateTest();
      }

      setTimeout(() => {
        if (detectedPersons.length > 0 && !phoneDetected) {
          dismissWarningToast();
        }
      }, 3000);
    }
  };

  const dismissWarningToast = () => {
    if (toastId) {
      toast.dismiss(toastId);
      setToastId(null);
    }
  };

  const terminateTest = () => {
    toast.error('Test terminated due to repeated malpractice!');
    navigate('/malpractice-detected');
  };

  return (
    <div>
      <video ref={videoRef} id="video" width="100" height="100" style={{ ...style }} />
      <canvas ref={canvasRef} width="0" height="0" style={{ marginLeft: '20%' }} />
    </div>
  );
};

export default DescriptiveTestOnlineMonitoring;
