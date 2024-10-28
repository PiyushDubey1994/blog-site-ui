import React, { useContext, useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min.js';

import PostBlog from "./PostBlog.jsx";
import Header from "./Header.jsx";
import {AuthContext} from "../authentication/AuthContext.jsx";
import UserTableView from "./UserTableView.jsx";
import BlogPostDetail from "./blog/BlogPostDetail.jsx";
import BlogPostList from "./blog/BlogPostList.jsx";

const DashBoard = () => {
    const navigate = useNavigate();
    const { authData,getUserId,getUsername,getAccessToken } = useContext(AuthContext);
    const [blogs, setBlogs] = useState([]); // State to store blogs data
    const [loading, setLoading] = useState(true); // State to handle loading status
    const [error, setError] = useState(null); // State to handle errors

    const handleNavigation = (path) => {
        console.log(path);
        navigate(path);
    };

    // Fetch posts from the API when the component mounts
    useEffect(() => {
        fetchPosts();
    }, []);

    // Function to fetch posts
    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://34.70.118.87:80/api/v1.0/user/blogs/getall', {headers: {
                Authorization: `Bearer ${getAccessToken()}`,
                'Content-Type': 'application/json'
              }
            });
            setBlogs(response.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    // Handle post deletion in the parent
    const handleDeletePost = (postId) => {
        setBlogs((prevBlogs) => prevBlogs.filter((post) => post.id !== postId));
    };

    useEffect(() => {
        // Fetch blogs data from the API
        axios.get('http://34.70.118.87:80/api/v1.0/user/blogs/getall', {headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            'Content-Type': 'application/json'
          }
        })
            .then(response => {
                console.log(response.data);
                setBlogs(response.data); // Update state with fetched data
               // setLoading(false);
            })
            .catch(error => {
                setError('Failed to fetch blogs');
                //setLoading(false);
            });
    }, []);
    // const blogs = [];
    //
    // for (let i = 1; i <= 1000; i++) {
    //     blogs.push({
    //         id: i,
    //         title: `Blog ${i}`,
    //         summary: `This is the summary of blog ${i}.`,
    //         content: `Full content of blog ${i}.`
    //     });
    // }

    return (
        <div style={{display: 'flex'}}>
            <Header />
            {/* Main Content */}
            <main style={{flexGrow: 1, padding: '5px', marginLeft: '0px'}}>
                {/*<nav className="nav-wrapper" style={{width: '100%', zIndex: 1000}}>*/}
                {/*    <div className="nav-wrapper">*/}
                {/*        <a style={{marginLeft: '10px'}} href="#!" className="brand-logo">Blog Site</a>*/}
                {/*        <span style={{fontSize: 18, float: 'right', paddingRight: 25}}>*/}
                {/*            Logged in as: {authData.username}*/}
                {/*        </span>*/}
                {/*    </div>*/}
                {/*</nav>*/}
                <div className="containerkk">
                    <Routes>
                        <Route path="/blogs" element={<BlogPostList blogs={blogs} />} />
                        <Route path="blog/:id" element={<BlogPostDetail post={blogs} />} />
                        <Route path="postblog" element={<PostBlog />} />
                        <Route path="userList" element={<UserTableView />} />
                        <Route path="profile" element={<div>Logout</div>} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

export default DashBoard;
