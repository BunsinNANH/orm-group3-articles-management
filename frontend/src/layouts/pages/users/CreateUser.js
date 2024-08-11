import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from "../../portals/Sidebar";
import Header from "../../portals/Navbar";
import Footer from "../../portals/Footer";
import axios from "axios";

function CreateUser() {
    const [state, setState] = useState();
    const navigate = useNavigate();
    // const user = state;
    const handleOnChange = (e) => {
        const value = e.target.value
        const name = e.target.name
        setState((oldState) => ({ ...oldState, [name]: value }))
    }
    const handleSummit = async (e) => {
        e.preventDefault();
        const { username, password, firstname, lastname, email } = state;
        const user = { username, password, firstname, lastname, email }
        try {
            const response = await axios.post("http://localhost:8080/api/users", user);
            if (response.status === 201) {
                navigate("/users")
                alert("Create user successfully!")
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
                            <h3 className="mt-4">Users Management</h3>
                            <ol className="breadcrumb mb-4">
                                <li className="breadcrumb-item active">/users/create</li>
                            </ol>
                            <div className="row justify-content-center align-items-center">
                                <div className="col-md-8 ">
                                    <div className="card">
                                        <div className="card-header">
                                            <h5>Create User</h5>
                                        </div>
                                        <div className="card-body">
                                            <form onSubmit={handleSummit}>
                                                <div class="form-group">
                                                    <input type="text" name="username" onChange={handleOnChange} class="form-control" id="username" aria-describedby="emailHelp" placeholder="Enter username" required />
                                                </div>
                                                <div class="form-group">
                                                    <input type="text" name="firstname" onChange={handleOnChange} class="form-control" id="firstname" aria-describedby="emailHelp" placeholder="Enter firstname" required />
                                                </div>
                                                <div class="form-group">
                                                    <input type="text" name="lastname" onChange={handleOnChange} class="form-control" id="lastname" aria-describedby="emailHelp" placeholder="Enter lastname" required />
                                                </div>
                                                <div class="form-group">
                                                    <select className="form-control">
                                                        <option selected>Select Role: </option>
                                                        <option value={1}>Admin</option>
                                                        <option value={2}>User</option>
                                                    </select>
                                                </div>
                                                <div class="form-group">
                                                    <input type="email" name="email" onChange={handleOnChange} class="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" required />
                                                </div>
                                                <div class="form-group">
                                                    <input type="password" name="password" onChange={handleOnChange} class="form-control" id="exampleInputPassword1" placeholder="Password" required />
                                                </div>
                                                <div class="form-group">
                                                    <button type="submit" class="btn btn-primary"><i className="fa fa-check"></i> Submit</button>
                                                    <a href="/users" className="btn btn-secondary float-end"><i className="fa fa-times"></i> Cancel</a>
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

export default CreateUser;