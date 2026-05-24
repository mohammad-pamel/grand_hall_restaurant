import React from 'react';
import facebookimg from '../../../../src/assets/facebook.png'
import Logo from '../../../Components/Logo/Logo';
import { Link } from 'react-router';

const Footer = () => {
    return (
        <div className='bg-black'>
            <div className=' text-white w-11/12 mx-auto py-10 '>
                <div className='grid grid-cols-1 md:grid-cols-4 md:justify-items-center text-[#A1A1AA] border-b-1 border-b-gray-600 pb-7 gap-5'>
                    <div>
                        <Logo></Logo>
                        <div className='flex flex-col my-5'>
                            <p className='text-xs'> Experience rich flavors, premium dining, and chef-crafted specialties.
                                We bring you the finest meals with exceptional service and unforgettable taste.</p>

                        </div>
                        <div>

                            <ul className='text-xs flex'>
                                <li className='flex items-center'><img className=' rounded-full w-[50px] h-[50px] mr-2' src={facebookimg} alt="" /></li>
                                
                            </ul>
                        </div>
                    </div>
                    <div className=''>
                        <h3 className='text-xl font-medium text-white mb-3'>Company</h3>
                        <ul className='text-xs space-y-3'>
                            <li><Link to={'/about-us'}>About Us</Link></li>
                            <li>Our Mission</li>
                            {/* <li>Contact Saled</li> */}
                        </ul>
                    </div>
                   
                    <div>
                        <h3 className='text-xl font-medium text-white mb-3'>Information</h3>
                        <ul className='text-xs space-y-3'>
                            <li>Privacy Policy</li>
                            <li>Terms & Conditions</li>
                            <li>Join Us</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className='text-xl font-medium text-white mb-3'>Talk To Us</h3>
                        <ul className='text-xs space-y-3'>
                            <li>Got Questions? Call us <br /> 01817230904 (Owner) <br /> 01852397601(Evening-Night) <br /> 01869459445 (Morning-Afternoon) </li>
                            <li>Jom Jom Tower (Ground Floor), Shantirhat, Potiya, Chittagong</li>
                        </ul>
                    </div>

                </div>
                <p className='text-center mt-14 '>© 2025 Book Courier All rights reserved.</p>
            </div>
        </div>
    );
};

export default Footer;
