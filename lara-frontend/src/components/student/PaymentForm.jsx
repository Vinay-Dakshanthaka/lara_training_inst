import React, { useState } from 'react';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';

const PaymentForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [transactionIdError, setTransactionIdError] = useState('');
  const [transactionslip_imgError, setTransactionslip_imgError] = useState('');
  const [transaction_id, setTransactionId] = useState('');
  const [confirm_transaction_id, setConfirmTransactionId] = useState('');
  const [transactionslip_img, setTransactionSlipImg] = useState(null);
  const [confirmError, setConfirmError] = useState('');

  const token = localStorage.getItem('token');

  if (!token) {
    alert('You must be logged in to proceed.');
    return null;
  }

  let studentId = null;
  // let studentemail = null;
  try {
    const decodedToken = jwtDecode(token);
    studentId = decodedToken.id;
    // studentemail = decodedToken.email;
  } catch (error) {
    console.error('Error decoding token:', error);
    alert('Invalid token. Please log in again.');
    return null;
  }

  const qrCodeImage = 'https://static.vecteezy.com/system/resources/previews/000/406/024/original/vector-qr-code-illustration.jpg';

  const handleChange = (e) => {
    setTransactionId(e.target.value);
  };

  const handleConfirmChange = (e) => {
    setConfirmTransactionId(e.target.value);
  };

  const handleFileChange = (e) => {
    setTransactionSlipImg(e.target.files[0]);
  };

  const handleButtonClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handlesubmit = async () => {
    setTransactionIdError('');
    setTransactionslip_imgError('');
    setConfirmError('');

    // const transactionIdPattern = /^[A-Z]\d{22}$/;

    if (!transaction_id) {
      setTransactionIdError('Transaction ID is required.');
    }
    if (!confirm_transaction_id) {
      setConfirmError('Confirm Transaction ID is required.');
    }
    if (!transactionslip_img) {
      setTransactionslip_imgError('Transaction Slip is required.');
    }
    if (!transaction_id || !confirm_transaction_id || !transactionslip_img) {
      return;
    }

    if (transaction_id !== confirm_transaction_id) {
      setConfirmError('Transaction IDs do not match. Please double-check and enter correctly.');
      return;
    }

    // if (!transactionIdPattern.test(transaction_id)) {
    //   setTransactionIdError('Transaction ID must start with an uppercase letter followed by 22 digits.');
    //   return;
    // }

    const formData = new FormData();
    formData.append('student_id', studentId);
    formData.append('transaction_id', transaction_id);
    formData.append('transactionslip_img', transactionslip_img);
    // formData.append('studentemail', studentemail);

    try {
      const response = await axios.post(`${baseURL}/api/transaction/save`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Transaction Details saved successfully');
      console.log(response.data);
        // Refresh the page
    window.location.reload();
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('This transaction ID details are already uploaded.');
    }
  };

  return (
    <form className="container-md mt-2">
      <div className="card mb-4">
        <div className="card-body">
          <div className="bg-primary rounded p-2">
            <h3 className="text-white">Payment Process</h3>
          </div>
          <div className="mb-3">
            <Button variant="success" onClick={handleButtonClick} className="w-100 mt-3">
              Proceed to Payment
            </Button>
          </div>

          <div className="mb-3">
            <label htmlFor="payment" className="form-label">
              Transaction ID
              <sup className="text-danger fw-bolder fs-6">
                <b>*</b>
              </sup>
            </label>
            <input
              type="text"
              className="form-control"
              id="payment"
              name="transaction_id"
              value={transaction_id}
              onChange={handleChange}
              placeholder="Enter Transaction ID"
              required
            />
            {transactionIdError && <div className="text-danger">{transactionIdError}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="confirmPayment" className="form-label">
              Confirm Transaction ID
              <sup className="text-danger fw-bolder fs-6">
                <b>*</b>
              </sup>
            </label>
            <input
              type="text"
              className="form-control"
              id="confirmPayment"
              name="confirm_transaction_id"
              value={confirm_transaction_id}
              onChange={handleConfirmChange}
              placeholder="Re-enter Transaction ID"
              required
            />
            {confirmError && <div className="text-danger">{confirmError}</div>}
          </div>

          <p className="text-warning">
            <b>Note:</b> Please double-check your Transaction ID before submitting.
          </p>

          <div className="mb-3">
            <label htmlFor="transactionSlip" className="form-label">
              Upload Transaction Slip
              <sup className="text-danger fw-bolder fs-6">
                <b>*</b>
              </sup>
            </label>
            <input
              type="file"
              className="form-control"
              id="transactionSlip"
              name="transactionSlip"
              onChange={handleFileChange}
              required
            />
            {transactionslip_imgError && <div className="text-danger">{transactionslip_imgError}</div>}
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Scan the QR Code to Proceed</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <center>
            <img
              src={qrCodeImage}
              alt="QR Code"
              className="img-fluid mt-3"
              style={{ width: '200px', height: '200px' }}
            />
          </center>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="text-center">
        <button type="button" className="btn btn-primary col-4 h2 fw-bold" onClick={handlesubmit}>
          Submit Payment Details
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;
