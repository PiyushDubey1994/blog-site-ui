import React, { useState } from 'react';
import BlogPostCard from './BlogPostCard';
const BlogPostList = ({ blogs }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(4);

    // Filter posts based on search query
    const filteredPosts = blogs.filter(post =>
        post.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // Render pagination controls
    const renderPagination = () => {
        const pageNumbers = [];
        const maxVisiblePages = 10; // Number of pages to show around the current page

        let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
        let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

        // Adjust start page if not enough pages are visible at the start
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(endPage - maxVisiblePages + 1, 1);
        }

        // Add previous button
        if (currentPage > 1) {
            pageNumbers.push(
                <li key="prev" className="waves-effect">
                    <a href="#!" onClick={() => handlePageChange(currentPage - 1)}>«</a>
                </li>
            );
        }

        // Add page numbers
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <li key={i} className={i === currentPage ? 'active' : 'waves-effect'}>
                    <a href="#!"  style={{alignContent:'center'}} onClick={() => handlePageChange(i)}>{i}</a>
                </li>
            );
        }

        // Add next button
        if (currentPage < totalPages) {
            pageNumbers.push(
                <li key="next" className="waves-effect" >
                    <a href="#!" onClick={() => handlePageChange(currentPage + 1)} >»</a>
                </li>
            );
        }

        return pageNumbers;
    };

    return (
        <div className="containerl" style={{paddingTop: '5rem', paddingBottom: '2rem'}}>
            <div className="input-field">
                <input
                    type="text"
                    id="search"
                    placeholder="Search post..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
                <label htmlFor="search">Search</label>
            </div>

            <div className="row">
                {currentPosts.length > 0 ? (
                    currentPosts.map(post => (
                        <BlogPostCard key={post.id} post={post} />
                    ))
                ) : (
                    <p>No posts found</p>
                )}
            </div>

            {totalPages > 1 && (
                <ul className="pagination align-content-center" >
                    {renderPagination()}
                </ul>
            )}
        </div>
    );
};

export default BlogPostList;
