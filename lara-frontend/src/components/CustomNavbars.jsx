import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppBar, Box, Container, Toolbar, IconButton, Typography, Menu, MenuItem, Button, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';
import defaultProfileImage from "../components/default-profile.png";
import { useNavigate } from 'react-router-dom';
import logoImage from "../resources/images/laralogo.webp";
import {baseURL}  from './config';


const pages = ['HOME', 'ABOUT', 'COURSE'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function CustomNavbars() {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [image, setImage] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("token"));
    const [userRole, setUserRole] = useState(localStorage.getItem("role"));
    const navigate = useNavigate();


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
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setIsLoggedIn(null);
        setUserRole(null);
        // Redirect to the login page or any other page after logout
        window.location.href = "/login"; // Example: Redirect to the login page
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



    return (
        <AppBar position="static">
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
                        <img src={logoImage} alt="Logo" style={{ height: '30px' }} />
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
                                        default:
                                            break;
                                    }
                                    handleCloseNavMenu();
                                }}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>


                    <Box sx={{ flexGrow: 0 }}>
                        {isLoggedIn ? (
                            <>
                                <Tooltip title="Profile">
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
                                   
                                    {/* Common menu items */}
                                    <MenuItem onClick={() => navigate("/studentHome")}>Profile</MenuItem>
                                    <MenuItem onClick={() => navigate("/updateProfile")}>Update Profile</MenuItem>
                                    <MenuItem onClick={() => navigate("/changePassword")}>Change Password</MenuItem>
                                    <MenuItem onClick={handleLogout}>Logout</MenuItem>

                                </Menu>
                            </>
                        ) : (
                            <Button color="inherit" onClick={() => navigate("/login")}>Login</Button>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default CustomNavbars;
