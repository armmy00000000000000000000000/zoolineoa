/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react';
import zooeticket from "../img/logozoo.png";
import { Link } from "react-router-dom";
const Navbar = () => {
    useEffect(() => {
        window.googleTranslateElementInit = () => {
          new window.google.translate.TranslateElement({
            pageLanguage: 'en,th', // ภาษาเริ่มต้น
            includedLanguages: 'en,th', // ภาษาให้เลือก
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          }, 'google_translate_element');
        };
    
        // โหลดสคริปต์ Google Translate
        const script = document.createElement('script');
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        document.body.appendChild(script);
      }, []);
    
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <a className="navbar-brand" href="#">
                    <img
                        src={zooeticket}
                        height="30"
                        alt="Logo"
                        loading="lazy"
                    />
                </a>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {/* <li className="nav-item">
                            <Link to="/addticket" className="nav-link" href="#">จองตั๋วสวนสัตว์</Link>
                        </li> */}
                        <li className="nav-item">
                            <Link to="/OrderList" className="nav-link" href="#">รายการจองตั๋วออนไลน์</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/ZooList" className="nav-link" href="#">กิจกรรม</Link>
                        </li>
                        {/* <li className="nav-item">
                            <Link to="/Listshop" className="nav-link" href="#">Shop Online</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/" className="nav-link">
                                Shop คำสั่งซื้อ
                                <span className="position-absolute  left-100  badge rounded-pill bg-danger h3 text-light">
                                    0
                                </span>
                            </Link>

                        </li> */}
                    </ul>
                </div>

                <div className="d-flex align-items-center">
                    {/* <a class="nav-icon position-relative text-decoration-none" href="#">
                        <i class="fa fa-fw fa-cart-arrow-down text-dark mr-1"></i>
                        <span class="position-absolute top-0 left-100 translate-middle badge rounded-pill bg-light text-dark">7</span>
                    </a> */}
                    <Link to='/Lineconnext' className="dropdown-item text-danger" href="#">รีเฟรชข้อมูล</Link>
                    {/* <Link to="/" className=" nav-icon position-relative text-reset me-3" href="#">
                        <i className="fas fa-shopping-cart"></i>
                        <span class="position-absolute top-0 left-100 translate-middle badge rounded-pill  bg-danger h3 text-light">0</span>
                    </Link> */}

                    {/* <div className="dropdown">
                        <a
                            className="text-reset me-3 dropdown-toggle"
                            href="#"
                            id="navbarDropdownMenuLink"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="fas fa-bell"></i>
                            <span className="badge rounded-pill bg-danger">1</span>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
                            <li><a className="dropdown-item" href="#">Some news</a></li>
                            <li><a className="dropdown-item" href="#">Another news</a></li>
                            <li><a className="dropdown-item" href="#">Something else here</a></li>
                        </ul>
                    </div> */}
   
                    <div className="dropdown">
                        <a
                            className="dropdown-toggle d-flex align-items-center"
                            href="#"
                            id="navbarDropdownMenuAvatar"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <img
                                src={localStorage.getItem('profile')}
                                className="rounded-circle"
                                height="25"
                                alt="Profile"
                                loading="lazy"
                            />
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuAvatar">
                            <li><a className="dropdown-item" href="#">ชื่อ: {localStorage.getItem('name')}</a></li>
                            <li><a className="dropdown-item" href="#">ผ่าน: Line OA</a></li>
                            <li><Link to='/Lineconnext' className="dropdown-item text-danger" href="#">รีเฟรชข้อมูล</Link></li>
                        </ul>
                    </div>
                    <div id="google_translate_element"></div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
