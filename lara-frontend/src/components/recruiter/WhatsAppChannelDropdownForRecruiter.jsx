import React, { useEffect, useState } from 'react';
import { Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { baseURL } from '../config';

const WhatsAppChannelDropdownForRecruiter = ({ onSelectChannel }) => {
    const [channels, setChannels] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No token provided.");
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                // Fetch student details with associated WhatsApp channel links
                const response = await axios.get(`${baseURL}/api/placement-test/getStudentWithWhatsAppChannelLinks`, {
                    headers: config.headers,
                });

                if (response.data.student && response.data.student.WhatsAppChannelLinks) {
                    setChannels(response.data.student.WhatsAppChannelLinks);
                }
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch WhatsApp channel links.');
                setLoading(false);
            }
        };

        fetchChannels();
    }, []);

    const handleChannelSelect = (e) => {
        const selected = e.target.value;
        setSelectedChannel(selected);
        if (onSelectChannel) onSelectChannel(selected);
    };

    return (
        <div className="mt-4">
            <h5>Select WhatsApp Channel Link</h5>
            {loading ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" />
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <Form.Group controlId="formWhatsAppChannel">
                    <Form.Label>WhatsApp Channel</Form.Label>
                    <Form.Control as="select" value={selectedChannel} onChange={handleChannelSelect}>
                        <option value="">-- Select Channel --</option>
                        {channels.map((channel) => (
                            <option key={channel.channel_id} value={channel.link}>
                                {channel.channel_name}  : ({channel.link})
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
            )}
        </div>
    );
};

export default WhatsAppChannelDropdownForRecruiter;
