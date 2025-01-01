import React from "react";
import { Button } from "react-bootstrap";

const WhatsAppJoin = () => {
  return (
    <div className="container mt-5">
      {/* Button displayed prominently */}
      <div className="text-center mb-4">
        <a
          href="https://whatsapp.com/channel/0029Var9Wub30LKJP7fK7y06"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="success" size="lg" className="mb-3">
            Join Our WhatsApp Channel
          </Button>
        </a>
      </div>

      {/* Main Content */}
      <div className="text-center">
        <h2 className="mb-4">Welcome to Lara Technologies</h2>
        <p className="lead">
          We, <strong>Lara Technologies</strong>, a premier training institute in Bangalore since 2005, 
          have trained and placed over <strong>1 lakh+ students</strong> in the Java Full Stack stream.
        </p>
        <p>
          We’ve started a <strong>WhatsApp channel</strong> to train and guide students every 
          Sunday online. Join our channel to receive live links, videos, materials, and more!
        </p>
        <h5 className="mt-4">Here’s what we offer:</h5>
        <ul className="list-unstyled text-start mx-auto" style={{ maxWidth: "700px" }}>
          <li>1️⃣ Java Full Stack and Python Full Stack training.</li>
          <li>2️⃣ Project development classes.</li>
          <li>3️⃣ Free classes on Data Structures and Algorithms.</li>
          <li>4️⃣ System design sessions.</li>
          <li>5️⃣ Interview preparation tips.</li>
          <li>6️⃣ Insights into companies and strategies to target them.</li>
          <li>7️⃣ Information on in-demand skills and future trends.</li>
          <li>8️⃣ Frequently asked interview questions.</li>
          <li>9️⃣ Mock interviews to build confidence.</li>
          <li>🔟 Resume preparation guidance.</li>
          <li>1️⃣1️⃣ Personality development skills.</li>
          <li>1️⃣2️⃣ Latest job requirements from various industries.</li>
        </ul>
        <p className="mt-4">
          Join us to learn, grow, and succeed! <strong>Happy Learning! 😊</strong>
        </p>
      </div>
    </div>
  );
};

export default WhatsAppJoin;
