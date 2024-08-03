import React, { useState } from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddSubject from './AddSubject';
import UploadQuestions from './UploadQuestions';
import AddQuestion from '../admin/AddQuestion';
import AddQuestionsToLink from '../placementTest/AddQuestionsToLink';
import AllPlacementTests from '../placementTest/AllPlacementTests';


const CumulativeTest = () => {
    const [activeComponent, setActiveComponent] = useState('addSubject');

    const renderComponent = () => {
        switch (activeComponent) {
            case 'addSubject':
                return <AddSubject />;
            case 'uploadQuestions':
                return <UploadQuestions />;
            // case 'addQuestions':
            //     return <AddQuestion />;
            // case 'addExistingQuestions':
            //     return <AllPlacementTests />
            // Add more cases here for other components
            default:
                return <AddSubject />;
        }
    };

    return (
        <Container fluid className='shadow card my-3'>
            <Row>
                <Col xs={2} id="sidebar-wrapper" className="bg-light">
                    <Nav className="col-md-12 d-none d-md-block bg-light sidebar"
                        activeKey="/home"
                        onSelect={selectedKey => setActiveComponent(selectedKey)}
                        style={{ minHeight: '100vh', paddingTop: '20px' }}>
                        <Nav.Item>
                            <Nav.Link eventKey="addSubject" className={activeComponent === 'addSubject' ? 'active' : ''}>
                                Add Subject
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="uploadQuestions">
                                Upload Questions for practice
                            </Nav.Link>
                        </Nav.Item>
                        {/* <Nav.Item>
                            <Nav.Link eventKey="addQuestions">
                                Add New Questions
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="addExistingQuestions">
                                Add Existing Questions
                            </Nav.Link>
                        </Nav.Item> */}
                    </Nav>
                </Col>
                <Col xs={10} id="page-content-wrapper">
                    <div className="container-fluid">
                        {renderComponent()}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default CumulativeTest;
