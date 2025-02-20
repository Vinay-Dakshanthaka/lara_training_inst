import React, { useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const OnlineTestMonitoring = ({ style, isCameraOn }) => {
  const [video, setVideo] = useState(null);
  const [toastId, setToastId] = useState(null);
  const [toastCount, setToastCount] = useState(0);
  const MAX_TOAST_COUNT = 3;
  const navigate = useNavigate();

  useEffect(() => {
    const loadModels = async () => {
      try {
        // Load face-api.js models
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        
      } catch (error) {
        console.error('Error loading models:', error);
      }
    };

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240 },
          audio: false,
        });
        const videoElement = document.getElementById('video');
        if (videoElement) {
          videoElement.srcObject = stream;
          videoElement.muted = true;

          videoElement.onloadedmetadata = () => {
            videoElement.play().catch(err => console.error('Error playing video:', err));
          };
          setVideo(videoElement);
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
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
          // Face Detection
          const faceDetections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();

          if (faceDetections.length === 0) {
            showWarningToast("No face detected! Malpractice identified.");
          } else if (faceDetections.length > 1) {
            showWarningToast("Multiple faces detected! Malpractice identified.");
          } else {
            dismissWarningToast();
          }
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [video]);

  const showWarningToast = (message) => {
    if (!toastId) {
      const id = toast.warn(message, {
        autoClose: false,
        closeOnClick: false,
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
      <video id="video" width="200" height="440" style={{ ...style }} />
    </div>
  );
};

export default OnlineTestMonitoring;
