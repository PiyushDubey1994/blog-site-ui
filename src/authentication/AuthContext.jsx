// eslint-disable-next-line no-unused-vars
import React, { createContext, useContext, useEffect, useState } from 'react';

// Create the context
export const AuthContext = createContext();

// Create a custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};

// Create a provider component
// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState({
        email: localStorage.getItem('email') || '',
        token: localStorage.getItem('accessToken') || '',
        username: localStorage.getItem('username') || '',
        userId: localStorage.getItem('userId') || '',
    });

    const [authState, setAuthState] = useState(() => {
        const savedAuthState = localStorage.getItem('authState');
        return savedAuthState ? JSON.parse(savedAuthState) : { username: '', token: '', roles: [] };
    });



    useEffect(() => {
        localStorage.setItem('authState', JSON.stringify(authState));
    }, [authState]);

    const login = (username, token, roles) => {
        setAuthState({ username, token, roles });
    };

    const logout = () => {
        setAuthState({ username: '', token: '', roles: [] });
        localStorage.removeItem('authState');
    };

    const updateAuthData = (accessToken, email, id, roles, tokenType, username) => {
        const newAuthData = { accessToken, email, id, roles, tokenType, username };
        setAuthData(newAuthData);
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('email', email);
        localStorage.setItem('username', username);
        localStorage.setItem('userId', id);
        localStorage.setItem('roles', JSON.stringify(roles));
        localStorage.setItem('tokenType', tokenType);
    };
    // Method to get accessToken
const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};

// Method to get email
const getEmail = () => {
    return localStorage.getItem('email');
};

// Method to get username
const getUsername = () => {
    return localStorage.getItem('username');
};

// Method to get userId
const getUserId = () => {
    return localStorage.getItem('userId');
};

// Method to get roles (parsed back from JSON)
const getRoles = () => {
    const roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles) : null; // Parse JSON if roles exist
};


// Method to get tokenType
const getTokenType = () => {
    return localStorage.getItem('tokenType');
};

// Method to get tokenType
const userLogout = () => {
    console.log(localStorage.getItem('accessToken'));
    console.log(localStorage.removeItem('accessToken'))
    localStorage.clear();  // Clear token from localStorage
   
    
};


    return (
        <AuthContext.Provider value={{getUserId,getEmail ,userLogout, getRoles,getAccessToken,getUsername,authData, updateAuthData, authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
