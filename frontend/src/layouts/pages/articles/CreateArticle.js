import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from "../../portals/Sidebar";
import Header from "../../portals/Navbar";
import Footer from "../../portals/Footer";
import axios from "axios";

function CreateArticle() {
    const [state, setState] = useState();
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    // const user = state;
    useEffect(() => {
        axios.get("http://localhost:8080/api/users").then((response) => {
            setUsers(response.data.users);
        });
    }, []);
    const handleOnChange = (e) => {
        const value = e.target.value
        const name = e.target.name
        setState((oldState) => ({ ...oldState, [name]: value }))
    }
    const handleSummit = async (e) => {
        e.preventDefault();
        let { title, contents, createdByUserId, isPublished } = state;
        createdByUserId = parseInt(createdByUserId);
        isPublished = isPublished === "true"? true:false;
        const article = { title, contents, createdByUserId, isPublished }
        try {
            const response = await axios.post("http://localhost:8080/api/articles", article);
            if (response.status === 201) {
                navigate("/articles")
                alert("Create article successfully!")
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
                                <li className="breadcrumb-item active">/articles/create</li>
                            </ol>
                            <div className="row justify-content-center align-items-center">
                                <div className="col-md-8 ">
                                    <div className="card">
                                        <div className="card-header">
                                            <h5>Create Article</h5>
                                        </div>
                                        <div className="card-body">
                                            <form onSubmit={handleSummit}>
                                                <div class="form-group">
                                                    <input type="text" name="title" onChange={handleOnChange} class="form-control" id="title" aria-describedby="emailHelp" placeholder="Enter title" required />
                                                </div>
                                                <div class="form-group">
                                                    <textarea name="contents" onChange={handleOnChange} class="form-control" id="contents" aria-describedby="emailHelp" placeholder="Enter contents" required></textarea>
                                                </div>
                                                <div class="form-group">
                                                    <select className="form-control" name="createdByUserId" onChange={handleOnChange}>
                                                        <option selected>Select Author: </option>
                                                        {users.map((user) => {
                                                            return (
                                                                <option value={user.id}>{user.profile.firstname} {user.profile.lastname}</option>
                                                            )
                                                        })}
                                                    </select>
                                                </div>
                                                <div class="form-group">
                                                    <label className="pl-4">Is published? </label>
                                                    <div class="form-check form-check-inline">
                                                        <input class="form-check-input" onChange={handleOnChange} type="radio" name="isPublished" id="optionTrue" value={true} />
                                                        <label class="form-check-label" htmlFor="optionTrue">True</label>
                                                    </div>
                                                    <div class="form-check form-check-inline">
                                                        <input class="form-check-input" onChange={handleOnChange} type="radio" name="isPublished" id="optionFalse" value={false} />
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

export default CreateArticle;