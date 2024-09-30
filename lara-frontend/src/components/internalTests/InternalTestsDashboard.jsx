import React, { useState } from 'react';
import { Container, Row, Col, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import InternalTestLinkForm from './InternalTestLinkForm'; // Assuming it's in the same directory
import AllInternalTests from './AllInternalTests';
import StudentWiseTestOverview from './StudentWiseTestOverview';
import AllStudentsPerformance from './AllStudentsPerformance';

const InternalTestsDashboard = () => {
    const [activeComponent, setActiveComponent] = useState('AllTests');
    const [show, setShow] = useState(false); // State to control offcanvas visibility

    const renderComponent = () => {
        switch (activeComponent) {
            case 'createInternalTest':
                return <InternalTestLinkForm />;
            case 'AllTests':
                return <AllInternalTests />;
            // case 'StudentWiseTestOverview':
            //     return <StudentWiseTestOverview />;
            case 'AllStudentsPerformance':
                return <AllStudentsPerformance />;
            // Add more cases here for other components you wish to include
            default:
                return <AllInternalTests />;
        }
    };

    return (
        <Container fluid className="shadow card my-3 responsive overflow-auto" style={{ overflow: 'auto' }}>
            <Row>
                <Col xs={12} md={2} id="sidebar-wrapper" className="bg-light">
                    {/* Navbar for small screens */}
                    <Navbar expand="md" className="bg-light d-md-none">
                        <Navbar.Brand href="#">Internal Tests</Navbar.Brand>
                        <Navbar.Toggle
                            aria-controls="offcanvasNavbar"
                            onClick={() => setShow(true)}
                        />
                    </Navbar>

                    {/* Offcanvas component for small screens */}
                    <Offcanvas show={show} onHide={() => setShow(false)} placement="start">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>Navigation</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav
                                activeKey={activeComponent}
                                onSelect={(selectedKey) => {
                                    setActiveComponent(selectedKey);
                                    setShow(false); // Close the offcanvas when a nav item is selected
                                }}
                            >

                                <Nav.Item>
                                    <Nav.Link
                                        eventKey="AllTests"
                                        className={activeComponent === 'AllTests' ? 'active' : ''}
                                    >
                                        All Test Links
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link
                                        eventKey="createInternalTest"
                                        className={activeComponent === 'createInternalTest' ? 'active' : ''}
                                    >
                                        Create Internal Test
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link
                                        eventKey="AllStudentsPerformance"
                                        className={activeComponent === 'AllStudentsPerformance' ? 'active' : ''}
                                    >
                                        Students Performance
                                    </Nav.Link>
                                </Nav.Item>
                                {/* <Nav.Item>
                                    <Nav.Link
                                        eventKey="StudentWiseTestOverview"
                                        className={activeComponent === 'StudentWiseTestOverview' ? 'active' : ''}
                                    >
                                        Students Performance
                                    </Nav.Link>
                                </Nav.Item> */}

                                {/* Add more navigation items here if you add new features */}
                            </Nav>
                        </Offcanvas.Body>
                    </Offcanvas>

                    {/* Navigation links for large screens */}
                    <Nav
                        className="d-none d-md-block bg-light"
                        activeKey={activeComponent}
                        onSelect={(selectedKey) => setActiveComponent(selectedKey)}
                        style={{ minHeight: '100vh', paddingTop: '20px' }}
                    >
                        <Nav.Item>
                            <Nav.Link
                                eventKey="AllTests"
                                className={activeComponent === 'AllTests' ? 'active' : ''}
                            >
                                All Test Links
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link
                                eventKey="createInternalTest"
                                className={activeComponent === 'createInternalTest' ? 'active' : ''}
                            >
                                Create Internal Test
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link
                                eventKey="AllStudentsPerformance"
                                className={activeComponent === 'AllStudentsPerformance' ? 'active' : ''}
                            >
                                Students Performance
                            </Nav.Link>
                        </Nav.Item>
                        {/* <Nav.Item>
                            <Nav.Link
                                eventKey="StudentWiseTestOverview"
                                className={activeComponent === 'StudentWiseTestOverview' ? 'active' : ''}
                            >
                                Students Performance
                            </Nav.Link>
                        </Nav.Item> */}
                        {/* Add more navigation items here if you add new features */}
                    </Nav>
                </Col>
                <Col xs={12} md={10} id="page-content-wrapper" style={{ maxWidth: '100%' }}>
                    <div className="container-fluid">
                        {renderComponent()}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default InternalTestsDashboard;
