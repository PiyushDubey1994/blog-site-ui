import React, { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../authentication/AuthContext';

const BlogPostDetail = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editedArticle, setEditedArticle] = useState('');
    const { getAccessToken } = useContext(AuthContext);

    useEffect(() => {
        axios.get(`http://34.70.118.87:80/api/v1.0/user/blogs/${id}`, {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
            },
        })
        .then((response) => {
            setBlog(response.data);
            setEditedArticle(response.data.article); // Set the initial article
        })
        .catch((error) => {
            console.error('Failed to fetch blog:', error);
        });
    }, [id, getAccessToken]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    // Handle saving the edited article (optionally, you can send a request to the server here)
    const handleSave = () => {
        setBlog({ ...blog, article: editedArticle }); // Update the blog state
        setIsEditing(false); // Exit edit mode
        // Optionally, send a PUT/PATCH request to save the updated article
        axios.put(`http://34.70.118.87:80/api/v1.0/user/blogs/update/${id}`, {
        userId: blog.id,
        blogname: `${blog.blogname}`,
        category: `${blog.category}`,
        article: `${blog.article}`,
        authorname:`${blog.authorname}`,
        timestampofcreation: new Date().toISOString().slice(0, 19)
        },{
            headers: {
              "Authorization": `Bearer ${getAccessToken()}`
            }
          })
        .then(response => {
            console.log("Article updated successfully", response.data);
        })
        .catch(error => {
            console.error("Failed to update the article", error);
        });
    };

    return (
        <div className="container-fluid">
            {/* Fixed Blog Title */}
            <div style={{
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                backgroundColor: '#fff', // Background color to make it more readable
                zIndex: 1100, // Ensure it stays above other elements
                padding: '10px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            }}>
                <h2>{blog.blogname}</h2>
            </div>

            <div className="section" style={{ marginTop: '80px' }}>
                {/* Editable area */}
                {isEditing ? (
                    <textarea
                        value={editedArticle}
                        onChange={(e) => setEditedArticle(e.target.value)}
                        className="materialize-textarea"
                        style={{
                            position: 'fixed',
                            top: '80px', // Adjusted to fit below the fixed title
                            left: '0',
                            width: '100vw',  // Full viewport width
                            height: 'calc(100vh - 80px)', // Full height minus the title height
                            zIndex: 1000,     // Ensure it's on top
                            padding: '20px',
                            fontSize: '16px',
                            border: 'none',
                            outline: 'none',
                            marginTop: '50px',
                            boxSizing: 'border-box',
                            overflow: 'auto',  // Enables scrolling when content overflows
                            resize: 'none',    // Disables manual resizing by the user
                        }}
                    />
                ) : (
                    <p style={{                         
                         overflow: 'auto',                        
                            marginTop: '50px',                           
                            zIndex: 1000,     // Ensure it's on top
                           
                        border: 'none',
                            outline: 'none',
                            resize: 'none',  // Disables manual resizing by the user
                        }}>{blog.article}</p>
                )}
            </div>

            {/* Fixed edit/save buttons */}
            <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 1200, // Ensure it's on top of the textarea and title
            }}>
                {isEditing ? (
                    <>
                        <button className="btn waves-effect waves-light green" onClick={handleSave}>
                            <i className="material-icons left">save</i>Save
                        </button>
                        <button
                            className="btn waves-effect waves-light red"
                            onClick={handleEditToggle}
                            style={{ marginLeft: '10px' }}
                        >
                            <i className="material-icons left">cancel</i>Cancel
                        </button>
                    </>
                ) : (
                    <button className="btn waves-effect waves-light" onClick={handleEditToggle}>
                        <i className="material-icons left">edit</i>Edit Article
                    </button>
                )}
            </div>
        </div>
    );
};

export default BlogPostDetail;
