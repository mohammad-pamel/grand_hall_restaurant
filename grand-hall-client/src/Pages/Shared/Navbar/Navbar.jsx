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
    // const [theme, setTheme] = useState('light');
    const { role } = useRole();
    // const axiosSecure = useAxiosSecure();
    // const navigate = useNavigate();
    // const { data: users = {} } = useQuery({
    //     queryKey: ['users'],
    //     queryFn: async () => {
    //         const res = await axiosSecure.get(`/users`);
    //         const currentUser = res.data.filter(u => u.email === user.email);
    //         // console.log('usersdbbb', res.data);
    //         console.log('usersdbbb', currentUser);
    //         return currentUser[0];
    //         // return res.data;

    //     }
    // })

    // console.log(users);

    const { data: cart = {} } = useQuery({
        queryKey: ['cart'],
        // enabled: !!id,
        queryFn: async () => {
            const res = await axiosSecure.get(`/cart`);
            return res.data;
        }
    });



    const handleLogOut = () => {
        logOut()

            .then()
            .catch(error => {
                console.log(error);
            })
    }


    // const handleThemeToogle = () => {
    //     const newTheme = theme === 'light' ? 'dark' : 'light';
    //     setTheme(newTheme);
    //     document.querySelector('html').setAttribute('data-theme', newTheme);
    // }


    const links = <>
        <li><NavLink to='/'>Home</NavLink></li>
        <li><NavLink to='/all-foods'>All Foods</NavLink></li>

        {user && role === 'user' && (
            <>
                <li><NavLink to='/my-orders'>My Orders</NavLink></li>
                <li><NavLink to='/payments'>Payments</NavLink></li>
            </>
        )}

        {user && role === 'admin' && (
            <>
                <li><NavLink to='/dashboard'>Dashboard</NavLink></li>
            </>
        )}
    </>


    return (
        <div className="navbar bg-base-100 shadow-sm rounded-xl p-3 ">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
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
                    user ? <button onClick={handleLogOut} className="btn mr-1 text-secondary hover:text-primary hover:bg-secondary bg-primary">Logout</button> : <Link to='/login' className="btn mr-1 text-secondary hover:text-primary hover:bg-secondary bg-primary">Login</Link>
                }
                {/* <input checked={theme === "dark"} onChange={handleThemeToogle} type="checkbox" className="toggle md:hidden" /> */}


                <Link to="/cart" className="relative">

                    <FaShoppingCart className="text-2xl cursor-pointer" />

                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-lg px-2 py-2 rounded-full">
                        {cart.length}
                    </span>

                </Link>

                {/* <label className="md:flex cursor-pointer gap-2 hidden md:block ">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <circle cx="12" cy="12" r="5" />
                        <path
                            d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                    </svg>
                    <input checked={theme === "dark"} onChange={handleThemeToogle} type="checkbox" className="toggle" />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                </label> */}
            </div>
        </div>

    );
};

export default Navbar;