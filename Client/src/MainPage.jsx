import React from 'react';
import { Link } from 'react-router-dom';
import "./App.css";

function MainPage() {
    return ( 
        <div>
            <h1>Welcome to the page!</h1>
            <button>
               <Link to='/login' className='button-link'>Login</Link> &nbsp;&nbsp;&nbsp;
            </button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button><Link to='/registration' className='button-link'>Registration</Link></button>
        </div>
     );
}


export default MainPage;