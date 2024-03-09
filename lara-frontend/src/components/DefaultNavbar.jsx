import React from "react";
import { Navbar, Nav, Toast } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import imgSrc from "./laralogo.webp"

function DefaultNavbar() {
    const navigate = useNavigate()
    function login(){
        navigate('/login')
      }
  return (
    <>
      <Navbar bg="light" variant="" expand="lg">
      <Navbar.Brand as={Link} to="/" className="ms-1">
            <img src={imgSrc} alt="Lara Technologies" className="img-fluid" style={{ width: "80px", height: "40px" }} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="about">About</Nav.Link>
            <Nav.Link as={Link} to="course">Course</Nav.Link>
            <button className='btn btn-primary m-1' onClick={login}>Login</button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

export default DefaultNavbar;
