import {jwtDecode } from 'jwt-decode';
import  { useContext, useState } from "react";
import { AuthContext } from "../authentication/AuthContext";

export const validateToken = () => {
    const { getAccessToken } = useContext(AuthContext);
  const token = getAccessToken();// Get the token from localStorage
  if (!token) {
    console.log("Token not found");
    return false; // No token found
  }

  try {
    // Decode the token to get its payload
    const decodedToken = jwtDecode(token);
    
    // Check if the token has an expiration time (`exp`)
    if (!decodedToken.exp) {
      console.log("Token does not have an expiration time");
      return false;
    }

    // Get the current time and the expiration time from the token
    const currentTime = Date.now() / 1000; // Current time in seconds
    const tokenExpiryTime = decodedToken.exp; // Expiration time in seconds

    // Check if the token is expired
    if (currentTime > tokenExpiryTime) {
      console.log("Token has expired");
      return false;
    }

    console.log("Token is valid");
    return true; // Token is valid and not expired
  } catch (error) {
    console.error("Invalid token", error);
    return false; // Invalid token
  }
};

export const isLogin = () => {
    if(validateToken()){
        return true;
    }else{
        return false;
    }
}
