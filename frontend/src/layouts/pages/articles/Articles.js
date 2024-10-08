import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from "../../portals/Sidebar";
import Header from "../../portals/Navbar";
import Footer from "../../portals/Footer";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Article() {
    const [articles, setArticles] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        axios.get('http://localhost:8080/api/articles')
            .then(res => setArticles(res.data))
            .catch(err => console.log(err));
    }, [])
    function formatDate(string){
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(string).toLocaleDateString([],options);
    }
    // View Article: Variables, Modal handling
    const [viewArticleTitle, setViewArticleTitle] = useState();
    const [viewArticleContents, setViewArticleContents] = useState();
    const [viewArticleAuthor, setViewArticleAuthor] = useState();
    const [viewArticlePublishedDate, setViewArticlePublishedDate] = useState();
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const handleCloseViewModal = () => setShowViewModal(false);
    function handleShowViewModal() {
        setShowViewModal(true)
    }
    // Delete Article: Variables, Modal handling
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const handleCloseDeleteModal = () => setShowDeleteModal(false);
    const [deleteArticleId, setDeleteArticleId] = useState();
    const [deleteArticleTitle, setDeleteArticleTitle] = useState();
    function handleShowDeleteModal() {
        setShowDeleteModal(true)
    }
    // View Article: Variables, Modal handling
    const [publishArticleId, setPublishArticleId] = useState();
    const [isPublished, setIsPublished] = useState();
    const [publishTitle, setPublishTitle] = useState();
    const handleClosePublishModal = () => setShowPublishModal(false);
    function handleShowPublishModal() {
        setShowPublishModal(true)
    }
    // Handle delete article
    const handleDeleteArticle = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.delete("http://localhost:8080/api/articles/" + deleteArticleId);
            if (response.status === 200) {
                navigate("/articles")
                alert("Article deleted successfully!")
                window.location.reload(true)
            }
        } catch (error) {
            console.log("Request fail", error);
        }
    }
    // Handle publish article
    const handlePublishArticle = async (e) => {
        e.preventDefault();
        const article = { 
            isPublished: isPublished === true ? false: true
        }
        const alertSMS = isPublished === true? "unpublished": "published";
        try {
            const response = await axios.put("http://localhost:8080/api/articles/" + publishArticleId, article);
            if (response.status === 201) {
                alert("Article "+alertSMS+" successfully!");
                navigate("/articles")
                window.location.reload(true)
            }
        } catch (error) {
            console.log("Request fail", error);
        }
    }
    
    return (
        <>
            <Header />
            <div id="layoutSidenav">
                <Sidebar />
                <div id="layoutSidenav_content">
                    <main>
                        <div className="container-fluid px-4">
                            <h3 className="mt-4">Articles Management</h3>
                            <ol className="breadcrumb mb-4">
                                <li className="breadcrumb-item active">Articles</li>
                            </ol>
                            <div className="card mb-4">
                                <div className="card-header">
                                    <div className="row">
                                        <div className="col-sm-6 col-md-6 col-lg-6">
                                            <i className="fa fa-table me-1"></i>
                                            Articles List
                                        </div>
                                        <div className="col-sm-6 col-md-6 col-lg-6 ">
                                            <a href="/articles/add" className="btn btn-primary btn-sm float-end">
                                                <i className="fa fa-plus-circle"></i> Create Article
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <table className="table table-striped table-bordered table-hovered" id="datatablesSimple">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Title</th>
                                                <th>Contents</th>
                                                <th>Author</th>
                                                <th>isPublish</th>
                                                <th>Created At</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {articles.map((article, index) => {
                                                return (
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>{article.title}</td>
                                                        <td>{article.contents}</td>
                                                        <td>{article.createdByUserId}</td>
                                                        <td>
                                                            <span className={article.isPublished===true? "btn btn-sm btn-danger": "btn btn-sm btn-success"}
                                                                onClick={() =>{
                                                                    handleShowPublishModal()
                                                                    setPublishArticleId(article.id)
                                                                    setPublishTitle(article.title)
                                                                    setIsPublished(article.isPublished)
                                                                }}>
                                                                {article.isPublished === true ? "Unpublish": "Publish"}
                                                            </span>
                                                        </td>
                                                        <td>{formatDate(article.createdAt)}</td>
                                                        <td className="text-center action">
                                                            <a href={"/articles/"+article.id}><i className="fa fa-pencil text-primary"> </i></a>
                                                            <span
                                                                className="delete-btn"
                                                                onClick={() => {
                                                                    handleShowDeleteModal()
                                                                    setDeleteArticleTitle(article.title)
                                                                    setDeleteArticleId(article.id)
                                                                }}>
                                                                <i className="fa fa-trash text-danger"> </i>
                                                            </span>
                                                            <span onClick={() =>{
                                                                handleShowViewModal()
                                                                setViewArticleTitle(article.title)
                                                                setViewArticleContents(article.contents)
                                                                setViewArticlePublishedDate(formatDate(article.createdAt))
                                                                setViewArticleAuthor(article.createdByUserId)
                                                            }}>
                                                                <i className="fa fa-eye text-info"> </i>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </main>
                    <Footer />
                </div>
            </div>
            {/* Modal Delete Article */}
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                <form onSubmit={handleDeleteArticle}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Article</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure to delete <strong><span className="text-danger">{deleteArticleTitle}</span></strong>?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="submit" className="btn btn-danger float-left" onClick={handleCloseDeleteModal}>Yes</button>
                        <Button variant="secondary" onClick={handleCloseDeleteModal}>No</Button>
                    </Modal.Footer>
                </form>
            </Modal>
            {/* Modal publish Article */}
            <Modal show={showPublishModal} onHide={handlePublishArticle}>
                <form onSubmit={handlePublishArticle}>
                    <Modal.Header closeButton>
                        <Modal.Title>Publish Article</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure to publish <strong><span className="text-danger">{publishTitle}</span></strong>?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="submit" className="btn btn-danger float-left" onClick={handleClosePublishModal}>Yes</button>
                        <Button variant="secondary" onClick={handleClosePublishModal}>No</Button>
                    </Modal.Footer>
                </form>
            </Modal>
            {/* Modal show user details */}
            <Modal show={showViewModal} onHide={handleCloseViewModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Article Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>{viewArticleTitle}</h4>
                    <p><span><small>Author: {viewArticleAuthor} </small>, <small>Published date: {viewArticlePublishedDate}</small></span></p>
                    <p>{viewArticleContents}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseViewModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Article;