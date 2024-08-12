import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from "../../portals/Sidebar";
import Header from "../../portals/Navbar";
import Footer from "../../portals/Footer";
import axios from "axios";

function EditArticle() {
    const [title, setTitle] = useState();
    const [contents, setContents] = useState();
    const [createdByUserId, setCreatedByUserId] = useState();
    const [isPublished, setIsPublished] = useState();
    const [users, setUsers] = useState([]);
    const [articleData, setArticleData] = useState([]);

    const navigate = useNavigate();
    const articleId = window.location.pathname;
    const id = articleId.substring(articleId.lastIndexOf('/') + 1);
    // get user 
    useEffect(() => {
        axios.get("http://localhost:8080/api/users").then((response) => {
            setUsers(response.data.users);
        });
    }, []);
    // get article by ID
    useEffect(() => {
        axios.get('http://localhost:8080/api/articles/' + id)
            .then(res => {
                setArticleData(res.data)
            })
            .catch(err => console.log(err));
    }, [])
    // handle update article
    const handleSummit = async (e) => {
        e.preventDefault();
        // createdByUserId = parseInt(createdByUserId);
        // isPublished = isPublished === "true"? true:false;
        const article = { 
            title: title === undefined? articleData.title: title, 
            contents: contents === undefined? articleData.contents : contents, 
            createdByUserId: createdByUserId === undefined? articleData.createdByUserId: parseInt(createdByUserId), 
            isPublished: isPublished === undefined? articleData.isPublished : isPublished
        }
        try {
            const response = await axios.put("http://localhost:8080/api/articles/"+id, article);
            if (response.status === 201) {
                navigate("/articles")
                alert("Update article successfully!")
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
                                <li className="breadcrumb-item active">/articles/edit</li>
                            </ol>
                            <div className="row justify-content-center align-items-center">
                                <div className="col-md-8 ">
                                    <div className="card">
                                        <div className="card-header">
                                            <h5>Update Article</h5>
                                        </div>
                                        <div className="card-body">
                                            <form onSubmit={handleSummit}>
                                                <div class="form-group">
                                                    <input type="text" name="title" value={articleData.title} onChange={(e) => setTitle(e.target.value)} class="form-control" id="title" aria-describedby="emailHelp" placeholder="Enter title" required />
                                                </div>
                                                <div class="form-group">
                                                    <textarea name="contents" value={articleData.contents} onChange={(e) => setContents(e.target.value)} class="form-control" id="contents" aria-describedby="emailHelp" placeholder="Enter contents" required></textarea>
                                                </div>
                                                <div class="form-group">
                                                    <select className="form-control" name="createdByUserId" onChange={(e) => setCreatedByUserId(e.target.value)}>
                                                        {users.map((user) => {
                                                            return (
                                                                <option value={parseInt(user.id)} selected={user.id === articleData.createdByUserId? "selected": null}>
                                                                    {user.profile.firstname} {user.profile.lastname}
                                                                </option>
                                                            )
                                                        })}
                                                    </select>
                                                </div>
                                                <div class="form-group">
                                                    <label className="pl-4">Is published? </label>
                                                    <div class="form-check form-check-inline">
                                                        <input class="form-check-input" checked={articleData.isPublished === true ? "checked": null} onClick={() => setIsPublished(true)} type="radio" name="isPublished" id="optionTrue" value={true} />
                                                        <label class="form-check-label" htmlFor="optionTrue">True</label>
                                                    </div>
                                                    <div class="form-check form-check-inline">
                                                        <input class="form-check-input" checked={articleData.isPublished === false ? "checked": null} onClick={() => setIsPublished(false)} type="radio" name="isPublished" id="optionFalse" value={false} />
                                                            <label class="form-check-label" htmlFor="optionFalse">False</label>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <button type="submit" class="btn btn-primary"><i className="fa fa-check"></i> Submit</button>
                                                    <a href="/articles" className="btn btn-secondary float-end"><i className="fa fa-times"></i> Cancel</a>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                    <Footer />
                </div>
            </div>
        </>
    )
}

export default EditArticle;