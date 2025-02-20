import React, { useState } from 'react';
import { NavLink, Navigate } from 'react-router-dom';
import AllStudentsProfiles from '../superAdmin/AllStudentsProfiles';
import StudentDetails from './StudentDetails';
import AssignRole from './AssignRole'; 
import TrainerDetails from './TrainerDetails';
import BatchDetails from './BatchDetails';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import StudentReviews from './StudentReviews';
// import AssignStudentsToCollege from './AssignStudentsToCollege';
import CollegeDetails from './CollegeDetails';
import PlacementOfficer from './PlacementOfficer';
import Attendance from './Attendance';
import UpdateSchedule from './UpdateSchedule';
// import UpdateBestPerformer from './UpdateBestPerformer';
import CumulativeTest from '../cumulativeTest/CumulativeTest';
import CreateTestLink from '../placementTest/CreateTestLink';
import AllPlacementTests from '../placementTest/AllPlacementTests';
import InternalTestsDashboard from '../internalTests/InternalTestsDashboard';
import AssignWhatsAppChannel from '../placementTest/AssignWhatsAppChannel';
import { ToastContainer } from 'react-toastify';
import TransactionDetails from './TransactionDetails';
import UpdateStudentEmail from './UpdateStudentEmail';
import PaperBasedTestResults from './PaperBasedTestResults';

const AdminDashboard = () => {
  const [selectedOption, setSelectedOption] = useState('studentDetails');
  const isLoggedIn = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  
  if (!isLoggedIn || userRole !== 'ADMIN') {
    // If user is not authenticated or does not have admin role, redirect to home page
    return <Navigate to="/" replace />;
  }

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="container">
      <h1 className='text-center'>Admin Dashboard</h1>
      <Tabs
        defaultActiveKey="studentDetails"
        id="dashboard-tabs"
        onSelect={(key) => handleOptionChange(key)}
        className="mb-3"
      >
        <Tab eventKey="studentDetails" title="Student Details">
          <StudentDetails />
        </Tab>
        <Tab eventKey="profileDetails" title="Profile Details">
          <AllStudentsProfiles />
        </Tab>
        <Tab eventKey="assignRole" title="Assign Role">
          <AssignRole />
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
        {/* <Tab eventKey="updateBestPerformer" title="Best Performer">
          <UpdateBestPerformer />
        </Tab> */}
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
        <Tab eventKey="assignWhatsAppChannel" title="Assign WhatsApp channel">
          <AssignWhatsAppChannel />
        </Tab>
        <Tab eventKey="transactionDetails" title="Transcation Details">
          <TransactionDetails />
          </Tab>
        <Tab eventKey="updateStudentEmail" title=" Update Student Email">
          <UpdateStudentEmail />
        </Tab>
        <Tab eventKey="paperBasedTestResults" title="Upload Test Resuts">
          <PaperBasedTestResults />
        </Tab>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
