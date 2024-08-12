import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from "../../portals/Sidebar";
import Header from "../../portals/Navbar";
import Footer from "../../portals/Footer";
import axios from "axios";

function UpdateUser() {
    const [userData, setUserData] = useState([]);
    const [state, setState] = useState();
    const [username, setUsername] = useState();
    const [firstname, setFirstname] = useState();
    const [lastname, setLastname] = useState();
    const [email, setEmail] = useState();
    const navigate = useNavigate();
    const userId = window.location.pathname;
    const id = userId.substring(userId.lastIndexOf('/') + 1);
    useEffect(() => {
        axios.get('http://localhost:8080/api/users/' + id)
        .then(res => {
            // setUserData(res.data)
            setUsername(res.data.username)
            setFirstname(res.data.profile.firstname)
            setLastname(res.data.profile.lastname)
            setEmail(res.data.profile.email)
        })
        .catch(err => console.log(err));
    }, [])
    // console.log(userData.profile)
        
        // const userState = {
    //     username: username !== undefined? setUsername(userData.username): username,
    //     firstname: firstname !== undefined? setFirstname(userData.profile.firstname) : firstname,
    //     lastname: lastname !== undefined? setLastname(userData.profile.lastname): lastname,
    //     email: email !== undefined? setEmail(userData.profile.email) : email
    // }
    const handleSummit = async (e) => {
        e.preventDefault();
        const userUpdate = {username, firstname,lastname,email};
        console.log(userUpdate)
        try {
            const response = await axios.put("http://localhost:8080/api/users/" + id, userUpdate);
            if (response.status === 201) {
                navigate("/users")
                alert("Update user successfully!");
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
                                <li className="breadcrumb-item active">/users/edit</li>
                            </ol>
                            <div className="row justify-content-center align-items-center">
                                <div className="col-md-8 ">
                                    <div className="card">
                                        <div className="card-header">
                                            <h5>Update User</h5>
                                        </div>
                                        <div className="card-body">
                                            <form onSubmit={handleSummit}>
                                                <div class="form-group">
                                                    <input type="text" name="username" onChange={(e) => setUsername(e.target.value)} value={username} class="form-control" id="username" aria-describedby="emailHelp" placeholder="Enter username" required />
                                                </div>
                                                <div class="form-group">
                                                    <input type="text" name="firstname" onChange={(e) => setFirstname(e.target.value)} value={firstname} class="form-control" id="firstname" aria-describedby="emailHelp" placeholder="Enter firstname" required />
                                                </div>
                                                <div class="form-group">
                                                    <input type="text" name="lastname" onChange={(e) => setLastname(e.target.value)} value={lastname} class="form-control" id="lastname" aria-describedby="emailHelp" placeholder="Enter lastname" required />
                                                </div>
                                                <div class="form-group">
                                                    <input type="email" name="email" onChange={(e) => setEmail(e.target.value)} value={email} class="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" required />
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

export default UpdateUser;