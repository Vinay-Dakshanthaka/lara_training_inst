import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppBar, Box, Container, Toolbar, IconButton, Typography, Menu, MenuItem, Button, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import defaultProfileImage from "../components/default-profile.png";
import { useLocation, useNavigate } from 'react-router-dom';
import logoImage from "../resources/images/laralogo.webp";
import { baseURL } from './config';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';


const pages = ['HOME', 'ABOUT', 'COURSE','RESULTS'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function CustomNavbars() {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [image, setImage] = useState(null);
    const [studentDetails, setStudentDetails] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("token"));
    const [userRole, setUserRole] = useState(localStorage.getItem("role"));
    const navigate = useNavigate();
    const handleShowModal = () => setShowModal(true);

    const handleCloseModal = () => setShowModal(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${baseURL}/api/student/getStudentDetails`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Assuming the response data contains student details, set it to state
                setStudentDetails(response.data);
            } catch (error) {
                console.error('Error fetching student details:', error);
            }
        };

        fetchStudentDetails();
    }, [])


    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        // Show the confirmation modal
        handleShowModal();
    };

    const handleConfirmLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setIsLoggedIn(null);
        setUserRole(null);
        // Display success message using React Toastify
        toast.success('Logged out success!');
        setTimeout(() => {
            window.location.href = "/login";
        }, 2000);
    };


    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    `${baseURL}/api/student/profile/image`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        responseType: "arraybuffer", // Receive the image as a buffer
                    }
                );

                // Convert the received image data to Base64
                const base64Image = btoa(
                    new Uint8Array(response.data).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        ""
                    )
                );

                // Set the image data to state
                setImage(`data:${response.headers["content-type"]};base64,${base64Image}`);
            } catch (error) {
                console.error('Error fetching profile image:', error);
            }
        };

        fetchProfileImage();
    }, [isLoggedIn]);

    const location = useLocation();

    // Hide the Navbar on '/join-channel'
    if (location.pathname === "/join-channel") {
      return null;
    }

    return (
        <AppBar position="static" sx={{ backgroundColor: '#347ddb', color: '#fff' }} className=''>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        <Tooltip title="Lara Technologies" className='bg-white rounded m-1'>
                            <img src={logoImage} alt="Logo" style={{ height: '40px' }} />
                        </Tooltip>
                    </Typography>


                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {pages.map((page) => (
                                <MenuItem
                                    key={page}
                                    onClick={() => {
                                        switch (page) {
                                            case 'HOME':
                                                navigate('/');
                                                break;
                                            case 'ABOUT':
                                                navigate('/about');
                                                break;
                                            case 'COURSE':
                                                navigate('/course');
                                                break;
                                            case 'RESULTS':
                                                navigate('/external-test-results');
                                                break;
                                            default:
                                                break;
                                        }
                                        handleCloseNavMenu();
                                    }}
                                >
                                    <Typography textAlign="center">{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        <img src={logoImage} alt="Logo" style={{ height: '30px' }} />
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={() => {
                                    switch (page) {
                                        case 'HOME':
                                            navigate('/');
                                            break;
                                        case 'ABOUT':
                                            navigate('/about');
                                            break;
                                        case 'COURSE':
                                            navigate('/course');
                                            break;
                                        case 'RESULTS':
                                            navigate('/external-test-results');
                                            break;
                                        default:
                                            break;
                                    }
                                    handleCloseNavMenu();
                                }}
                                sx={{ my: 2, color: '#fff', display: 'block' }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>


                    <Box sx={{ flexGrow: 0 }}>
                        {isLoggedIn ? (
                            <>
                                <Tooltip title={studentDetails.email}>
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        {image ? (
                                            <img
                                                src={image}
                                                alt="Profile"
                                                className="profile-image img-fluid rounded-circle mt-1"
                                                style={{
                                                    width: "30px",
                                                    height: "30px",
                                                    objectFit: "cover",
                                                    cursor: "pointer",
                                                }}
                                            />
                                        ) : (
                                            <img
                                                src={defaultProfileImage}
                                                alt="Default Profile"
                                                className="profile-image img-fluid rounded-circle mt-1"
                                                style={{
                                                    width: "30px",
                                                    height: "30px",
                                                    objectFit: "cover",
                                                    cursor: "pointer",
                                                }}
                                            />
                                        )}
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {/* Additional menu items based on user role */}
                                    {userRole === "ADMIN" && (
                                        <MenuItem onClick={() => navigate("/adminDashboard")}>Dashboard</MenuItem>
                                    )}
                                    {userRole === "SUPER ADMIN" && (
                                        <MenuItem onClick={() => navigate("/superAdminDashboard")}>Dashboard</MenuItem>
                                    )}
                                    {userRole === "TRAINER" && (
                                        <MenuItem onClick={() => navigate("/trainerDashboard")}>Dashboard</MenuItem>
                                    )}
                                    {userRole === "PLACEMENT OFFICER" && (
                                        <MenuItem onClick={() => navigate("/placementOfficerDashboard")}>Dashboard</MenuItem>
                                    )}
                                    {userRole === "RECRUITER" && (
                                        <MenuItem onClick={() => navigate("/recruiterDashboard")}>Dashboard</MenuItem>
                                    )}
                                    {/* Common menu items */}
                                    <MenuItem onClick={() => navigate("/studentHome")}>Profile</MenuItem>
                                    <MenuItem onClick={() => navigate("/studentCumulativeTest")}>Cumulative Test</MenuItem>
                                    <MenuItem onClick={() => navigate("/updateProfile")}>Update Profile</MenuItem>
                                    <MenuItem onClick={() => navigate("/changePassword")}>Change Password</MenuItem>
                                    <MenuItem onClick={() => navigate("/payFee")}>Pay Fee</MenuItem>
                                    <MenuItem onClick={handleLogout}>Logout</MenuItem>

                                </Menu>
                            </>
                        ) : (
                            <Button color="inherit" onClick={() => navigate("/login")}>Login</Button>
                        )}
                    </Box>
                </Toolbar>

                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Logout</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to log out?</Modal.Body>
                    <Modal.Footer>
                        <button onClick={handleCloseModal} className='btn btn-primary'>
                            Cancel
                        </button>
                        <button onClick={handleConfirmLogout} className='btn btn-danger'>
                            Confirm
                        </button>
                    </Modal.Footer>
                </Modal>

            </Container>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </AppBar>
    );
}

export default CustomNavbars;
