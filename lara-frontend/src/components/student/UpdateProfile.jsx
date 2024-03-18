import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {baseURL}  from '../config';

const UpdateProfile = () => {
  const { studentId } = useParams();
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [profileDetails, setProfileDetails] = useState({
    name: '',
    gender: '',
    highest_education: '',
    year_of_passout: '',
    specialization: '',
    highest_education_percent: '',
    tenth_percentage: '',
    twelth_percentage: '',
    mobile_number: '',
    father_name: '',
    father_mobile_number: '',
    father_occupation: '',
    mother_name: '',
    mother_mobile_number: '',
    adhaar_number: '',
    address: '',
    pincode: '',
    city: '',
    district: '',
    state: '',
    country: ''
  });

  const [nameError, setNameError] = useState('');
  const [fNameError, setFNameError] = useState('');
  const [mNameError, setMNameError] = useState('');
  const [mobileNumberError, setMobileNumberError] = useState('');
  const [fMobileNumberError, setFMobileNumberError] = useState('');
  const [mMobileNumberError, setMMobileNumberError] = useState('');
  const [adhaarNumberError, setAdhaarNumberError] = useState('');
  const [pincodeError, setPincodeError] = useState('');
  const [highPercentError, setHighPercentError] = useState('');
  const [tenthPercentError, setTenthPercentError] = useState('');
  const [twelthPercentError, setTwelthPercentError] = useState('');
  const [YOPError, setYOPError] = useState('');

  const [pincode, setPincode] = useState('');
  const [details, setDetails] = useState(null);

  // auto fill the address details by pincode 
  const fetchLocationDetails = async () => {
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      if (data && data[0].Status === 'Success') {
        const locationDetails = data[0].PostOffice[0];
        setDetails({
          district: locationDetails.District,
          state: locationDetails.State,
          country: locationDetails.Country
        });
      } else {
        // console.log("error")
        setDetails(null);
      }
    } catch (error) {
      setDetails(null);
    }
  };

  const handlePincodeBlur = () => {
    if (pincode.trim() !== '') {
      fetchLocationDetails();
    }
  };

  useEffect
  (() => {
    const fetchProfileDetails = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        if (!token) {
          // Handle case where token is not found in localStorage
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}` // Include token in request headers
          }
        };

        const response = await axios.get(`${baseURL}/api/student/getProfileDetails`,config );
        const data = response.data || {};
        setProfileDetails(data);
      } catch (error) {
        // console.error('Failed to fetch profile details:', error);
        setErrorMessage('Please Fill the Form');
      }
    };

    fetchProfileDetails();
  }, [studentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileDetails(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'pincode') {
      setPincode(value);
    }
    // Reset error messages on change
    switch (name) {
      case 'name':
        setNameError(validateName(value));
        break;
        case 'father_name':
        setFNameError(validateFName(value));
        break;
        case 'mother_name':
        setMNameError(validateMName(value));
        break;
      case 'mobile_number':
        setMobileNumberError(validatePhoneNumber(value));
        break;
      case 'adhaar_number':
        setAdhaarNumberError(validateAdhaarNumber(value));
        break;
      case 'pincode':
        setPincodeError(validatePincode(value));
        break;
      case 'father_mobile_number':
        setFMobileNumberError(validateFPhoneNumber(value));
        break;
        case 'mother_mobile_number':
        setMMobileNumberError(validateMPhoneNumber(value));
        break;
        case 'highest_education_percent':
        setHighPercentError(validateHighPercent(value));
        break;
        case 'tenth_percentage':
        setTenthPercentError(validateTenthPercent(value));
        break;
        case 'twelth_percentage':
        setTwelthPercentError(validateTwelthPercent(value));
        break;
        case 'year_of_passout':
          setYOPError(validateYOP(value));
          break;
        default:
        break;
    }
  };

  const validateName = (name) => {
    return name.trim().length < 3 ? "Name must contain at least 3 characters" : "";
  };

  const validateFName = (fName) => {
    return fName.trim().length < 3 ? "Name must contain at least 3 characters" : "";
  };

  const validateMName = (mName) => {
    return mName.trim().length < 3 ? "Name must contain at least 3 characters" : "";
  };

  const validatePhoneNumber = (phoneNumber) => {
    const isValid = /^\d{10}$/.test(phoneNumber);
    return isValid ? "" : "Phone number must be 10 digits";
};

  const validateFPhoneNumber = (phoneNumber) => {
    const isValid = /^\d{10}$/.test(phoneNumber);
    return isValid ? "" : "Phone number must be 10 digits";
  };
  const validateMPhoneNumber = (phoneNumber) => {
    const isValid = /^\d{10}$/.test(phoneNumber);
    return isValid ? "" : "Phone number must be 10 digits";
  };

  const validateAdhaarNumber = (adhaarNumber) => {
    const isValid = /^\d{12}$/.test(adhaarNumber);
    return isValid ? "" : "Invalid Adhaar Number";
  };

  const validatePincode = (pincode) => {
    const isValid = /^\d{6}$/.test(pincode);
    return isValid ? "" : "Invalid Pincode";
  };
  
 const validateHighPercent = (highPercent) => {
  const isValid = /^\d+(\.\d+)?$/.test(highPercent);
  const percentage = parseFloat(highPercent);
  return (isValid && percentage >= 30 && percentage <= 100) ? "" : "Please enter a valid percentage";
};

const validateTenthPercent = (tenthPercent) => {
  const isValid = /^\d+(\.\d+)?$/.test(tenthPercent);
  const percentage = parseFloat(tenthPercent);
  return (isValid && percentage >= 30 && percentage <= 100) ? "" : "Please enter a valid percentage";
};

const validateTwelthPercent = (twelthPercent) => {
  const isValid = /^\d+(\.\d+)?$/.test(twelthPercent);
  const percentage = parseFloat(twelthPercent);
  return (isValid && percentage >= 30 && percentage <= 100) ? "" : "Please enter a valid percentage";
};

const validateYOP = (yop) => {
  // Validate if yop is a number
  if (!/^\d+$/.test(yop)) {
    return "Please enter a valid Year of passout";
  }
  
  const year = parseInt(yop, 10);
  const currentYear = new Date().getFullYear();
  
  // Validate if yop is within the range
  if (year < 2010 || year > currentYear + 4) {
    return "Please enter a valid Year of passout between 2010 and " + (currentYear + 4);
  }
  
  // If all validations pass, return empty string (no error)
  return "";
};



  const handleUpdateProfile = async () => {
    // Validate profile details before updating
    const nameError = validateName(profileDetails.name);
    const mobileNumberError = validatePhoneNumber(profileDetails.mobile_number);
    const fMobileNumberError = validatePhoneNumber(profileDetails.father_mobile_number);
    const mMobileNumberError = validatePhoneNumber(profileDetails.mother_mobile_number);
    const adhaarNumberError = validateAdhaarNumber(profileDetails.adhaar_number);
    const pincodeError = validatePincode(profileDetails.pincode);
    const highPercentError = validateHighPercent(profileDetails.highest_education_percent);
    const tenthPercentError = validateTenthPercent(profileDetails.tenth_percentage);
    const twelthPercentError = validateTwelthPercent(profileDetails.twelth_percentage);
    const YOPError = validateYOP(profileDetails.year_of_passout);
    const fNameError = validateFName(profileDetails.father_name)
    const mNameError = validateMName(profileDetails.mother_name)
    // Set errors in state
    setNameError(nameError);
    setMobileNumberError(mobileNumberError);
    setFMobileNumberError(fMobileNumberError);
    setMMobileNumberError(mMobileNumberError);
    setAdhaarNumberError(adhaarNumberError);
    setPincodeError(pincodeError);
    setHighPercentError(highPercentError);
    setTenthPercentError(tenthPercentError);
    setTwelthPercentError(twelthPercentError);
    setYOPError(YOPError);
    setFNameError(fNameError);
    setMNameError(mNameError);
  
    // Check if any validation errors exist
    if (nameError || mobileNumberError || adhaarNumberError || pincodeError ||mMobileNumberError || fMobileNumberError || highPercentError || tenthPercentError || twelthPercentError || YOPError || fNameError || mNameError) {
      // If validation fails, do not update profile
      return;
    }
  
    try {
      // console.log("inside try block of save or update profile")
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      if (!token) {
        // Handle case where token is not found in localStorage
        // console.log("no token found")
        return;
      }
      // console.log("token found in local storage")
      const config = {
        headers: {
          Authorization: `Bearer ${token}` // Include token in request headers
        }
      };

      await axios.post(`${baseURL}/api/student/saveOrUpdateProfile`,profileDetails,config );
      // If update is successful, display success message and redirect to StudentHome
      // console.log("Profile updated successfully");
      setErrorMessage('Profile updated successfully');
      setShowToast(true); // Show the toast
      setTimeout(() => {
        navigate('/studentHome')
      }, 2000);
    } catch (error) {
      // If update fails, display error message
      setErrorMessage('Something went wrong. Failed to update profile.');
      // console.error('Failed to update profile:', error);
    }
  };
  


  return (
    <div className="mt-4">
    <h2 className="mb-4 text-center">Update Profile</h2>
    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
    {showToast &&
        <div className="toast show success" role="alert" aria-live="assertive" aria-atomic="true" style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: '10000' }}>
        <div className="toast-body">
        Profile updated successfully.
        </div>
    </div>
    }
   <form className="container-md">
  <div className="card mb-4">
    <div className="card-body">
      <div className="mb-3">
  <label htmlFor="name" className="form-label">Name:<sup className='text-danger fw-bolder fs-6'><b>*</b></sup> </label>
    <input 
        type="text" 
        className={`form-control ${nameError ? 'is-invalid' : ''}`} 
        id="name" 
        name="name" 
        value={profileDetails.name} 
        onChange={handleChange} 
    />
  {nameError && <div className="invalid-feedback">{nameError}</div>}
    </div>
      <div className="mb-3">
        <label htmlFor="gender" className="form-label">Gender:<sup className='text-danger fw-bolder fs-6'><b>*</b></sup></label>
        <div className="form-check">
          <input className="form-check-input" type="radio" name="gender" id="male" value="Male" checked={profileDetails.gender === 'Male'} onChange={handleChange} defaultChecked/>
          <label className="form-check-label" htmlFor="male">Male</label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="radio" name="gender" id="female" value="Female" checked={profileDetails.gender === 'Female'} onChange={handleChange} />
          <label className="form-check-label" htmlFor="female">Female</label>
        </div>
      </div>
      <div className="mb-3">
      <div className=' bg-primary rounded p-2'><h3 className="text-white">Education Details</h3></div>
        <label htmlFor="highest_education" className="form-label">Highest Education:</label>
        <input type="text" className="form-control" id="highest_education" name="highest_education" value={profileDetails.highest_education} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="year_of_passout" className="form-label">Year of Passout:</label>
        <input type="number" className={`form-control ${YOPError ? 'is-invalid' : ''}`} id="year_of_passout" name="year_of_passout" value={profileDetails.year_of_passout} onChange={handleChange} />
         {YOPError && <div className="invalid-feedback">{YOPError}</div>}
      </div>
      <div className="mb-3">
        <label htmlFor="specialization" className="form-label">Specialization(Branch):</label>
        <input type="text" className="form-control" id="specialization" name="specialization" value={profileDetails.specialization} onChange={handleChange} />
      </div>
      <div className="mb-3">
      <label htmlFor="highest_education_percent" className="form-label">Highest Education Percentage:</label>
      <input 
        type="number" 
        className={`form-control ${highPercentError ? 'is-invalid' : ''}`} 
        id="highest_education_percent" 
        name="highest_education_percent" 
        value={profileDetails.highest_education_percent} 
        onChange={handleChange} 
      />
      {highPercentError && <div className="invalid-feedback">{highPercentError}</div>}
      </div>

      <div className="mb-3">
      <label htmlFor="twelth_percentage" className="form-label">12<sup>th</sup> Percentage:</label>
      <input 
        type="number" 
        className={`form-control ${twelthPercentError ? 'is-invalid' : ''}`} 
        id="twelth_percentage" 
        name="twelth_percentage" 
        value={profileDetails.twelth_percentage} 
        onChange={handleChange} 
      />
      {twelthPercentError && <div className="invalid-feedback">{twelthPercentError}</div>}
      </div>

      <div className="mb-3">
      <label htmlFor="tenth_percentage" className="form-label">10<sup>th</sup> Percentage:</label>
      <input 
        type="number" 
        className={`form-control ${tenthPercentError ? 'is-invalid' : ''}`} 
        id="tenth_percentage" 
        name="tenth_percentage" 
        value={profileDetails.tenth_percentage} 
        onChange={handleChange} 
      />
      {tenthPercentError && <div className="invalid-feedback">{tenthPercentError}</div>}
      </div>

    </div>
  </div>

  <div className="card mb-4">
    <div className="card-body">
      <div className=' bg-primary rounded p-2'><h3 className="text-white">Contact Information</h3></div>
      <hr />
      <div className="mb-3">
        <label htmlFor="mobile_number" className="form-label">Mobile Number:<sup className='text-danger fw-bolder fs-6'><b>*</b></sup></label>
        <input 
                type="text" 
                className={`form-control ${mobileNumberError ? 'is-invalid' : ''}`} 
                id="mobile_number" 
                name="mobile_number" 
                value={profileDetails.mobile_number} 
             onChange={handleChange} 
        />
{mobileNumberError && <div className="invalid-feedback">{mobileNumberError}</div>}

      </div>
      <div className="mb-3">
        <label htmlFor="adhaar_number" className="form-label">Aadhaar Number:<sup className='text-danger fw-bolder fs-6'><b>*</b></sup></label>
        <input type="text" className={`form-control ${adhaarNumberError ? 'is-invalid' : ''}`} id="adhaar_number" name="adhaar_number" value={profileDetails.adhaar_number} onChange={handleChange} />
{adhaarNumberError && <div className="invalid-feedback">{adhaarNumberError}</div>}

      </div>
      <div className="mb-3">
        <label htmlFor="father_name" className="form-label">Father's Name:</label>
        <input type="text" className={`form-control ${fNameError ? 'is-invalid' : ''}`}  id="father_name" name="father_name" value={profileDetails.father_name} onChange={handleChange} />
        {fNameError && <div className="invalid-feedback">{fNameError}</div>}
      </div>
      <div className="mb-3">
        <label htmlFor="father_mobile_number" className="form-label">Father's Mobile Number:<sup className='text-danger fw-bolder fs-6'><b>*</b></sup></label>
        <input type="text" className={`form-control ${fMobileNumberError ? 'is-invalid' : ''}`} id="father_mobile_number" name="father_mobile_number" value={profileDetails.father_mobile_number} onChange={handleChange} required/>
        {fMobileNumberError && <div className="invalid-feedback">{fMobileNumberError}</div>}
      </div>
      <div className="mb-3">
        <label htmlFor="father_occupation" className="form-label">Father's Occupation:</label>
        <input type="text" className="form-control" id="father_occupation" name="father_occupation" value={profileDetails.father_occupation} onChange={handleChange} required/>
      </div>
      <div className="mb-3">
        <label htmlFor="mother_name" className="form-label">Mother's Name:</label>
        <input type="text" className={`form-control ${mNameError ? 'is-invalid' : ''}`} id="mother_name" name="mother_name" value={profileDetails.mother_name} onChange={handleChange} />
        {mNameError && <div className="invalid-feedback">{mNameError}</div>}
      </div>
      <div className="mb-3">
        <label htmlFor="mother_mobile_number" className={`form-label`}>Mother's Mobile Number:</label>
        <input type="text" className="form-control" id="mother_mobile_number" name="mother_mobile_number" value={profileDetails.mother_mobile_number} onChange={handleChange} />
        {mMobileNumberError && <div className="invalid-feedback">{mMobileNumberError}</div>}
      </div>
    </div>
  </div>

  <div className="card mb-4">
    <div className="card-body">
    <div className=' bg-primary rounded p-2'><h3 className="text-white">Address</h3></div>
      <hr />
      <div className="mb-3">
        <label htmlFor="address" className="form-label">Address(Street/Building No.)<sup className='text-danger fw-bolder fs-6'><b>*</b></sup></label>
        <input type="text" className="form-control" id="address" name="address" value={profileDetails.address} onChange={handleChange} required/>
      </div>
      <div className="mb-3">
        <label htmlFor="city" className="form-label">City:<sup className='text-danger fw-bolder fs-6'><b>*</b></sup></label>
        <input type="text" className="form-control" id="city" name="city" value={profileDetails.city} onChange={handleChange} required/>
      </div>
      <div className="mb-3">
        <label htmlFor="pincode" className="form-label">Pincode:<sup className='text-danger fw-bolder fs-6'><b>*</b></sup></label>
        <input type="text" className={`form-control ${pincodeError ? 'is-invalid' : ''}`} id="pincode" name="pincode" value={profileDetails.pincode} onChange={handleChange} onBlur={handlePincodeBlur}  required/>
        {pincodeError && <div className="invalid-feedback">{pincodeError}</div>}
      </div>
      <div className="mb-3">
        <label htmlFor="district" className="form-label">District:<sup className='text-danger fw-bolder fs-6'><b>*</b></sup></label>
        <input type="text" className="form-control" id="district" name="district" value={profileDetails.district} onChange={handleChange} required/>
      </div>
      <div className="mb-3">
        <label htmlFor="state" className="form-label">State:<sup className='text-danger fw-bolder fs-6'><b>*</b></sup></label>
        <input type="text" className="form-control" id="state" name="state" value={profileDetails.state} onChange={handleChange} required/>
      </div>
      <div className="mb-3">
        <label htmlFor="country" className="form-label">Country:<sup className='text-danger fw-bolder fs-6'><b>*</b></sup></label>
        <input type="text" className="form-control" id="country" name="country" value={profileDetails.country} onChange={handleChange} required/>
      </div>
      
    </div>
  </div>

    

  {/* Bootstrap Toast */}
  <div className="toast" role="alert" aria-live="assertive" aria-atomic="true" style={{ position: 'fixed', bottom: '1rem', right: '1rem' }}>
    <div className="toast-body">
      Profile updated successfully.
    </div>
  </div>
  <div className="text-center">
      <button type="button" className="btn btn-primary col-4  h2 fw-bold" onClick={handleUpdateProfile} >Update Profile
      </button>
    </div>
</form>

  </div>
  
  );
};

export default UpdateProfile;
