import logo from "../assets/image/logo-no-background.png";
import logoside from "../assets/image/logo-sid.jpg";
import React, {useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
//import '../assets/css/login.css';
import axios from "axios";
import {AuthContext} from "../authentication/AuthContext";
import Header from "./Header.jsx";
//import {AuthContext} from "../authentication/AuthContext.jsx";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'


const LoginForm = () => {

    const navigate = useNavigate();

    const { updateAuthData ,login} = useContext(AuthContext);
    


    const handleForgotPassword = () => {
        navigate('/forgot-password');
    };
    const handleRegistration = () => {
        navigate('/register');
    };
    const [formValues, setFormValues] = useState({
        email: '',
        password: '',

    });
    // State to hold error messages
    const [errors, setErrors] = useState({
        email: '',
        password: '',

    });
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
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                console.log(formValues)
                const response = await axios.post('http://34.70.118.87:80/api/v1.0/blogsite/auth/user/signin', formValues);
               // console.log('login successfully:', response.data);
                //setSuccessMessage(response.data.message)
                const {token, email,enabled2fa, id, roles, type, username} = response.data;

                // Update global auth state and localStorage
                updateAuthData(token, email, id, roles, type, username);
                //
                // login(email, accessToken, roles);
                console.log(enabled2fa)
                if(enabled2fa){
                    navigate('/otp');
                }else{
                    navigate('/dashboard');
                }
                toast.success("Successfully logged in",{
                    position: "top-center",    // Position of the toast
                    autoClose: 2000,          // Auto close after 5 seconds
                    hideProgressBar: false,   // Show or hide progress bar
                    closeOnClick: true,       // Close the toast when clicked
                    pauseOnHover: true,       // Pause auto-close on hover
                    draggable: true,          // Allow dragging to close
                    // progress: undefined,      // Progress bar state
                    theme: "colored",         // Theme: "light", "dark", "colored"
                   style: {                     // Inline styles for the toast
        fontSize: '20px',        // Adjust the font size as needed
        textAlign: 'center'      // Center the text
    }
                });

            } catch (error) {
                setErrorMessage('Login failed: ' + error.response);
                if (error.response) {
                    setErrors({
                        ...errors,
                        api: error.response.data || 'An error occurred while submitting the form.',
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

        <div className="LoginForm">
            <div className="row">
                <div className="col s6">
                    <Header/>
                    <img src={logoside} alt="Logo"
                         style={{height: 400, width: '200px', marginTop: 10}}/>
                </div>
                <div className="col ">
                    <div className="row">
                        <div style={{ marginTop: 100}}>
                            <h4 className="center">Blog Login</h4>
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
                        </div>
                        <form className="container" onSubmit={handleSubmit}>
                            <div className=" row input-field">
                                <input id="email" type="email" value={formValues.email}
                                       onChange={handleChange}/>
                                <label htmlFor="email">Email</label>
                                {errors.email && <span className="helper-text red-text">{errors.email}</span>}
                            </div>
                            <div className="row input-field">
                                <input id="password" type="password" value={formValues.password}
                                       onChange={handleChange}/>
                                <label htmlFor="password">Password</label>
                                {errors.password && <span className="helper-text red-text">{errors.password}</span>}
                            </div>
                            <div className="row">

                                <div className="col s6 right-align">
                                    <a href="#!" className="forgot-password" onClick={handleForgotPassword}>Forgot
                                        Password?</a>
                                </div>

                            </div>
                            <div className="row ">
                                <button className="btn waves-effect waves-light" type="submit">Login</button>
                            </div>
                            <div className="row">
                                <span>Don't have an account?</span><a href="#!" className="forgot-password" onClick={handleRegistration}> Sign up</a>
                            </div>

                        </form>
                    </div>

                </div>
            </div>

        </div>
    )
}
export default LoginForm