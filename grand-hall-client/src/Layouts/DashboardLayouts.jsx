import React from 'react';
import { CgProfile } from 'react-icons/cg';
import { FaBook, FaBorderAll } from 'react-icons/fa';
import { IoBookSharp } from 'react-icons/io5';
import { LuBookPlus } from 'react-icons/lu';
import { MdInterpreterMode, MdOutlinePayment } from 'react-icons/md';
import { Link, NavLink, Outlet } from 'react-router';
// import { useQuery } from '@tanstack/react-query';
// import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
// import useAxiosSecure from '../hooks/useAxiosSecure';


const DashboardLayout = () => {

    const { role, roleLoading } = useRole();

    const navStyle = ({ isActive }) =>
        isActive
            ? "font-bold text-primary"
            : "hover:text-primary hover:bg-secondary";
    
    if (roleLoading) {
        return <span className="loading loading-infinity loading-xl"></span>;
    }


    return (
        <div className="drawer lg:drawer-open max-w-7xl mx-auto p-5">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {/* Navbar */}
                <nav className="navbar w-full bg-base-300">
                    <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
                        {/* Sidebar toggle icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
                    </label>
                    <div className="px-4">Grand Hall Restaurant Dashboard</div>
                </nav>
                {/* Page content here */}
                <Outlet></Outlet>
            </div>

            <div className="drawer-side is-drawer-close:overflow-visible">
                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
                    {/* Sidebar content here */}
                    <ul className="menu w-full grow">
                        {/* List item */}
                        <li>
                            <Link to='/' className="is-drawer-close:tooltip is-drawer-close:tooltip-right" className={navStyle} data-tip="Homepage">
                                {/* Home icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                                <span className="is-drawer-close:hidden">Homepage</span>
                            </Link>
                        </li>

                        {/* user links */}

                        {/* {
                            role === 'user' &&
                            <> */}
                        {/* <li>
                                    <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="My Orders" to='/dashboard/my-orders'>
                                        <FaBorderAll />
                                        <span className="is-drawer-close:hidden">My Orders</span></NavLink>
                                </li> */}
                        {/* <li>
                                    <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Payments" to='/dashboard/payments'>
                                        <MdOutlinePayment />
                                        <span className="is-drawer-close:hidden">Payments</span></NavLink>
                                </li> */}
                        {/* <li>
                                    <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="My Profile" to='/dashboard/my-profile'>
                                        <CgProfile />
                                        <span className="is-drawer-close:hidden">My Profile</span></NavLink>
                                </li> */}
                        {/* </>
                        } */}

                        {/*  librarian links */}

                        {/* {
                            { role === 'librarian' && }
                            <> */}
                        {/* <li>
                                    <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="My Books" to='/dashboard/my-books'>
                                        <IoBookSharp />
                                        <span className="is-drawer-close:hidden">My Books</span></NavLink>
                                </li> */}
                        {/* <li>
                                    <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Add Food" to='/dashboard/add-food'>
                                        <LuBookPlus />
                                        <span className="is-drawer-close:hidden">Add Food</span></NavLink>
                                </li>
                                <li>
                                    <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Manage Orders" to='/dashboard/manage-orders'>
                                        <FaBorderAll />
                                        <span className="is-drawer-close:hidden">Manage Orders</span></NavLink>
                                </li> */}
                        {/* </>
                        } */}





                        {/* admin links */}

                        {
                            role === 'admin' &&
                            <>
                                <li>
                                    <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Add Food" to='/dashboard/add-food' className={navStyle}>
                                        <LuBookPlus />
                                        <span className="is-drawer-close:hidden">Add Food</span></NavLink>
                                </li>
                                <li>
                                    <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Manage Orders" to='/dashboard/manage-orders' className={navStyle}>
                                        <FaBorderAll />
                                        <span className="is-drawer-close:hidden">Manage Orders</span></NavLink>
                                </li>
                                <li>
                                    <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="All Users" to='/dashboard/all-users' className={navStyle}>
                                        <MdInterpreterMode />
                                        <span className="is-drawer-close:hidden">All Users</span></NavLink>
                                </li>
                                <li>
                                    <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Manage Foods" to='/dashboard/manage-foods' className={navStyle}>
                                        <FaBook />
                                        <span className="is-drawer-close:hidden">Manage Foods</span></NavLink>
                                </li>
                                <li>
                                    <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="My Profile" to='/dashboard/my-profile' className={navStyle}>
                                        <CgProfile />
                                        <span className="is-drawer-close:hidden">My Profile</span></NavLink>
                                </li>
                                {/* <li>
                                    <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Profile" to='/dashboard/profile'>
                                        <CgProfile />
                                        <span className="is-drawer-close:hidden">My Profile</span></NavLink>
                                </li> */}
                            </>
                        }



                        {/* List item */}
                        {/* <li>
                            <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Settings" className={navStyle}>
                              
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M20 7h-9"></path><path d="M14 17H5"></path><circle cx="17" cy="17" r="3"></circle><circle cx="7" cy="7" r="3"></circle></svg>
                                <span className="is-drawer-close:hidden">Settings</span>
                            </button>
                        </li> */}
                    </ul>
                </div>
            </div>
        </div >
    );
};

export default DashboardLayout;