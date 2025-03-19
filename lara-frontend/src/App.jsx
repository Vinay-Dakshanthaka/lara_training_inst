import React from 'react';
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
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
import AssignQuestionsToInternalTestLink from './components/internalTests/AssignQuestionsToInternalTestLink';
import AddQuestionToInternalTest from './components/internalTests/AddQuestionToInternalTest';
import UploadQuestionsToInternalTestLink from './components/internalTests/UploadQuestionsToInternalTestLink';
import EditTestInternalTestLinkQuestions from './components/internalTests/EditTestInternalTestLinkQuestions';
import InternalTest from './components/internalTests/InternalTest';
import DetailedInternalTestResult from './components/internalTests/DetailedInternalTestResult';
import StudentPerformanceDashboard from './components/internalTests/StudentPerformanceDashboard';
import StudentPerformanceForAdmin from './components/internalTests/StudentPerformanceForAdmin';
import FetchInternalTestResultsByTestId from './components/internalTests/FetchInternalTestResultsByTestId';
import CreateWeeklyTest from './components/weeklyTest/CreateWeeklyTest';
import UpdateWeeklyTest from './components/weeklyTest/UpdateWeeklyTest';
import AddWeeklyTestQuestion from './components/weeklyTest/AddWeeklyTestQuestion';
import QuestionsByWeeklyTestId from './components/weeklyTest/QuestionsByWeeklyTestId';
import EditWeeklyTestQuestion from './components/weeklyTest/EditWeeklyTestQuestion';
import UploadWeeklyTestQuestions from './components/weeklyTest/UploadWeeklyTestQuestions';
import StudentAnswerForm from './components/weeklyTest/weeklyTestStudentAnswerSubmission/StudentAnswerForm';
import AnswerUpdateForm from './components/weeklyTest/weeklyTestStudentAnswerSubmission/AnswerUpdateForm';
import WeeklyTestAttendedStudentsList from './components/weeklyTest/weeklyTestStudentAnswerSubmission/WeeklyTestAttendedStudentsList';
import WeeklyTestStudentDetailedSummary from './components/weeklyTest/WeeklyTestStudentDetailedSummary';
import AllStudentsWeeklyTestResults from './components/weeklyTest/AllStudentsWeeklyTestResults';
import WeeklyTestPerformanceForAdmin from './components/weeklyTest/weeklyTestStudentAnswerSubmission/WeeklyTestPerformanceForAdmin';
import ChromeOnlyMessage from './components/ChromeOnlyMessage';
import TestNotActiveYet from './components/TestNotActiveYet';
import RecruiterDashboard from './components/recruiter/RecruiterDashboard';
import SaveWhatsAppChannelModal from './components/placementTest/SaveWhatsAppChannelModal';
import ExternalStudentsResults from './components/ExternalStudentsResults';
import WhatsAppJoin from './components/student/WhatsAppJoin';
import UpdateStudentEmail from './components/admin/UpdateStudentEmail';
// import PaperBasedExcelSheet from './components/admin/PaperBasedExcelSheet';
import PaperBasedTestResults from './components/admin/PaperBasedTestResults';
import AssignBatches from './components/internalTests/AssignBatchs';
import AssignBatchsTowt from './components/weeklyTest/AssignBatchsTowt';
import TestResults from './components/admin/TestResults';
import StudentQuestionAnswer from './components/weeklyTest/weeklyTestStudentAnswerSubmission/evaluvation/StudentQuestionAnswer';
import AddNewQuestiontoInternalTest from './components/internalTests/AddNewQuestiontoInternalTest';
import StudentInternalTestDetails from './components/internalTests/StudentInternalTestDetails';
import AddDescriptiveTestQuestion from './components/weeklyTest/AddDescriptiveTestQuestion';
import FetchDescrtiptiveTestQuestionEdit from './components/descriptiveTest/FetchDescrtiptiveTestQuestionEdit';
import StudentDescriptiveAnswerForm from './components/descriptiveTest/StudentDescriptiveAnswerForm';
import AnswerUpdateFormDescriptiveQuestions from './components/descriptiveTest/AnswerUpdateFormDescriptiveQuestions';
import DescriptiveTestAutoEvaluation from './components/descriptiveTest/DescriptiveTestAutoEvaluation';
import AllStudentsDescriptivePlacementTestResults from './components/descriptiveTest/AllStudentsDescriptivePlacementTestResults';
// import StudentAnswerForm from './components/weeklyTest/StudentAnswerFormDuplicate';


const App = () => {

  return (
    <Router>
      <>
        {/* <CustomNavbar /> */}
        <CustomNavbars />
        {/* <RenderNavbar /> */}
        <div className="">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='about' element={<AboutUsPage />} />
            <Route path='course' element={<Course />} />
            <Route path='terms' element={<TermsAndCondition />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/join-channel" element={<WhatsAppJoin />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/studentHome" element={<StudentHome />} />
            <Route path="/updateProfile" element={<UpdateProfile />} />
            <Route path="/changePassword" element={<ChangePassword />} />
            <Route path="/superAdminDashboard" element={<SuperAdminDashboard />} />
            <Route path="/adminDashboard" element={<AdminDashboard />} />
            <Route path="/trainerDashboard" element={<TrainerDashboard />} />
            <Route path="/placementOfficerDashboard" element={<PlacementOfficerDashboard />} />
            <Route path="/recruiterDashboard" element={<RecruiterDashboard />} />
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
            <Route path="/internal-test/:test_id" element={<InternalTest />} />
            <Route path="/malpractice-detected" element={<PlacementTestError />} />
            <Route path="/create-test-link" element={<CreateTestLink />} />
            <Route path="/updateStudentEmail" element={<UpdateStudentEmail />} />
            <Route path="/paperBasedTestResults" element={<PaperBasedTestResults />} />
            {/* <Route path="/paper-excel" element={<PaperBasedExcelSheet />} /> */}

            <Route path="/not-found" element={<NotFound />} />
            <Route path="/test-not-active" element={<TestNotActiveYet />} />
            <Route path="/chrome-only" element={<ChromeOnlyMessage />} />
            <Route path="/get-result/:test_id" element={<FetchResultsByTestId />} />
            <Route path="/get-internal-test-result/:internal_test_id" element={<FetchInternalTestResultsByTestId />} />
            <Route path="/add-questions-tolink/:test_id" element={<AddQuestionsToLink />} />
            <Route path="/assign-questions-internal-test/:internal_test_id" element={<AssignQuestionsToInternalTestLink />} />
            <Route path="/add-questions-internal-test/:internal_test_id" element={<AddQuestionToInternalTest />} />
            <Route path="/add-question/:internal_test_id" element={<AddNewQuestiontoInternalTest />} />
            <Route path="/add-new-questions/:test_id" element={<AddQuestion />} />
            <Route path="/upload-excel-link/:test_id" element={<UploadQuestionsToLink />} />
            <Route path="/upload-excel-internal-test-link/:internal_test_id" element={<UploadQuestionsToInternalTestLink />} />
            <Route path="/edit-quesitons/:test_id" element={<EditTestLinkQuestions />} />
            <Route path="/detailed-internal-result/:internal_test_id" element={<DetailedInternalTestResult />} />
            <Route path="/edit-internal-quesitons/:internal_test_id" element={<EditTestInternalTestLinkQuestions />} />
            <Route path="/test-links" element={<AllPlacementTests />} />
            <Route path="/student-performance/:student_id" element={<StudentPerformanceForAdmin />} />
            {/* <Route path="/add-question" element={<AddQuestion />} /> */}
            {/* <Route path="/profile" element={<Profile />} /> */}
            <Route path="*" element={<LoginForm />} />
            <Route path='/weekly-test' element={<CreateWeeklyTest />} />
            <Route path='/update-weekly-test/:wt_id' element={<UpdateWeeklyTest />} />
            <Route path='/add-questoin-weekly-test/:wt_id' element={<AddWeeklyTestQuestion />} />
            <Route path='/add-questoin-descriptive-test/:placement_test_id' element={<AddDescriptiveTestQuestion />} />
            <Route path='/fetch-questoins-weekly-test/:wt_id' element={<QuestionsByWeeklyTestId />} />
            <Route path='/fetch-questoins-descriptive-test/:placement_test_id' element={<FetchDescrtiptiveTestQuestionEdit />} />
            <Route path='/edit-weekly-test-question/:question_id' element={<EditWeeklyTestQuestion />} />
            <Route path='/upload-questoins-weekly-test/:wt_id' element={<UploadWeeklyTestQuestions />} />
            <Route path='/testResults/:id' element={<TestResults />} />
            <Route path='/weekly-test/:wt_id' element={<StudentAnswerForm />} />
            <Route path='/internal-test-theory/:wt_id' element={<StudentAnswerForm />} />
            <Route path='/descriptive-test/:placement_test_id' element={<StudentDescriptiveAnswerForm />} />
            {/* <Route path='/internal-test/:wt_id' element={<StudentAnswerForm />} /> */}
            <Route path='/test-answer-form/:wt_id' element={<AnswerUpdateForm />} />
            <Route path='/update-answer-descriptive-question/:placement_test_id' element={<AnswerUpdateFormDescriptiveQuestions />} />
            <Route path='/wt-attended-student-list/:wt_id' element={<WeeklyTestAttendedStudentsList />} />
            <Route path='/evaluvate-student-answers/:wt_id/:student_id' element={<StudentQuestionAnswer />} />
            <Route path='/descriptive-test-resulst/:placement_test_id/:placement_test_student_id' element={<DescriptiveTestAutoEvaluation />} />
            <Route path='studentHome/weeklytest-detailed-summary/:wt_id' element={<WeeklyTestStudentDetailedSummary />} />
            <Route path='studentHome/weekly-test-results/:wt_id' element={<AllStudentsWeeklyTestResults />} />
            <Route path='weekly-test-student-performance/:student_id' element={<WeeklyTestPerformanceForAdmin />} />
            <Route path='/add-whatsApp-link' element={<SaveWhatsAppChannelModal />} />
            <Route path='/external-test-results' element={<ExternalStudentsResults />} />
            <Route path="batch-details/:internal_test_id" element={<AssignBatches />} />
            <Route path="batch-details-wt/:wt_id" element={<AssignBatchsTowt />} />
            <Route path="/descriptive-test-results/:placement_test_id" element={<AllStudentsDescriptivePlacementTestResults />} />

          </Routes>
        </div>
        <Footer />
      </>
    </Router>
  );
};

export default App;
