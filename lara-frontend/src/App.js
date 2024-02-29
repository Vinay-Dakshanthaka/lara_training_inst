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
import ChangePassword from './components/ChangePassword';
import Footer from './components/Footer';
import TermsAndConditions from './components/homeComponents/TermsAndCondition';
import AboutUsPage from './components/AboutUsPage';
import Course from './components/homeComponents/Course';
import PasswordResetForm from './components/PasswordEmailForm';
import ResetPassword from './components/ResetPassword';


const App = () => {
  
  return (
    <Router>
      <>
        <CustomNavbar />
        <div className="container">
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='about' element={<AboutUsPage/>}/>
            <Route path='course' element={<Course/>}/>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/studentHome" element={<StudentHome />} />
            <Route path="/updateProfile" element={<UpdateProfile />} />
            <Route path="/changePassword" element={<ChangePassword />} />
            <Route path="/superAdminDashboard" element={<SuperAdminDashboard />} />
            <Route path="/adminDashboard" element={<AdminDashboard />} />
            <Route path="/termsAndConditions" element={<TermsAndConditions />} />
            <Route path="/passwodResetForm" element={<PasswordResetForm />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
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
