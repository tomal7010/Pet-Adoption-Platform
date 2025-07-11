import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router';

const AuthLayout = () => {
    return (
        <div>

            <div>
            <header>
                <Navbar></Navbar>
            </header>
            
            <main className='w-11/12 mx-auto py-5'>
                <Outlet></Outlet>
            </main>
        </div>
            
        </div>
    );
};

export default AuthLayout;