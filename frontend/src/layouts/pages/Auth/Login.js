import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Login(){
    const navigate = useNavigate();
    const [state, setState] = useState();

    const handleOnChange = (e) => {
        const value = e.target.value
        const name = e.target.name
        setState((oldState) => ({ ...oldState, [name]: value }))
    }
    const handleSummit = async (e) => {
        e.preventDefault();
        // reques to api
        const { username, password } = state;
        const credentials = { username, password }
        try {
            const response = await axios.post("http://localhost:8080/api/login", credentials);
            const token = response.data.token;
            if (response.status === 200) {
                localStorage.setItem("token", token);
                alert("Login successfully!");
                navigate("/")
            }
        } catch (error) {
            alert("Username & password invalid!");
            console.log("Request fail", error);
        }
    }
    return(
        <body className="body-auth-bg">
        <div id="layoutAuthentication">
            <div id="layoutAuthentication_content">
                <main>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-5">
                                <div className="card shadow-lg border-0 rounded-lg mt-5">
                                    <div className="card-header"><h3 className="text-center font-weight-light my-4">Login</h3></div>
                                    <div className="card-body">
                                        <form onSubmit={handleSummit}>
                                            <div className="form-floating mb-3">
                                                <input className="form-control" name="username" onChange={handleOnChange} id="inputUsername" type="text" placeholder="Username" required />
                                                <label for="inputUsername">Username</label>
                                            </div>
                                            <div className="form-floating mb-3">
                                                <input className="form-control" name="password" onChange={handleOnChange} id="inputPassword" type="password" placeholder="Password" required />
                                                <label for="inputPassword">Password</label>
                                            </div>
                                            <div className="form-check mb-3">
                                                <input className="form-check-input" id="inputRememberPassword" type="checkbox" value="" />
                                                <label className="form-check-label" for="inputRememberPassword">Remember Password</label>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-between mt-4 mb-0">
                                                <a className="small" href="#">Forgot Password?</a>
                                                <button type="submit" className="btn btn-primary">Login</button>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="card-footer text-center py-3">
                                        <div className="small"><a href="/register">Need an account? Sign up!</a></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </body>
    )
}

export default Login;