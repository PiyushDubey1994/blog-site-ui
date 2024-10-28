import React, { useState,useContext, useEffect } from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import axios from "axios";
import {AuthContext} from "../authentication/AuthContext";

const UserRoleForm = ({ user }) => {
    // Define all possible roles
    const allRoles = [
        { id: 1, name: "ROLE_USER" },
        { id: 2, name: "ROLE_ADMIN" },
        // { id: 3, name: "ROLE_SUPER_ADMIN" }
    ];

    const {getAccessToken ,login} = useContext(AuthContext);
    //import {AuthContext} from "../authentication/AuthContext";

    // Set the initial selected roles based on the user's current roles
    const [selectedRoles, setSelectedRoles] = useState(new Set(
        user.roles.map(role => role.name)
    ));

    const handleRoleChange = (event) => {
        const { value, checked } = event.target;
        const updatedRoles = new Set(selectedRoles);

        if (checked) {
            updatedRoles.add(value);
            console.log("added Role for "+user.id, value);
        } else {
            updatedRoles.delete(value);
            console.log("remove Role", value);
        }

        setSelectedRoles(updatedRoles);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Convert the Set to an array
        const rolesArray = Array.from(selectedRoles);

        console.log('Selected Roles:', rolesArray);

        // Perform API call to update roles
        try {
            const token = getAccessToken();
            console.log("Token being sent:", token);
            const response = await axios.put(`http://34.70.118.87:80/api/v1.0/blogsite/auth/user/${user.id}/roles`, rolesArray,{
                headers: {
                  "Authorization": `Bearer ${token}`
                }
              });

            if (response) {
                console.log('Roles updated successfully!');
                setSuccessMessage("Roles updated successfully!")
            } else {
                console.error('Failed to update roles');
                setErrorMessage('Failed to update roles');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    return (
        <form onSubmit={handleSubmit}>
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
                {allRoles.map((role, index) => (
                    <div className="col s12" key={role.id}>
                        <label>
                            <input
                                type="checkbox"
                                className="filled-in"
                                value={role.name}
                                checked={selectedRoles.has(role.name)}
                                onChange={handleRoleChange}
                            />
                            <span>{role.name}</span>
                        </label>
                    </div>
                ))}

                {/* Button aligned after the last checkbox */}
                <div className="col s12">
                    <button type="submit" className="btn">Update Roles</button>
                </div>
            </div>

            {/*<div className="row">*/}
            {/*    {allRoles.map(role => (*/}
            {/*        <div className="col s12" key={role.id}>*/}
            {/*            <label>*/}
            {/*                <input*/}
            {/*                    type="checkbox"*/}
            {/*                    className="filled-in"*/}
            {/*                    value={role.name}*/}
            {/*                    checked={selectedRoles.has(role.name)}*/}
            {/*                    onChange={handleRoleChange}*/}
            {/*                />*/}
            {/*                <span>{role.name}</span>*/}
            {/*            </label>*/}


            {/*        </div>*/}
            {/*    ))}*/}
            {/*    <button type="submit" className="btn">Update Roles</button>*/}
            {/*</div>*/}

        </form>
    );
};

export default UserRoleForm;
