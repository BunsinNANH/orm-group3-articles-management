import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Register() {
  const [state, setState] = useState();
  const navigate = useNavigate();
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
      const response = await axios.post("http://localhost:8080/api/register", user);
      if (response.status === 201) {
        navigate("/login")
        alert("Register successfully!")
      }
    } catch (error) {
        console.log("Request fail", error);
    }
  }
  return (
    <body class="body-auth-bg">
      <div id="layoutAuthentication">
        <div id="layoutAuthentication_content">
          <main>
            <div class="container">
              <div class="row justify-content-center">
                <div class="col-lg-7">
                  <div class="card shadow-lg border-0 rounded-lg mt-5">
                    <div class="card-header"><h3 class="text-center font-weight-light my-4">Create Account</h3></div>
                    <div class="card-body">
                      <form onSubmit={handleSummit}>
                        <div class="form-floating mb-3">
                          <input class="form-control" onChange={handleOnChange} name="username" id="inputUsername" type="text" placeholder="Username" required />
                          <label for="inputUsername">Username</label>
                        </div>
                        <div class="row mb-3">
                          <div class="col-md-6">
                            <div class="form-floating mb-3 mb-md-0">
                              <input class="form-control" onChange={handleOnChange} name="firstname" id="inputFirstName" type="text" placeholder="Enter your firstname" required />
                              <label for="inputFirstName">Firstname</label>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-floating">
                              <input class="form-control" onChange={handleOnChange} name="lastname" id="inputLastName" type="text" placeholder="Enter your lastname" required />
                              <label for="inputLastName">Lastname</label>
                            </div>
                          </div>
                        </div>
                        <div class="form-floating mb-3">
                          <input class="form-control" onChange={handleOnChange} name="email" id="inputEmail" type="email" placeholder="name@example.com" required />
                          <label for="inputEmail">Email address</label>
                        </div>
                        <div class="form-floating mb-3">
                          <input class="form-control" onChange={handleOnChange} name="password" id="inputPassword" type="password" placeholder="Password" required />
                          <label for="inputPassword">Password</label>
                        </div>
                        <div class="mt-4 mb-0">
                          <div class="d-grid">
                            <button type="submit" class="btn btn-primary btn-block">Create Account</button>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div class="card-footer text-center py-3">
                      <div class="small"><a href="/login">Have an account? Go to login</a></div>
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

export default Register;