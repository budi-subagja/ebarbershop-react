import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/authContext.jsx';

function DropdownProfile() {
const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();           // Hapus user dari context & localStorage
    navigate('/');      // Redirect ke login
  };

  return (
    <div className="navbar-item navbar-user dropdown">
      <a
        href="#/"
        className="navbar-link dropdown-toggle d-flex align-items-center"
        data-bs-toggle="dropdown"
      >
        <div className="image image-icon bg-gray-800 text-gray-600">
          <i className="fa fa-user"></i>
        </div>
        <span>
          <span className="d-none d-md-inline fw-bold">{user?.nama || "User"}</span>
          <b className="caret"></b>
        </span>
      </a>
      <div className="dropdown-menu dropdown-menu-end me-1">
        <a href="#/" className="dropdown-item">Edit Profile</a>
        <a href="#/" className="dropdown-item d-flex align-items-center">
          Inbox
          <span className="badge bg-danger rounded-pill ms-auto pb-4px">2</span> 
        </a>
        <a href="#/" className="dropdown-item">Calendar</a>
        <a href="#/" className="dropdown-item">Settings</a>
        <div className="dropdown-divider"></div>
        <a href="#/" className="dropdown-item" onClick={handleLogout}>Log Out</a>
      </div>
    </div>
  );
};

export default DropdownProfile;
