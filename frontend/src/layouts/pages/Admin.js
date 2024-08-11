import React,{useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from "../portals/Sidebar";
import Header from "../portals/Navbar";
import Footer from "../portals/Footer";
import axios from "axios";

function Admin() {
    const [articles, setArticles] = useState([]);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        axios.get('http://localhost:8080/api/articles')
            .then(res => setArticles(res.data))
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8080/api/users')
            .then(res => setUsers(res.data.users))
            .catch(err => console.log(err));
    }, []);
    function formatDate(string){
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(string).toLocaleDateString([],options);
    }
    return (
        <>
            <Header />
            <div id="layoutSidenav">
                <Sidebar />
                <div id="layoutSidenav_content">
                    <main>
                        <div className="container-fluid px-4">
                            <h1 className="mt-4">Dashboard</h1>
                            <ol className="breadcrumb mb-4">
                                <li className="breadcrumb-item active">Dashboard</li>
                            </ol>
                            <div className="row">
                                <div className="col-xl-4 col-md-6">
                                    <div className="card bg-primary text-white mb-4">
                                        <div className="card-body">Users Total</div>
                                        <div className="card-footer d-flex align-items-center justify-content-between">
                                            <span className="small text-white stretched-link">{users.length} users</span>
                                            <div className="small text-white"><i className="fas fa-users"></i></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-4 col-md-6">
                                    <div className="card bg-warning text-white mb-4">
                                        <div className="card-body">Articles Total</div>
                                        <div className="card-footer d-flex align-items-center justify-content-between">
                                            <span className="small text-white stretched-link">{articles.length} articles</span>
                                            <div className="small text-white"><i className="fas fa-font"></i></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-4 col-md-6">
                                    <div className="card bg-success text-white mb-4">
                                        <div className="card-body">Articles Published</div>
                                        <div className="card-footer d-flex align-items-center justify-content-between">
                                            <span className="small text-white stretched-link">20 articles</span>
                                            <div className="small text-white"><i className="fas fa-font"></i></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card mb-4">
                                <div className="card-header">
                                    <i className="fas fa-table me-1"></i>
                                    New Released
                                </div>
                                <div className="card-body">
                                    <table className="table table-striped table-hovered table-bordered" id="datatablesSimple">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Title</th>
                                                <th>Contents</th>
                                                <th>Author</th>
                                                <th>Published date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {articles.map((article) =>{
                                                if(article.isPublished === true){
                                                    let index = 1;
                                                    return(
                                                        <tr>
                                                            <td>{index++}</td>
                                                            <td>{article.title}</td>
                                                            <td>{article.contents}</td>
                                                            <td>{article.createdByUserId}</td>
                                                            <td>{formatDate(article.createdAt)}</td>
                                                        </tr>
                                                    )
                                                }
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
        </>
    )
}

export default Admin;