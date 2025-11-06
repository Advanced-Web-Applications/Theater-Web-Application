import React from 'react'
import { BrowserRouter, useNavigate, Route, Routes, Link } from 'react-router-dom'
import '../../style/customer/navbar.css'
import HomePage from '../../pages/customer/HomePage'


export default function Navbar() {
  return (
    <div className='navbar'>
        <h2>LOGO</h2>
        <i className="bi bi-list menu-icon"></i>
    </div>
  )
}
