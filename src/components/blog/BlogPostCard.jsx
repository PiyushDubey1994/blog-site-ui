import React, {useContext} from 'react';
import { Link,useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import {AuthContext} from "../../authentication/AuthContext"
const BlogPostCard = ({ post,onDelete }) => {


    const navigate = useNavigate(); // Initialize the navigate hook
    const { authData,getUserId,getUsername,getAccessToken } = useContext(AuthContext);
    // Function to fetch the list of posts
    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://34.70.118.87:80/api/v1.0/user/blogs/getall',{headers: {
                Authorization: `Bearer ${getAccessToken()}`,
                'Content-Type': 'application/json'
              }
            }); // Replace with your API endpoint
           // setPosts(response.data); // Update the state with fetched posts
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };


    const handleNavigate = () => {
        // Navigate to another route, e.g., '/dashboard'
        console.log(post.id);
        navigate(`/blog/update/${post.id}`); 
    };

    // Function to handle the delete action
    const handleDelete = async () => {
        try {
            // Send a DELETE request to the backend API
            await axios.delete(`http://34.70.118.87:80/api/v1.0/user/blogs/delete/${post.id}`,{
                headers: {
                  "Authorization": `Bearer ${getAccessToken()}`
                }
              });
            console.log(`Post with ID ${post.id} deleted`);
            // Call onDelete (passed from parent) to update the UI after deletionblogs
            //onDelete(post.id);
             // Refetch the posts after deletion
             //fetchPosts(); // Re-fetch the updated list of posts
            // navigate(`blogs`); 
            // Call parent's onDelete to update the blog post list
            onDelete(post.id);

        } catch (error) {
            console.error("Error deleting the post:", error);
        }
    };

    
    return (
        <div className="col s12 m6">
            <div className="card fixed-card" >
            <span className="card-title">{post.category}</span>
                <div className="card-content">
                    <p>{post.article}</p>
                </div>
                <div className="card-action">
                <IconButton onClick={handleNavigate}color="primary">
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={handleDelete}  color="secondary">
                        <DeleteIcon />
                    </IconButton>
                    <Link to={`/blog/${post.id}`} className="btn-sm btn-primary">Read more...</Link>
                </div>
            </div>
        </div>
    );
};

export default BlogPostCard;
