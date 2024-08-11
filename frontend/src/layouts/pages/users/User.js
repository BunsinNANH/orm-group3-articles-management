import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from "../../portals/Sidebar";
import Header from "../../portals/Navbar";
import Footer from "../../portals/Footer";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import App from "../../App";

function User() {
    const baseURL = "http://localhost:8080/api/users";
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const [viewUsername, setViewUsername] = useState();
    const [viewFirstname, setViewFirstname] = useState();
    const [viewLastname, setViewLastname] = useState();
    const [viewEmail, setViewEmail] = useState();
    const [viewCreatedAt, setViewCreatedAt] = useState();
    useEffect(() => {
        axios.get(baseURL).then((response) => {
            setUsers(response.data.users);
        });
    }, []);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const handleCloseDeleteModal = () => setShowDeleteModal(false);
    const handleCloseViewModal = () => setShowViewModal(false);
    function handleShowDeleteModal() {
        setShowDeleteModal(true)
    }
    function handleShowViewModal() {
        setShowViewModal(true)
    }
    const [userDeleteId, setUserDeleteId] = useState();
    const [username, setUsername] = useState("");
    const handleDeleteUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.delete("http://localhost:8080/api/users/" + userDeleteId);
            if (response.status === 200) {
                navigate("/users")
                alert("User deleted successfully!")
                window.location.reload(true)
            }
        } catch (error) {
            console.log("Request fail", error);
        }
    }
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
                            <h3 className="mt-4">Users Management</h3>
                            <ol className="breadcrumb mb-4">
                                <li className="breadcrumb-item active">Users</li>
                            </ol>
                            <div className="card mb-4">
                                <div className="card-header">
                                    <div className="row">
                                        <div className="col-sm-6 col-md-6 col-lg-6">
                                            <i className="fa fa-table me-1"></i>
                                            Users List
                                        </div>
                                        <div className="col-sm-6 col-md-6 col-lg-6 ">
                                            <a href="/users/add" className="btn btn-primary btn-sm float-end">
                                                <i className="fa fa-plus-circle"></i> Add User
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <table className="table table-striped table-bordered table-hovered" id="datatablesSimple">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Username</th>
                                                <th>Firstname</th>
                                                <th>Lastname</th>
                                                <th>Email</th>
                                                {/* <th>Role</th> */}
                                                <th>Created At</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user, index) => {
                                                return (
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>{user.username}</td>
                                                        <td>{user.profile.firstname}</td>
                                                        <td>{user.profile.lastname}</td>
                                                        <td>{user.profile.email}</td>
                                                        {/* <td>{user.roleId === 2 ? "User" :"Admin"}</td> */}
                                                        <td>{formatDate(user.profile.createdAt)}</td>
                                                        <td className="text-center action">
                                                            <a href={"/users/" + user.id}><i className="fas fa-pencil text-primary"> </i></a>
                                                            <span className="delete-user-btn"
                                                                onClick={() => {
                                                                    handleShowDeleteModal()
                                                                    setUsername(user.username)
                                                                    setUserDeleteId(user.id)
                                                                }}>
                                                                <i className="fas fa-trash text-danger"> </i></span>
                                                            <span className="view-user-btn" onClick={() => {
                                                                handleShowViewModal()
                                                                setViewEmail(user.profile.email)
                                                                setViewUsername(user.username)
                                                                setViewFirstname(user.profile.firstname)
                                                                setViewLastname(user.profile.lastname)
                                                                setViewCreatedAt(user.profile.createdAt)
                                                            }}>
                                                                <i className="fas fa-eye text-info"> </i>
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
            {/* Modal Delete user */}
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                <form onSubmit={handleDeleteUser}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure to delete <strong><span className="text-danger">{username}</span></strong>?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="submit" className="btn btn-danger float-left" onClick={handleCloseDeleteModal}>Yes</button>
                        <Button variant="secondary" onClick={handleCloseDeleteModal}>No</Button>
                    </Modal.Footer>
                </form>
            </Modal>
            {/* Modal show user details */}
            <Modal show={showViewModal} onHide={handleCloseViewModal}>
                <Modal.Header closeButton>
                    <Modal.Title>User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-4 text-center">
                            <img className="view-user-avatar" src="https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg" />
                            <h5>{viewUsername}</h5>
                        </div>
                        <div className="col-md-8 ">
                            <ul class="list-group">
                                <li class="list-group-item"><b>Firstname:</b> {viewFirstname}</li>
                                <li class="list-group-item"><b>Lastname:</b> {viewLastname}</li>
                                <li class="list-group-item"><b>Email:</b> {viewEmail}</li>
                                <li class="list-group-item"><b>Created At:</b> {formatDate(viewCreatedAt)}</li>
                            </ul>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseViewModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default User;