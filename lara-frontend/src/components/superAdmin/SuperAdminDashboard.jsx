import React, { useState } from 'react';
import AllStudents from './AllStudents';
import AllStudentsProfiles from './AllStudentsProfiles';
import { Navigate } from 'react-router-dom';
import { Tab, Tabs } from 'react-bootstrap';
import BatchDetails from '../admin/BatchDetails';
import TrainerDetails from '../admin/TrainerDetails';
import StudentReviews from '../admin/StudentReviews';
import CollegeDetails from '../admin/CollegeDetails';
import PlacementOfficer from '../admin/PlacementOfficer';
import Attendance from '../admin/Attendance';
import UpdateSchedule from '../admin/UpdateSchedule';
import UpdateBestPerformer from '../admin/UpdateBestPerformer';
import CumulativeTest from '../cumulativeTest/CumulativeTest';
import CreateTestLink from '../placementTest/CreateTestLink';
import AllPlacementTests from '../placementTest/AllPlacementTests';
import InternalTestsDashboard from '../internalTests/InternalTestsDashboard';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for Toastify

const StudentAdminDashboard = () => {
  const [selectedOption, setSelectedOption] = useState('studentDetails');
  const isLoggedIn = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!isLoggedIn || userRole !== 'SUPER ADMIN') {
    // If user is not authenticated or does not have super admin role, redirect to home page
    return <Navigate to="/" replace />;
  }

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="container">
      <h1 className="text-center m-4">Super Admin Dashboard</h1>
      
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <Tabs
        defaultActiveKey="studentDetails"
        id="dashboard-tabs"
        onSelect={(key) => handleOptionChange(key)}
        className="mb-3"
      >
        <Tab eventKey="studentDetails" title="Assign Role">
          <AllStudents />
        </Tab>
        <Tab eventKey="Student Profiles" title="Profile Details">
          <AllStudentsProfiles />
        </Tab>
        <Tab eventKey="batchDetails" title="Batch Details">
          <BatchDetails />
        </Tab>
        <Tab eventKey="trainers" title="Trainers">
          <TrainerDetails />
        </Tab>
        <Tab eventKey="studentReviews" title="Student Reviews">
          <StudentReviews />
        </Tab>
        <Tab eventKey="collegeDetails" title="College Details">
          <CollegeDetails />
        </Tab>
        <Tab eventKey="placementOfficer" title="Placement Officer">
          <PlacementOfficer />
        </Tab>
        <Tab eventKey="attendance" title="Attendance">
          <Attendance />
        </Tab>
        <Tab eventKey="updateSchedule" title="Update Schedule">
          <UpdateSchedule />
        </Tab>
        <Tab eventKey="updateBestPerformer" title="Best Performer">
          <UpdateBestPerformer />
        </Tab>
        <Tab eventKey="cumulativeTest" title="Cumulative Test">
          <CumulativeTest />
        </Tab>
        <Tab eventKey="create-test-link" title="Create Test Link">
          <CreateTestLink />
        </Tab>
        <Tab eventKey="addQuestionsToTestLInk" title="Add Questions To Test Link">
          <AllPlacementTests />
        </Tab>
        <Tab eventKey="internalTest" title="Internal Tests">
          <InternalTestsDashboard />
        </Tab>
      </Tabs>
    </div>
  );
};

export default StudentAdminDashboard;
