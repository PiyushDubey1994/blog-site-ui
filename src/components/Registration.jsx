// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {initializeMaterialize} from "../assets/materialize-init.jsx";
import Header from "./Header.jsx";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

const Registration = () => {
    const navigate = useNavigate();
    const [isChecked, setIsChecked] = useState(false);
    const [formValues, setFormValues] = useState({
        username: '',
        email: '',
        password: '',
        secret : null,
        twoFactorEnabled : isChecked,

    });

    useEffect(() => {
        setFormValues((prevFormValues) => ({
            ...prevFormValues,
            twoFactorEnabled: isChecked,
        }));
    }, [isChecked]);

    const handleToggle = (event) => {
        const newValue = event.target.checked;
        setIsChecked(newValue);
        console.log(newValue);
    };

    // eslint-disable-next-line no-unused-vars
    const handleBackToLogin = () => {
        navigate('/');
    };
    useEffect(() => {
        initializeMaterialize(); // Initialize Materialize components
    }, []);


    // State to hold error messages
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',

    });

    // Handle input change
    const handleChange = (e) => {
        const {id, value} = e.target;
        console.log(`Field: ${id}, Value: ${value}`);
        setFormValues({
            ...formValues,
            [id]: value,
        });
    };

    // Validate the form
    const validateForm = () => {
        let valid = true;
        let errors = {};

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formValues.email)) {
            errors.email = 'Email id should contain “@” and “.com”';
            valid = false;
        }

        // Password validation
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(formValues.password)) {
            errors.password = 'Password should be alphanumeric and at least 8 characters long';
            valid = false;
        }

        setErrors(errors);
        return valid;
    };
   const [qrScan, setQrScan] = useState('');
   const [useremail, setUserEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await axios.post('http://34.70.118.87:80/api/v1.0/blogsite/auth/user/register', formValues);
                console.log('Form submitted successfully:', formValues);
                setUserEmail(formValues.email)
                toast.success(response.data.message,{
                    position: "top-right",    // Position of the toast
                    autoClose: 5000,          // Auto close after 5 seconds
                    hideProgressBar: false,   // Show or hide progress bar
                    closeOnClick: true,       // Close the toast when clicked
                    pauseOnHover: true,       // Pause auto-close on hover
                    draggable: true,          // Allow dragging to close
                    progress: undefined,      // Progress bar state
                    theme: "colored",         // Theme: "light", "dark", "colored"
                });
                if (formValues.twoFactorEnabled){
                    console.log(response.data)
                    console.log(response.data.message)
                    setTimeout(() => {
                        navigate("/qrcodeAuth", { state: { qrScannerCode: response.data.qrcode, uemail: formValues.email } });// Replace with your target route
                      }, 4000);
                    
                }else {
                    setTimeout(() => {
                        navigate("/login");// Replace with your target route
                      }, 4000);
                    navigate("/login");
                }

               // setSuccessMessage(response.data.message)
            } catch (error) {
                toast.error(error.message,{
                    position: "top-right",    // Position of the toast
                    autoClose: 3000,          // Auto close after 5 seconds
                    hideProgressBar: false,   // Show or hide progress bar
                    closeOnClick: true,       // Close the toast when clicked
                    pauseOnHover: true,       // Pause auto-close on hover
                    draggable: true,          // Allow dragging to close
                    progress: undefined,      // Progress bar state
                    theme: "colored",         // Theme: "light", "dark", "colored"
                });
                //setErrorMessage(error.response.data.message);
                if (error.response) {
                    console.log(error.response.data.message);
                    setErrors({
                        ...errors,
                        api: error.response.data.message || 'An error occurred while submitting the form.',
                    });
                } else if (error.request) {
                    setErrors({
                        ...errors,
                        api: 'No response received from the server.',
                    });
                } else {
                    setErrors({
                        ...errors,
                        api: 'An unexpected error occurred.',
                    });
                }
            }
        }
    };


    return (
        <div className="row">
            <div className="row ">
                <ToastContainer/>
                <div className="col s12 center-align">
                    <Header/>
                    <h4>Blog Sign Up</h4>
                </div>

            </div>
            <div className="col"></div>
            <div className="col">
                {errorMessage && (
                    <div className="alert alert-danger" role="alert">
                        {errorMessage}
                    </div>
                )}
                {successMessage && (
                    <div className="alert alert-success" role="alert">
                        {successMessage}
                    </div>
                )}
                <div className="row">
                    <form className="col s12 " onSubmit={handleSubmit}>
                        <div className=" row input-field">
                            <input id="username" type="text" className="validate" value={formValues.username}
                                   onChange={handleChange}/>
                            <label htmlFor="name">User Name</label>
                        </div>
                        <div className="row input-field">
                            <input id="email" type="email" className="validate" value={formValues.email}
                                   onChange={handleChange}/>
                            <label htmlFor="email">Email</label>
                            {errors.email && <span className="helper-text red-text">{errors.email}</span>}
                        </div>
                        <div className="row input-field">
                            <input id="password" type="password" className="validate" value={formValues.password}
                                   onChange={handleChange}/>
                            <label htmlFor="password">Create Password</label>
                            {errors.password && <span className="helper-text red-text">{errors.password}</span>}
                        </div>
                        <div className="row">
                            <div className="switch">
                                <label style={{paddingRight: 80}}>Two-factor authentication (2FA)</label>
                                <label>
                                    Disable
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={handleToggle} // Trigger handleToggle when the switch is toggled
                                    />
                                    <span className="lever"></span>
                                    Enable
                                </label>
                            </div>
                        </div>
                        <div className="row">
                            <button className="btn m- waves-effect waves-light" type="submit">Register</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="col"></div>
        </div>

    );
};

export default Registration;
