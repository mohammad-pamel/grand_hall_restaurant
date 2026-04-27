import React from 'react';
import Logo from '../Components/Logo/Logo';
import { Outlet } from 'react-router';
import authImg from '../assets/banner/banner1.JPG';
import Navbar from '../Pages/Shared/Navbar/Navbar';

const AuthLayout = () => {
    return (

        <div className='max-w-7xl mx-auto p-5'>
            <Navbar></Navbar>
            <div className='relative py-20'>
                <div className='absolute  inset-0 bg-cover bg-center opacity-100' style={{ backgroundImage: `url(${authImg})` }}>
                </div>

                <div className='flex items-center py-14 px-8 '>
                    <div className='flex-1 mx-auto'>
                        <Outlet></Outlet>
                    </div>
                </div>

            </div>
        </div>

    );
};

export default AuthLayout;