import React,{useEffect, useState} from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import moment from 'moment';

function Navbar() {
    const navigate = useNavigate();
    const [authProfile, setAuthProfile] = useState();
    const token = localStorage.getItem("token") !== null ? localStorage.getItem("token"): null;
    
    const currentDate = moment(new Date()).format("YYYY/MM/DD hh:mm:ss");
    const tokenExpiredAt = moment(new Date(jwtDecode(token).exp) * 1000).format("YYYY/MM/DD hh:mm:ss");
    const authID = token !== null? jwtDecode(token).userId: null;
    if (new Date(currentDate) > new Date(tokenExpiredAt)) {
        navigate("/login")
    }
    useEffect(() => {
        if (authID !== null) {
            axios.get('http://localhost:8080/api/users/'+authID)
            .then(res => {
                const fname = res.data.profile.firstname;
                const lname = res.data.profile.lastname;
                setAuthProfile(fname + " " + lname)
            })
            .catch(err => console.log(err));
        }
    }, []);
    function handleLogout(e){
        e.preventDefault();
        localStorage.setItem("token", null);
        alert("You have been logout from system!");
        navigate("/login")
        window.location.reload(true)
    }
    return (
        <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
            <a className="navbar-brand ps-3" href="/">Article Management</a>
            <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!"><i className="fas fa-bars"></i></button>
            <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
                <div className="input-group">
                    <input className="form-control" type="text" placeholder="Search for..." aria-label="Search for..." aria-describedby="btnNavbarSearch" />
                    <button className="btn btn-primary" id="btnNavbarSearch" type="button"><i className="fas fa-search"></i></button>
                </div>
            </form>
            <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i className="fas fa-user fa-fw text-warning"></i></a>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li><span className="dropdown-item">{authProfile}</span></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><span className="dropdown-item btn-logout"
                            onClick={handleLogout}>Logout</span>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar;