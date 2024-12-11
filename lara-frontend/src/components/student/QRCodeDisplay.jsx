import React from 'react';
import QRCode from 'qrcode.react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';

const QRCodeDisplay = ({ link, title }) => {
    return (
        <div className="d-flex justify-content-center align-items-center mt-4">
            <Card style={{ width: '18rem', padding: '20px', border: '1px solid #007bff' }}>
                <Card.Body>
                    <Card.Title className="text-center mb-3" style={{ color: '#007bff' }}>
                        {title || 'Scan the QR Code'}
                    </Card.Title>
                    <div className="d-flex justify-content-center">
                        <QRCode
                            value={link}
                            size={180}
                            bgColor="#ffffff"
                            fgColor="#007bff"
                            level="H"
                            includeMargin={true}
                        />
                    </div>
                    <Card.Text className="mt-3 text-center text-muted">
                        Use your phone's camera or a QR code scanner to visit the link.
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    );
};

QRCodeDisplay.propTypes = {
    link: PropTypes.string.isRequired, // The link to be converted into a QR code
    title: PropTypes.string,           // Optional title for the card
};

export default QRCodeDisplay;
