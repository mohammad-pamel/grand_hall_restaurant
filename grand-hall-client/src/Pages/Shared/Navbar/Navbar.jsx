import React from 'react';
import { Link, NavLink } from 'react-router';
import useAuth from '../../../hooks/useAuth';
// import { useState } from 'react';
import Logo from '../../../Components/Logo/Logo';
import useRole from '../../../hooks/useRole';
// import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from './../../../hooks/useAxiosSecure';
import { FaShoppingCart } from 'react-icons/fa';

const Navbar = () => {

    const { user, logOut } = useAuth();
    const { role } = useRole();


    const { data: cart = [] } = useQuery({
        queryKey: ["cart", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/cart?email=${user.email}`);
            return res.data;
        }
    });

    console.log("cartttt", cart);




    const handleLogOut = () => {
        logOut()

            .then()
            .catch(error => {
                console.log(error);
            })
    }

    const navStyle = ({ isActive }) =>
        isActive
            ? "font-bold text-primary border-b-2 border-primary"
            : "hover:text-primary hover:bg-secondary";



    const links = <>
        <li><NavLink to='/' className={navStyle}>Home</NavLink></li>
        <li><NavLink to='/all-foods' className={navStyle}>All Foods</NavLink></li>

        {user && role === 'user' && (
            <>
                <li><NavLink to='/my-orders' className={navStyle}>My Orders</NavLink></li>
                <li><NavLink to='/payment' className={navStyle}>Payments</NavLink></li>
            </>
        )}

        {user && role === 'admin' && (
            <>
                <li><NavLink to='/dashboard' className={navStyle}>Dashboard</NavLink></li>
            </>
        )}
    </>


    return (
        <div className="navbar bg-base-100 shadow-sm rounded-xl ">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 -ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {links}
                    </ul>
                </div>
                <Logo></Logo>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {links}
                </ul>
            </div>
            <div className="navbar-end">
                <div className="w-10 mr-3 relative group">
                    <img className="rounded-full border-2 border-base-600"
                        alt="User Image"
                        src={`${user?.photoURL || "https://th.bing.com/th/id/R.2fa57439a24f242faaf2333fe5e9e295?rik=ERIOJB6KU7TNYw&pid=ImgRaw&r=0"}`} />
                    {
                        user && (
                            <span className="absolute bottom-1/2 mb-1  transform px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 ">{user.displayName}</span>
                            // <span className="absolute bottom-1/2 mb-1  transform px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 ">My Profile</span>
                        )
                    }
                </div>
                {
                    user ? <button onClick={handleLogOut} className="btn mr-2 p-2 text-secondary hover:text-primary hover:bg-secondary bg-primary">Logout</button> : <Link to='/login' className="btn mr-2 p-2 text-secondary hover:text-primary hover:bg-secondary bg-primary">Login</Link>
                }
                {/* <input checked={theme === "dark"} onChange={handleThemeToogle} type="checkbox" className="toggle md:hidden" /> */}


                <Link to="/cart" className="relative mr-2">

                    <FaShoppingCart className="text-2xl cursor-pointer" />

                    <span className="absolute -top-3 -right-2 bg-red-500 text-secondary px-1 rounded-full">
                        {cart.length}
                    </span>

                </Link>


            </div>
        </div>

    );
};

export default Navbar;