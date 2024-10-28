import React, { useState, useEffect } from 'react';
import M from 'materialize-css/dist/js/materialize.min.js';
import '../assets/css/CheckboxForm.css'

const CheckboxForm = () => {
    const [selectedOptions, setSelectedOptions] = useState([]);

    const options = [
        { id: 1, label: 'ROLE_USER' },
        { id: 2, label: 'ROLE_ADMIN' },

    ];

    useEffect(() => {
        M.AutoInit();
    }, []);

    const handleCheckboxChange = (event) => {
        const { id, checked } = event.target;
        const optionId = parseInt(id);

        setSelectedOptions(prevState => {
            if (checked) {
                return [...prevState, optionId];
            } else {
                return prevState.filter(option => option !== optionId);
            }
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Selected Options:', selectedOptions);
    };

    return (
        <form onSubmit={handleSubmit} className="checkbox-form">
            <div className="row">
                {options.map(option => (
                    <div className="col 12" key={option.id}>
                        <label>
                            <input
                                type="checkbox"
                                id={option.id.toString()}
                                className="filled-in"
                                checked={selectedOptions.includes(option.id)}
                                onChange={handleCheckboxChange}
                            />
                            <span>{option.label}</span>
                        </label>
                    </div>
                ))}
            </div>
            <button className="btn waves-effect waves-light" type="submit">Submit</button>
        </form>
    );
};

export default CheckboxForm;
