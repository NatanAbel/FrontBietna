import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateUser, userLogedIn } from "../../store/auth/slice";

const API_URL = import.meta.env.VITE_BACK_URL;

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
    const dispatch = useDispatch()
//   const [user, setUser] = useState(username);
//   const [email, setEmail] = useState(emailUser);
//   const [firstName, setFirstName] = useState(userFirstName);
//   const [lastName, setLastName] = useState(userLastName);
//   const [phoneNumber, setPhoneNumber] = useState(telNumber);

  const handleForm = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log("token........AccountForm", token);
    const body = {
      userName: username,
      email: emailUser,
      firstName: userFirstName,
      lastName: userLastName,
      phoneNumber: telNumber,
    };
    try {
      const res = await axios.put(`${API_URL}/auth/profile`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("res.data......", res.data);
      
      if(res.status === 200){
        dispatch(updateUser(res.data))         
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  useEffect(()=>{
},[dispatch,username,
    emailUser,
    userFirstName,
    userLastName,
    telNumber,])
    
  return (
    <div className="account-form" style={{ margin: "0 auto" }}>
      <form onSubmit={handleForm}>
        <div className="username-and-email">
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={emailUser}
              onChange={(e) => setUserEmail(e.target.value)}
            />
          </label>
        </div>
        <div
          className="firstname-and-lastname"
          style={{ display: "flex", gap: "10px" }}
        >
          <label>
            Firstname
            <input
              type="text"
              value={userFirstName}
              onChange={(e) => setUserFirstName(e.target.value)}
            />
          </label>
          <label>
            Lastname
            <input
              type="text"
              value={userLastName}
              onChange={(e) => setUserLastName(e.target.value)}
            />
          </label>
        </div>
        <div className="phone-number">
          <label>
            Phonenumber
            <input
              type="number"
              value={telNumber}
              onChange={(e) => setTelNumber(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default AccountForm;
