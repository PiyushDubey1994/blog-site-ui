import React, {useState, useEffect, useContext} from 'react';
import M from 'materialize-css';
import axios from "axios";
import {initializeMaterialize} from "../components/materialize-init.jsx";
import {AuthContext} from "../authentication/AuthContext.jsx"

// eslint-disable-next-line no-unused-vars
const PostBlog = () => {


    const {authData} = useContext(AuthContext);
        console.log(authData.token)

    const [formValues, setFormValues] = useState({
        userId: authData.userId,
        blogname: '',
        category: '',
        article: '',
        authorname:authData.username,
        timestampofcreation: new Date().toISOString().slice(0, 19)

    });
    const [errors, setErrors] = useState({
        userId:'',
        blogname: '',
        category: '',
        article: '',
        authorname:'',
        timestampofcreation: '' // Added for mandatory field error
    });


    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        initializeMaterialize(); // Initialize Materialize components

        // Update the current time every second
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
            setFormValues((prevValues) => ({
                ...prevValues,
                timestamp: new Date().toISOString(),
            }));
        }, 1000);

        // Clean up the interval on component unmount
        return () => clearInterval(timeInterval);
    }, []);

    useEffect(() => {
        M.AutoInit(); // Initialize Materialize CSS components
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormValues({
            ...formValues,
            [id]: value,
        });
    };

    const validateForm = () => {
        let valid = true;
        let errors = {};

        if (formValues.blogname.length < 20) {
            errors.blogname = 'Blog Name should be of minimum 20 characters';
            valid = false;
        }

        if (formValues.category.length < 20) {
            errors.category = 'Category should be of minimum 20 characters';
            valid = false;
        }

        if (formValues.article.length < 1000) {
            errors.article = 'Article should be of minimum 1000 characters'; // Fixed typo
            valid = false;
        }

        if (!formValues.blogname || !formValues.category || !formValues.article) {
            errors.mandatory = 'All fields are mandatory';
            valid = false;
        }

        setErrors(errors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                console.log(formValues)
                const response = await axios.post('http://34.70.118.87:80/api/v1.0/blogsite/blogs/add', formValues, { headers: {
                    Authorization: `Bearer ${authData.token}`, // Pass token in the Authorization header
                    'Content-Type': 'application/json', 
                  },}
                   );
                console.log('Form submitted successfully:', response.data);
                setSuccessMessage(response.data.message)
            } catch (error) {
                setErrorMessage(error.response.data.message);
                if (error.response) {
                    console.log('Form submitted successfully:', error.response.data.message);
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
        <div className="container">
            <h5 style={{ textAlign:'center',marginTop:'150px' }}>Create a Blog Post</h5>
            <form style={{ marginTop:'50px' }} onSubmit={handleSubmit}>
                <div className="input-field">
                    <input
                        id="blogname"
                        type="text"
                        name="blogname"
                        value={formValues.blogname}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="blogname">Blog Name</label>
                    {errors.blogname && <span className="helper-text red-text">{errors.blogname}</span>}
                </div>

                <div className="input-field">
                    <input
                        id="category"
                        type="text"
                        name="category"
                        value={formValues.category}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="category">Category</label>
                    {errors.category && <span className="helper-text red-text">{errors.category}</span>}
                </div>

                <div className="input-field">
                    <textarea
                        id="article"
                        className="materialize-textarea"
                        name="article"
                        value={formValues.article}
                        onChange={handleChange}
                        required
                        style={{ height: '200px' }}
                    ></textarea>
                    <label htmlFor="article">Article</label>
                    {errors.article && <span className="helper-text red-text">{errors.article}</span>}
                </div>

                <div className="row">
                    <button className="btn waves-effect waves-light" type="submit">Submit</button>
                </div>

                {errors.mandatory && <div className="red-text">{errors.mandatory}</div>}
            </form>
        </div>
    );
};

export default PostBlog;
