import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, userLogedIn } from "../../store/auth/slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { selectLoginToken } from "../../store/auth/selectors";
import DOMPurify from "dompurify";
import validator from "validator";

const API_URL = import.meta.env.VITE_BACK_URL;

// Utility function: Escape HTML to prevent XSS
const escapeHTML = (str) => {
  if (str === null || str === undefined) {
    return ""; // Return an empty string for null or undefined
  }
  return String(str) // Ensure the input is a string
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};


function AccountForm({
  username,
  setUserName,
  emailUser,
  setUserEmail,
  userFirstName,
  setUserFirstName,
  userLastName,
  setUserLastName,
  telNumber,
  setTelNumber,
}) {
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  const token = useSelector(selectLoginToken)
  const [firstName, setFirstName] = useState(userFirstName);
  const [lastName, setLastName] = useState(userLastName);
  const [errors, setErrors] = useState({}); 
   // SanitizeInput for data sent to backend
  const sanitizeInput = (input) => DOMPurify.sanitize(input); 


  // Client-side validation function
  const validateInput = () => {
    const newErrors = {};

    if (!validator.isLength(username || "", { min: 3, max: 20 })) {
      newErrors.username = "Username must be between 3 and 20 characters.";
    }
    if (!validator.isEmail(emailUser || "")) {
      newErrors.emailUser = "Invalid email address.";
    }
    if (!validator.isLength(firstName || "", { min: 1, max: 50 })) {
      newErrors.firstName = "First name cannot be empty or exceed 50 characters.";
    }
    if (!validator.isLength(lastName || "", { min: 1, max: 50 })) {
      newErrors.lastName = "Last name cannot be empty or exceed 50 characters.";
    }
    if (!validator.isMobilePhone(String(telNumber) || "", "any")) {
      newErrors.telNumber = "Invalid phone number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleForm = async (e) => {
    e.preventDefault();

    if (!validateInput()) {
      console.log("Validation failed:", errors);
      return; // Stop form submission if validation fails
    }

    setUserFirstName(firstName)
    setUserLastName(lastName)
    // const token = localStorage.getItem("token");
    const body = {
      userName: sanitizeInput(username),
      email: sanitizeInput(emailUser),
      firstName: sanitizeInput(firstName),
      lastName: sanitizeInput(lastName),
      phoneNumber: sanitizeInput(telNumber),
    };
    try {
      const res = await axios.put(`${API_URL}/auth/update/profile`, body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        dispatch(updateUser(res.data));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const editButton = () => {
    setEdit(true);
  };
  
  const doneEdit = (e) => {
    e.preventDefault();
    setEdit(false);
  };

  useEffect(() => {
    setFirstName(userFirstName)
    setLastName(userLastName)
  }, [
    dispatch,
    username,
    emailUser,
    userFirstName,
    userLastName,
    telNumber,
  ]);

  return (
    <div className="account-container">
      {edit ? (
        <form onSubmit={handleForm} >
          <div className="account-form-wrapper">
            <div className="form-info">
              <label>Username</label>
                <input
                  type="text"
                  className="form-account-input"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                />
                {errors.username && <p className="input-error">{errors.username}</p>}
            </div>
            <div className="form-info">
              <label>Email</label>
                <input
                  type="email"
                  className="form-account-input"
                  value={emailUser}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
                {errors.emailUser && <p className="input-error">{errors.emailUser}</p>}
            </div>
            <div className="form-info">
              <label>Firstname</label>
                <input
                  type="text"
                  className="form-account-input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {errors.firstName && <p className="input-error">{errors.firstName}</p>}
            </div>
            <div className="form-info">
              <label>Lastname</label>
                <input
                  type="text"
                  className="form-account-input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {errors.lastName && <p className="input-error">{errors.lastName}</p>}
            </div>
            <div className="form-info">
              <label>Phonenumber</label>
                <input
                  type="text"
                  className="form-account-input"
                  value={telNumber}
                  onChange={(e) => setTelNumber(e.target.value)}
                />
                {errors.telNumber && <p className="input-error">{errors.telNumber}</p>}
            </div>
            <div className="btn-form-wrapper">
              <button type="submit">Save</button>
              <button onClick={doneEdit}>Done</button>
            </div>
          </div>
        </form>
      ) : (
        <div className="account-edit">
          <button className="account-edit-btn" onClick={editButton}>
            <FontAwesomeIcon className="edit-icon" icon={faPen} /> Edit
          </button>
          <div className="account-info">
            <p>Username</p>
            <div className="info-card">
              <p>@ {escapeHTML(username)}</p>
            </div>
          </div>
          <div className="account-info">
            <p>Email</p>
            <div className="info-card">
              <p>{escapeHTML(emailUser)}</p>
            </div>
          </div>
          <div className="account-info">
            <p>FirstName</p>
            <div className="info-card">
              <p>{escapeHTML(userFirstName)}</p>
            </div>
          </div>
          <div className="account-info">
            <p>LastName</p>
            <div className="info-card">
              <p>{escapeHTML(userLastName)}</p>
            </div>
          </div>
          <div className="account-info">
            <p>Phonenumber</p>
            <div className="info-card">
              <p>{escapeHTML(telNumber)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountForm;
