import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
//import { AuthContext } from "../../authentication/AuthContext.jsx";
import Header from "./Header.jsx";
import VerifyOTP from "../components/otp/VerifyOTP";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // Step 1: Email input, Step 2: OTP, Step 3: Reset Password
  const [email, setEmail] = useState(""); // Email state
  const [otpVerified, setOtpVerified] = useState(false); // OTP verification state
  const [newPassword, setNewPassword] = useState(""); // New password state
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password state
  //const { authData } = useContext(AuthContext); // AuthContext for authentication
  const navigate = useNavigate();

  const handleValueChange = (newValue) => {
    setStep(newValue);
  };

  // Step 1: Handle Email Submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send request to the server to send reset instructions
      console.log(email);
      const response = await axios.post(
        "http://34.70.118.87:80/api/v1.0/blog/user/reset-password",
        null,
        {
          params: {
            email: encodeURIComponent(email),
          },
        }
      );
      //const response = await axios.post(`http://localhost:8080/api/v1.0/blog/user/reset-password?email=${encodeURIComponent(email)}`);
      toast.success("Reset instructions sent to your email: " + response.data, {
        position: "top-right", // Position of the toast
        autoClose: 3000, // Auto close after 5 seconds
        hideProgressBar: false, // Show or hide progress bar
        closeOnClick: true, // Close the toast when clicked
        pauseOnHover: true, // Pause auto-close on hover
        draggable: true, // Allow dragging to close
        progress: undefined, // Progress bar state
        theme: "colored", // Theme: "light", "dark", "colored"
        style: {
          // Inline styles for the toast
          fontSize: "20px", // Adjust the font size as needed
          textAlign: "center", // Center the text
        },
      });
      setStep(2); // Proceed to OTP verification step
    } catch (error) {
      console.log(error);
      toast.error(error.data, {
        position: "top-right", // Position of the toast
        autoClose: 3000, // Auto close after 5 seconds
        hideProgressBar: false, // Show or hide progress bar
        closeOnClick: true, // Close the toast when clicked
        pauseOnHover: true, // Pause auto-close on hover
        draggable: true, // Allow dragging to close
        progress: undefined, // Progress bar state
        theme: "colored", // Theme: "light", "dark", "colored"
        style: {
          // Inline styles for the toast
          fontSize: "20px", // Adjust the font size as needed
          textAlign: "center", // Center the text
        },
      });
    }
  };

  // Step 2: Handle OTP Verification (passed as a callback to VerifyOTP component)
  const handleOTPVerification = async (otpCode) => {
    setOtpVerified(otpCode);
  };

  // Step 3: Handle Password Reset
  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      console.log(newPassword);
      console.log(confirmPassword);
      toast.error("Passwords do not match", {
        position: "top-right", // Position of the toast
        autoClose: 3000, // Auto close after 5 seconds
        hideProgressBar: false, // Show or hide progress bar
        closeOnClick: true, // Close the toast when clicked
        pauseOnHover: true, // Pause auto-close on hover
        draggable: true, // Allow dragging to close
        progress: undefined, // Progress bar state
        theme: "colored", // Theme: "light", "dark", "colored"
        style: {
          // Inline styles for the toast
          fontSize: "20px", // Adjust the font size as needed
          textAlign: "center", // Center the text
        },
      });

      return;
    }
    try {
      // Send request to the server to send reset instructions
      console.log(email);
      console.log(confirmPassword);
      console.log(otpVerified);
      const response = await axios.post(
        "http://34.70.118.87:80/api/v1.0/blog/user/reset-password/confirm",
        null,
        {
          params: {
            email: encodeURIComponent(email),
            newPassword: confirmPassword,
            otp: otpVerified,
          },
        }
      );
      console.log(response.data);
      if (response.data != null) {
        toast.success("Password reset successfully ", {
          position: "top-right", // Position of the toast
          autoClose: 3000, // Auto close after 5 seconds
          hideProgressBar: false, // Show or hide progress bar
          closeOnClick: true, // Close the toast when clicked
          pauseOnHover: true, // Pause auto-close on hover
          draggable: true, // Allow dragging to close
          progress: undefined, // Progress bar state
          theme: "colored", // Theme: "light", "dark", "colored"
          style: {
            // Inline styles for the toast
            fontSize: "20px", // Adjust the font size as needed
            textAlign: "center", // Center the text
          },
        });

        navigate("/login"); // Redirect to login page after success
      }
      //const response = await axios.post(`http://localhost:8080/api/v1.0/blog/user/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.log(error);
      toast.error("Error sending reset instructions", {
        position: "top-right", // Position of the toast
        autoClose: 3000, // Auto close after 5 seconds
        hideProgressBar: false, // Show or hide progress bar
        closeOnClick: true, // Close the toast when clicked
        pauseOnHover: true, // Pause auto-close on hover
        draggable: true, // Allow dragging to close
        progress: undefined, // Progress bar state
        theme: "colored", // Theme: "light", "dark", "colored"
        style: {
          // Inline styles for the toast
          fontSize: "20px", // Adjust the font size as needed
          textAlign: "center", // Center the text
        },
      });
    }
  };

  return (
    <div className="container">
      <Header />
      {step === 1 && (
        <div
          style={{ marginTop: 50, marginLeft: 200, marginRight: 200 }}
          className="center"
        >
          <h4>Forgot Password</h4>
          <span>No worries, we'll send you reset instructions.</span>
          <div className="row">
            <form className="col s4" onSubmit={handleEmailSubmit}>
              <div className="row input-field">
                <input
                  id="email"
                  type="email"
                  className="validate"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="email">Email</label>
              </div>
              <div className="row">
                <button className="btn waves-effect waves-light" type="submit">
                  Reset Password
                </button>
              </div>
              <div className="row">
                <button
                  className="btn waves-effect waves-light red lighten-1"
                  type="button"
                  onClick={() => navigate("/")}
                >
                  Back to Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {step === 2 && (
        <VerifyOTP
          uemail={email}
          length={6}
          onChange={(otp) => handleOTPVerification(otp)}
          onValueChange={handleValueChange}
        />
      )}

      {step === 3 && (
        <div style={{ marginTop: 50, marginLeft: 200, marginRight: 200 }}
          className="center">
          <h4 style={{ marginTop: 200 }} className="center">
            Set New Password
          </h4>
          <div className="row">
            <form className="col s4" onSubmit={handlePasswordResetSubmit}>
              <div className="row input-field">
                <input
                  id="newPassword"
                  type="password"
                  className="validate"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <label htmlFor="newPassword">New Password</label>
              </div>
              <div className="row input-field">
                <input
                  id="confirmPassword"
                  type="password"
                  className="validate"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <label htmlFor="confirmPassword">Confirm Password</label>
              </div>
              <div className="row">
                <button className="btn waves-effect waves-light" type="submit">
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
