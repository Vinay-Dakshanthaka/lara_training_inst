import React from "react";
import qrCodeImage from "./qr_code_whatsApp.png"; 
import { Button } from "react-bootstrap"; 

const WhatsAppJoin = () => {
  return (
    <div className="container text-center mt-5">
      <h2 className="mb-4">Join Our Free Online Classes!</h2>
      <p className="lead">
        Join our WhatsApp channel to get all the details about our free online
        classes on Sundays. We focus on logical programming in arrays and strings,
        including timings, topics, and live links to attend the sessions.
      </p>
      
      {/* QR Code */}
      <div className="mb-4">
        <img
          src={qrCodeImage}
          alt="WhatsApp QR Code"
          className="img-fluid"
          style={{ maxWidth: "300px", borderRadius: "10px" }}
        />
      </div>

      {/* Button to join the WhatsApp channel */}
      <a
        href="https://whatsapp.com/channel/0029Var9Wub30LKJP7fK7y06"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="success" size="lg">
          Join Our WhatsApp Channel
        </Button>
      </a>
    </div>
  );
};

export default WhatsAppJoin;
