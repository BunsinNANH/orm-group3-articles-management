import React from "react";

function Sidebar() {
    return (
        <div id="layoutSidenav_nav">
            <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                <div className="sb-sidenav-menu">
                    <div className="nav">
                        <div className="sb-sidenav-menu-heading">Core</div>
                        <a className={window.location.pathname === "/" ? "nav-link active": "nav-link"} href="/">
                            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                            Dashboard
                        </a>
                        <div className="sb-sidenav-menu-heading">Addons</div>
                        <a className={window.location.pathname.includes("/articles") === true? "nav-link active": "nav-link"} href="/articles">
                            <div className="sb-nav-link-icon"><i className="fas fa-font"></i></div>
                            Articles
                        </a>
                        <a className={window.location.pathname.includes("/users") === true? "nav-link active": "nav-link"} href="/users">
                            <div className="sb-nav-link-icon"><i className="fas fa-users"></i></div>
                            Users
                        </a>
                    </div>
                </div>
                {/* <div className="sb-sidenav-footer">
                    <div className="small">Logged in as:</div>
                    Start Bootstrap
                </div> */}
            </nav>
        </div>
    )
}

export default Sidebar;