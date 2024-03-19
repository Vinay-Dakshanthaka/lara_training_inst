import React from 'react';
import { BrowserRouter as Router,Link, Routes, Route } from 'react-router-dom';
import { Navbar,Nav  } from 'react-bootstrap';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import Profile from './components/student/Profile';
import StudentHome from './components/student/StudentHome';
import UpdateProfile from './components/student/UpdateProfile';
import CustomNavbar from './components/CustomNavbar';
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
import RenderNavbar from './components/RenderNavbar';
import TrainerDashboard from './components/trainer/TrainerDashboard';
import AssignQuestion from './components/trainer/AssignQuestion';
import QuestionList from './components/trainer/QuestionList';
import AssignmentQuestions from './components/student/AssignmentQuestions';
import Submission from './components/student/Submission';
import AssignmentAnswer from './components/trainer/AssignmentAnswer';
import CustomNavbars from './components/CustomNavbars';


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
            <Route path="/passwodResetForm" element={<PasswordResetForm />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route path='/createNewBatch' element={<CreateNewBatch />} />
            <Route path='/batchWiseStudents' element={<BatchWiseStudents />} />
            <Route path="/assign-question/:batch_id" element={<AssignQuestion />} />
            <Route path="/assignment-questions/:batch_id" element={<AssignmentQuestions />} />
            {/* <Route path="/submission/:questionId" element={<Submission/>} /> */}
            <Route path="/submission/:questionId/:batchId" element={<Submission />} />
            <Route path="/assignment-answers/:batchId/:studentId" element={<AssignmentAnswer />} />
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
