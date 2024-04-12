import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../config';
import moment from 'moment';
import * as XLSX from 'xlsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1); // Current month
  const [selectedYear, setSelectedYear] = useState(moment().year()); // Current year
  const [selectedDate, setSelectedDate] = useState(1); // Default to the 1st day of the month
  const [searchEmail, setSearchEmail] = useState('');
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`${baseURL}/api/student/getAllStudentDetails`, config);
        const filteredStudents = response.data.filter(student => student.role === "STUDENT");
        setStudents(filteredStudents);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    fetchAttendanceByYearAndMonth();
  }, [selectedYear, selectedMonth, searchEmail, searchName]);

  const fetchAttendanceByYearAndMonth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(`${baseURL}/api/student/getAttendanceByYearAndMonth/${selectedYear}/${selectedMonth}`, config);
      const fetchedAttendance = response.data;

      const updatedAttendanceData = {};
      fetchedAttendance.forEach(entry => {
        const date = moment(entry.date).format('YYYY-MM-DD');
        if (!updatedAttendanceData[date]) {
          updatedAttendanceData[date] = {};
        }
        updatedAttendanceData[date][entry.student_id] = entry.status;
      });

      setAttendanceData(updatedAttendanceData);
    } catch (error) {
      console.error(error);
    }
  };

  const renderAttendanceSheet = () => {
    const currentDate = moment().set({ 'year': selectedYear, 'month': selectedMonth - 1, 'date': selectedDate });
    const daysInMonth = currentDate.daysInMonth();
    const attendanceSheet = [];

    const headerDates = [];
    for (let i = 1; i <= daysInMonth; i++) {
      headerDates.push(moment().set({ 'year': selectedYear, 'month': selectedMonth - 1, 'date': i }).format('D'));
    }

    let filteredStudents = [];
    if (searchEmail) {
      filteredStudents = students.filter(student => student.email.toLowerCase().includes(searchEmail.toLowerCase()));
    } else if (searchName) {
      filteredStudents = students.filter(student => student.name.toLowerCase().includes(searchName.toLowerCase()));
    } else {
      filteredStudents = students;
    }

    filteredStudents.forEach(student => {
      const email = student.email;
      const name = student.name;
      const attendanceCells = [];
      for (let i = 1; i <= daysInMonth; i++) {
        const date = moment().set({ 'year': selectedYear, 'month': selectedMonth - 1, 'date': i }).format('YYYY-MM-DD');
        const present = attendanceData[date] && attendanceData[date][student.id] === 'P';
        attendanceCells.push(
          <td
            key={`${date}-${email}`}
            className={present ? 'present' : 'absent'}
          >
            {present ? '✔' : ''}
          </td>
        );
      }
      attendanceSheet.push(
        <tr key={email}>
          <td>{name}</td>
          <td>{email}</td>
          {attendanceCells}
        </tr>
      );
    });

    const headerRow = headerDates.map((date, index) => (
      <th key={index}>{date}</th>
    ));

    return (
      <React.Fragment>
        <tr>
          <th>Name</th>
          <th>Email</th>
          {headerRow}
        </tr>
        {attendanceSheet}
      </React.Fragment>
    );
  };

  const handleEmailChange = (event) => {
    setSearchEmail(event.target.value);
    setSearchName('');
  };

  const handleNameChange = (event) => {
    setSearchName(event.target.value);
    setSearchEmail('');
  };

  const handleMonthChange = (event) => {
    const selectedMonth = parseInt(event.target.value);
    if (selectedYear === moment().year() && selectedMonth > moment().month() + 1) {
      return; // Prevent selection of future months for the current year
    }
    setSelectedMonth(selectedMonth);
  };

  const handleYearChange = (event) => {
    const selectedYear = parseInt(event.target.value);
    if (selectedYear > moment().year()) {
      return; // Prevent selection of future years
    }
    setSelectedYear(selectedYear);
  };

  const handleDateChange = (event) => {
    setSelectedDate(parseInt(event.target.value));
  };

  const handleExcelUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 'A' });

      const excelEmails = excelData.map(row => row['A']);
      const studentEmails = students.map(student => student.email);

      const matchedEmails = excelEmails.filter(email => studentEmails.includes(email));

      const updatedAttendanceData = { ...attendanceData };
      const selectedDateFormatted = moment().set({ 'year': selectedYear, 'month': selectedMonth - 1, 'date': selectedDate }).format('YYYY-MM-DD');

      matchedEmails.forEach(email => {
        if (!updatedAttendanceData[selectedDateFormatted]) {
          updatedAttendanceData[selectedDateFormatted] = {};
        }
        updatedAttendanceData[selectedDateFormatted][email] = 'P';
      });

      setAttendanceData(updatedAttendanceData);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleProcessAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const attendanceArray = [];
      Object.keys(attendanceData).forEach(date => {
        Object.keys(attendanceData[date]).forEach(email => {
          const status = attendanceData[date][email];
          // Find the student with the matching email to get the student ID
          const student = students.find(student => student.email === email);
          if (student) {
            attendanceArray.push({
              date: date,
              status: status,
              student_id: student.id // Use student ID instead of email
            });
          }
        });
      });

      const response = await axios.post(`${baseURL}/api/student/saveAttendance`, { attendanceData: attendanceArray }, config);
      toast.success("Attendance uploaded Successfully");
      renderAttendanceSheet();
      fetchAttendanceByYearAndMonth();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <h1>Attendance Sheet</h1>
      <div className="row mb-3">
        <div className="col">
          <label htmlFor="monthSelect" className="form-label">Select Month:</label>
          <select id="monthSelect" className="form-select" value={selectedMonth} onChange={handleMonthChange}>
            {moment.months().map((month, index) => (
              <option key={index + 1} value={index + 1} disabled={selectedYear === moment().year() && index + 1 > moment().month() + 1}>{month}</option>
            ))}
          </select>
        </div>
        <div className="col">
          <label htmlFor="yearSelect" className="form-label">Select Year:</label>
          <select id="yearSelect" className="form-select" value={selectedYear} onChange={handleYearChange}>
            {Array.from({ length: 10 }, (_, index) => (
              <option key={index} value={moment().year() - 5 + index} disabled={moment().year() - 5 + index > moment().year()}>{moment().year() - 5 + index}</option>
            ))}
          </select>
        </div>
        <div className="col">
          <label htmlFor="dateSelect" className="form-label">Select Date:</label>
          <select id="dateSelect" className="form-select" value={selectedDate} onChange={handleDateChange}>
            {Array.from({ length: moment().set({ 'year': selectedYear, 'month': selectedMonth - 1 }).daysInMonth() }, (_, index) => (
              <option key={index + 1} value={index + 1}>{index + 1}</option>
            ))}
          </select>
        </div>
        <div className="col">
          <label htmlFor="emailSearch" className="form-label">Search by Email:</label>
          <input type="text" id="emailSearch" className="form-control" value={searchEmail} onChange={handleEmailChange} />
        </div>
        <div className="col">
          <label htmlFor="nameSearch" className="form-label">Search by Name:</label>
          <input type="text" id="nameSearch" className="form-control" value={searchName} onChange={handleNameChange} />
        </div>
        <div className='my-4'>
          <input id="excelFile" type="file" onChange={handleExcelUpload} accept=".xlsx, .xls" />
          <button onClick={handleProcessAttendance} className='btn btn-primary'>Upload Attendance</button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              {moment().set({ 'year': selectedYear, 'month': selectedMonth - 1 }).format('MMMM')}
            </tr>
          </thead>
          <tbody>
            {renderAttendanceSheet()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
