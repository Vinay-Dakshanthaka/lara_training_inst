import React, { useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const OnlineTestMonitoring = ({ style, isCameraOn }) => {
  const [video, setVideo] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [lastFacePosition, setLastFacePosition] = useState(null);
  const [movementDetected, setMovementDetected] = useState(false);
  const [outOfFrameCount, setOutOfFrameCount] = useState(0);
  const [toastId, setToastId] = useState(null);
  const [toastCount, setToastCount] = useState(0);
  const OUT_OF_FRAME_THRESHOLD = 3;
  const MOVEMENT_THRESHOLD = 100;
  const MAX_TOAST_COUNT = 3;
  const navigate = useNavigate();

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        await faceapi.nets.faceExpressionNet.loadFromUri('/models');
      } catch (error) {
        console.error('Error loading face-api.js models:', error);
      }
    };

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 320, height: 240 },
          audio: true // Request audio stream
        });
        const videoElement = document.getElementById('video');
        if (videoElement) {
          videoElement.srcObject = stream;
          videoElement.onloadedmetadata = () => {
            videoElement.play().catch(err => console.error('Error playing video:', err));
          };
          setVideo(videoElement);
        }
      } catch (error) {
        console.error('Error accessing camera and/or microphone:', error);
      }
    };
    

    const initialize = async () => {
      await loadModels();
      if (isCameraOn) {
        await startVideo();
      }
    };

    initialize();

    return () => {
      if (video && video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOn]);

  useEffect(() => {
    let intervalId;
    if (video) {
      intervalId = setInterval(async () => {
        if (video.readyState === 4) {
          const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
          if (detections.length > 0) {
            setFaceDetected(true);
            setOutOfFrameCount(0);
            dismissWarningToast();

            const faceBox = detections[0].box;
            const landmarks = await faceapi.detectFaceLandmarks(video);
            const currentPosition = { x: faceBox.x, y: faceBox.y };
            const faceTurned = checkFaceOrientation(landmarks);

            if (lastFacePosition && !faceTurned) {
              const distance = Math.sqrt(
                Math.pow(currentPosition.x - lastFacePosition.x, 2) +
                Math.pow(currentPosition.y - lastFacePosition.y, 2)
              );

              if (distance > MOVEMENT_THRESHOLD) {
                setMovementDetected(true);
                showWarningToast();
              }
            } else if (faceTurned) {
              setOutOfFrameCount(prev => prev + 1);
              if (outOfFrameCount >= OUT_OF_FRAME_THRESHOLD) {
                setMovementDetected(true);
                showWarningToast();
              }
            }

            setLastFacePosition(currentPosition);
          } else {
            setFaceDetected(false);
            setLastFacePosition(null);
            setOutOfFrameCount(prev => prev + 1);
            if (outOfFrameCount >= OUT_OF_FRAME_THRESHOLD) {
              showWarningToast();
            }
          }
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [video, lastFacePosition, outOfFrameCount]);

  const checkFaceOrientation = (landmarks) => {
    if (landmarks) {
      const leftEye = landmarks.getLeftEye();
      const rightEye = landmarks.getRightEye();

      const horizontalDistance = rightEye[0].x - leftEye[0].x;
      const verticalDistance = rightEye[0].y - leftEye[0].y;
      const angle = Math.atan2(verticalDistance, horizontalDistance) * (180 / Math.PI);

      if (Math.abs(angle) > 20) {
        return true;
      }
    }
    return false;
  };

  const showWarningToast = () => {
    if (!toastId) {
      const id = toast.warn("Malpractice detected. If you continue, the test will be terminated.", {
        autoClose: false, // Disable auto-close
        closeOnClick: false, // Disable close on click
      });
      setToastId(id);
      setToastCount(prevCount => {
        const newCount = prevCount + 1;
        if (newCount >= MAX_TOAST_COUNT) {
          navigate('/malpractice-detected');
        }
        return newCount;
      });
    }
  };

  const dismissWarningToast = () => {
    if (toastId) {
      toast.dismiss(toastId);
      setToastId(null);
    }
  };

  return (
    <div>
      {/* <ToastContainer /> */}
      <video id="video" width="150" height="150" style={{ ...style }} />
    </div>
  );
};

export default OnlineTestMonitoring;
