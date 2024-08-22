import React from 'react';
import { BrowserRouter as Router,Link, Routes, Route } from 'react-router-dom';
// import { Navbar,Nav  } from 'react-bootstrap';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
// import Profile from './components/student/Profile';
import StudentHome from './components/student/StudentHome';
import UpdateProfile from './components/student/UpdateProfile';
// import CustomNavbar from './components/CustomNavbar';
import Home from './components/Home';
import SuperAdminDashboard from './components/superAdmin/SuperAdminDashboard';
import AdminDashboard from './components/admin/AdminDashboard';

import Footer from './components/Footer';
import AboutUsPage from './components/AboutUsPage';
import Course from './components/homeComponents/Course';
import PasswordResetForm from './components/PasswordEmailForm';
import ResetPassword from './components/ResetPassword';
import ChangePassword from './components/ChangePassword';
import TermsAndCondition from './components/TermsAndCondition';
import CreateNewBatch from './components/admin/CreateNewBatch';
import BatchWiseStudents from './components/admin/BatchWiseStudents';
// import RenderNavbar from './components/RenderNavbar';
import TrainerDashboard from './components/trainer/TrainerDashboard';
import AssignQuestion from './components/trainer/AssignQuestion';
// import QuestionList from './components/trainer/QuestionList';
import AssignmentQuestions from './components/student/AssignmentQuestions';
import Submission from './components/student/Submission';
import AssignmentAnswer from './components/trainer/AssignmentAnswer';
import CustomNavbars from './components/CustomNavbars';
import Result from './components/student/Result';
import AssignStudentsToCollege from './components/admin/AssignStudentsToCollege';
import PlacementOfficerDashboard from './components/placementOfficer/PlacementOfficerDashboard';
import StudentReviewsByStudentId from './components/placementOfficer/StudentReviewsByStudentId';
import Answers from './components/placementOfficer/Answers';
import StudentCumulativeTest from './components/student/StudentCumulativeTest';
import StartTest from './components/student/StartTest';
import AllTestResults from './components/student/AllTestResults';
import DetailedResult from './components/student/DetailedResult';
import PlacementTest from './components/student/PlacementTest';
import PlacementTestError from './components/placementTest/PlacementTestError';
import CreateTestLink from './components/placementTest/CreateTestLink';
import NotFound from './components/NotFound';
import FetchResultsByTestId from './components/placementTest/FetchResultsByTestId';
import AddQuestion from './components/admin/AddQuestion';
import AddQuestionsToLink from './components/placementTest/AddQuestionsToLink';
import UploadQuestionsToLink from './components/placementTest/UploadQuestionsToLink';
import AllPlacementTests from './components/placementTest/AllPlacementTests';
import EditTestLinkQuestions from './components/placementTest/EditTestLinkQuestions';


const App = () => {
  
  return (
    <Router>
      <>
        {/* <CustomNavbar /> */}
        <CustomNavbars />
        {/* <RenderNavbar /> */}
        <div className="container">
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='about' element={<AboutUsPage/>}/>
            <Route path='course' element={<Course/>}/>
            <Route path='terms' element={<TermsAndCondition/>} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/studentHome" element={<StudentHome />} />
            <Route path="/updateProfile" element={<UpdateProfile />} />
            <Route path="/changePassword" element={<ChangePassword />} />
            <Route path="/superAdminDashboard" element={<SuperAdminDashboard />} />
            <Route path="/adminDashboard" element={<AdminDashboard />} />
            <Route path="/trainerDashboard" element={<TrainerDashboard />} />
            <Route path="/placementOfficerDashboard" element={<PlacementOfficerDashboard />} />
            <Route path="/passwodResetForm" element={<PasswordResetForm />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route path='/createNewBatch' element={<CreateNewBatch />} />
            <Route path='/batchWiseStudents' element={<BatchWiseStudents />} />
            <Route path="/assign-question/:batch_id" element={<AssignQuestion />} />
            <Route path="/assignment-questions/:batch_id" element={<AssignmentQuestions />} />
            {/* <Route path="/submission/:questionId" element={<Submission/>} /> */}
            <Route path="/submission/:questionId/:batchId" element={<Submission />} />
            <Route path="/result/:questionId/:batchId" element={<Result />} />
            {/* <Route path="/reviews/:batchId" element={<StudentReviewsByStudentId />} /> */}
            <Route path="/assignment-answers/:batchId/:studentId" element={<AssignmentAnswer />} />
            {/* to view assignment submission for placementOfficer  */}
            <Route path="/answers/:studentId" element={<Answers />} />
            <Route path="/assignStudentsToCollege" element={<AssignStudentsToCollege />} />
            <Route path="/studentCumulativeTest" element={<StudentCumulativeTest />} />
            <Route path="/start-test" element={<StartTest />} />
            <Route path="/all-test-results" element={<AllTestResults />} />
            <Route path="/all-test-results/:test_id" element={<DetailedResult />} />
            <Route path="/test/:test_id" element={<PlacementTest />} />
            <Route path="/malpractice-detected" element={<PlacementTestError />} />
            <Route path="/create-test-link" element={<CreateTestLink />} />
            <Route path="/not-found" element={<NotFound />} /> 
            <Route path="/get-result/:test_id" element={<FetchResultsByTestId />} />
            <Route path="/add-questions-tolink/:test_id" element={<AddQuestionsToLink />} />
            <Route path="/add-new-questions/:test_id" element={<AddQuestion />} />
            <Route path="/upload-excel-link/:test_id" element={<UploadQuestionsToLink />} />
            <Route path="/edit-quesitons/:test_id" element={<EditTestLinkQuestions />} />
            <Route path="/test-links" element={<AllPlacementTests />} />
            {/* <Route path="/add-question" element={<AddQuestion />} /> */}
            {/* <Route path="/profile" element={<Profile />} /> */}
            <Route path="*" element={<LoginForm />} />

          </Routes>
        </div>
        <Footer/>
      </>
    </Router>
  );
};

export default App;
