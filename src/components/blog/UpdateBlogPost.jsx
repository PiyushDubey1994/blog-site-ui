import React, { useEffect, useContext,useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {AuthContext} from "../../authentication/AuthContext"
const UpdateBlogPost = ({ blogs }) => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null); // Initialize as null to handle conditional rendering
    const [isEditing, setIsEditing] = useState(false); // Track if in edit mode
    const [updatedArticle, setUpdatedArticle] = useState(""); // Store edited content
    const { authData,getUserId,getUsername,getAccessToken } = useContext(AuthContext);
    useEffect(() => {
        // Fetch blog data from the API
        axios.get(`http://34.70.118.87:80/api/v1.0/user/blogs/${id}`,{
            headers: {
              "Authorization": `Bearer ${getAccessToken()}`
            }
          })
            .then(response => {
                console.log(response.data);
                setBlog(response.data); // Update state with fetched data
                setUpdatedArticle(response.data.article); // Set article for editing
            })
            .catch(error => {
                console.error("Failed to fetch blog post", error);
            });
    }, [id]);

    if (!blog) {
        return <h2>Post not found</h2>;
    }

    // Toggle between edit and view modes
    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    // Handle input change in the textarea
    const handleArticleChange = (e) => {
        setUpdatedArticle(e.target.value);
         // Update the article as user types
    };

    // Handle saving the edited article (optionally, you can send a request to the server here)
    const handleSave = () => {
        setBlog({ ...blog, article: updatedArticle }); // Update the blog state
        setIsEditing(false); // Exit edit mode
        // Optionally, send a PUT/PATCH request to save the updated article
        axios.put(`http://34.70.118.87:80/api/v1.0/user/blogs/update/${id}`, {
        userId: blog.id,
        blogname: `${blog.blogname}`,
        category: `${blog.category}`,
        article: `${updatedArticle}`,
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
        <div className="container">
            <div className="section">
                <h2>{blog.blogname}</h2>
                {/* <button onClick={handleEditToggle}>
                    {isEditing ? "Cancel" : "Edit Article"}
                </button>

                {isEditing && (
                    <button onClick={handleSave}>
                        Save
                    </button>
                )} */}
                <button  style={{ marginLeft: '10px', marginBottom: '10px' }} className={`btn waves-effect waves-light ${isEditing ? 'red' : ''}`} onClick={handleEditToggle}>
    {isEditing ? (
        <>
            <i className="material-icons left">cancel</i>Cancel
        </>
    ) : (
        <>
            <i className="material-icons left">edit</i>Edit Article
        </>
    )}
</button>

{isEditing && (
    <button
        className="btn waves-effect waves-light"
        onClick={handleSave}
        style={{ marginLeft: '10px', marginBottom: '10px' }} // Adds spacing between buttons
    >
        <i className="material-icons left">save</i>Save
    </button>
)}

                {isEditing ? (
                    <textarea
                        value={updatedArticle} // Set value of textarea to the editable content
                        onChange={handleArticleChange} // Update state on user input
                        rows="100"
                        cols="80"
                    />
                ) : (
                    <p>{blog.article}</p> // Display the article in view mode
                )}

                
            </div>
        </div>
    );
};

export default UpdateBlogPost;
