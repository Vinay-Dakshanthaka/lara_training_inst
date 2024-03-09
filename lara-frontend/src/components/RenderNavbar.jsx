import React from 'react';
import AdminNavbar from './admin/AdminNavbar';
import SuperAdminNavbar from './superAdmin/SuperAdminNavbar';
import StudentNavbar from './student/StudentNavbar';
import DefaultNavbar from './DefaultNavbar';

const RenderNavbar = () => {
  const role = localStorage.getItem('role');

  switch (role) {
    case 'ADMIN':
      return <AdminNavbar />;
    case 'SUPER ADMIN':
      return <SuperAdminNavbar />;
    case 'STUDENT':
      return <StudentNavbar />;
    default:
      return <DefaultNavbar />;
  }
};

export default RenderNavbar;
