import React, {useState, useRef, useContext} from 'react';
import axios from 'axios';
import {toast, ToastContainer} from "react-toastify";
import {useLocation, useNavigate} from 'react-router-dom';
import {AuthContext} from "../../authentication/AuthContext.jsx";
const VerifyOTP = ({length = 6, onChange,onValueChange , uemail,type}) => {
    const [otp, setOtp] = useState(new Array(length).fill(''));
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const {authData} = useContext(AuthContext);
    const handleChange = (element, index) => {
        const value = element.value.replace(/[^0-9]/g, ''); // Only allow numbers

        if (value.length > 1) {
            // If the user pastes a multi-digit number into an input field, only use the first digit
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to the next input field if not the last one and if the value is not empty
        if (index < length - 1 && value) {
            inputRefs.current[index + 1].focus();
        }

        // Call the onChange function with the OTP
        onChange(newOtp.join(''));
    };

    const handleKeyDown = (event, index) => {
        if (event.key === 'Backspace' && otp[index] === '') {
            if (index > 0) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    const handlePaste = (event) => {
        const pastedData = event.clipboardData.getData('text').slice(0, length);
        if (!/^[0-9]+$/.test(pastedData)) return; // Only allow numbers
        const newOtp = pastedData.split('').slice(0, length);
        setOtp(newOtp);

        // Move focus to the appropriate input field
        const nextInputIndex = Math.min(pastedData.length - 1, length - 1);
        inputRefs.current[nextInputIndex].focus();

        // Call the onChange function with the OTP
        onChange(newOtp.join(''));
    };

    const otpCode = otp.join('');
    const data1 = {
        code: otpCode,
        email: uemail,
    };

    const handleSubmit = async () => {
        if (otpCode.length === length) {
            try {
                console.log(data1);
                console.log(authData.accessToken)
                const response = await axios.post('http://34.70.118.87:80/api/v1.0/blog/user/reset-password/verify-otp',null, {
                    params: {
                        email: encodeURIComponent(data1.email),
                        otp: data1.code
                    },
                }
                    );
                  console.log(data1);
                toast.success('OTP Verified:',{
                    position: "top-right",    // Position of the toast
                    autoClose: 3000,          // Auto close after 5 seconds
                    hideProgressBar: false,   // Show or hide progress bar
                    closeOnClick: true,       // Close the toast when clicked
                    pauseOnHover: true,       // Pause auto-close on hover
                    draggable: true,          // Allow dragging to close
                    progress: undefined,      // Progress bar state
                    theme: "colored",         // Theme: "light", "dark", "colored"
                });
                onValueChange(3);
                console.log('OTP Verified:', response.data);
            
            } catch (error) {
               
                toast.error('Entered wrong verifying OTP: ',{
                    position: "top-right",    // Position of the toast
                    autoClose: 3000,          // Auto close after 5 seconds
                    hideProgressBar: false,   // Show or hide progress bar
                    closeOnClick: true,       // Close the toast when clicked
                    pauseOnHover: true,       // Pause auto-close on hover
                    draggable: true,          // Allow dragging to close
                    progress: undefined,      // Progress bar state
                    theme: "colored",         // Theme: "light", "dark", "colored"
                    style: {
            // Inline styles for the toast
            fontSize: "20px", // Adjust the font size as needed
            textAlign: "center", // Center the text
          },
                });
                console.error('Entered wrong verifying OTP:', error);
            }
        } else {
            alert('Please enter the full OTP.');
        }
    };

    return (
        
        <div style={{ marginTop: 50, marginLeft: 200, marginRight: 200 }}
          className="center">
        <div>
            <h5>Verify Your two-factor authentication(2FA)</h5>
            <h6>Enter authentication code.</h6>
        </div>
            <div style={{display: 'flex', justifyContent: 'center', gap: '10px'}}>
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(ref) => (inputRefs.current[index] = ref)}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleChange(e.target, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        style={{
                            width: '40px',
                            height: '40px',
                            textAlign: 'center',
                            fontSize: '18px',
                        }}
                    />
                ))}
            </div>
            <div style={{textAlign: 'center', marginTop: '20px'}}>
                <button className="btn m- waves-effect waves-light" type="submit" onClick={handleSubmit} > Verify OTP</button>
            </div>
        </div>
    );
};

export default VerifyOTP;
