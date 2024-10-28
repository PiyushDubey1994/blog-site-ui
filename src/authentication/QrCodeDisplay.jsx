import React from 'react';
import {useLocation} from "react-router-dom";
import OTPInput from "../components/otp/OTPInput.jsx";
import {ToastContainer} from "react-toastify";
import Header from "../components/Header.jsx";

const QrCodeDisplay = () => {

    const location = useLocation();
    const { qrScannerCode ,uemail} = location.state || {};
    const handleOTPChange = (otp) => {
        console.log('Entered OTP:', otp);
    };
    return (
        <div>
            <ToastContainer/>
            <Header />
            <h5>Activate(2FA) Two Factor Authentication</h5>
            <h6>Scan the QR Code</h6>
            <img
                src={qrScannerCode}
                alt="Scan the QR Code"
                style={{marginTop: 25, width: '200px', height: '200px'}}
            />
            <div>
                {/* <h6>Enter OTP</h6> */}
                <OTPInput length={6} onChange={handleOTPChange} uemail={uemail} type={"new"}/>
            </div>
        </div>
    );
}

export default QrCodeDisplay;
