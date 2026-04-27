import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import bannerimg1 from '../../../assets/banner/banner1.jpg';
import bannerimg2 from '../../../assets/banner/banner2.jpg';
import bannerimg3 from '../../../assets/banner/banner3.jpg';
// import logo from '../../../assets/logo3.jpg';
import { Link, NavLink } from 'react-router';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Logo from '../../../Components/Logo/Logo';

const Banner = () => {

    useGSAP(() => {
        const t1 = gsap.timeline({ repeat: 1, yoyo: true })
        const t2 = gsap.timeline({ repeat: Infinity, yoyo: true })
        const t3 = gsap.timeline({ repeat: Infinity, yoyo: true })

        t1.to('.animation', { duration: 1, scale: 0.3, color: '#d1b787', rotate: 360 });
        t2.to('.animationbtn', { duration: 2, scale: 1.2 });
        t3.to('.animationdiv', { duration: 1, scale: 0.3, color: '#d1b787', rotate: 360 });
    })


    return (
        <Carousel autoPlay={true} infiniteLoop={true}>

            <div
                className="hero animation mt-14"
                style={{ backgroundImage: `url(${bannerimg1})` }}
            >
                <div className="hero-overlay"></div>
               <div className="hero-content text-neutral-content text-center">
                    <div className="max-w-2xl">
                        <h1 className="text-3xl animationbtn md:text-5xl font-bold leading-tight">
                            Grand Hall Restaurant
                            <br />
                            <span className="text-primary">
                                Where Every Meal Becomes a Memory
                            </span>
                        </h1>

                        <p className="py-6 opacity-90">
                            Experience delicious chef-crafted meals made from fresh ingredients.
                            Enjoy premium dining, fast service, and unforgettable taste with
                            every bite.
                        </p>

                        <div className="flex gap-4 justify-center flex-wrap">

                            <NavLink to={'all-foods'} className="btn animationbtn bg-primary hover:bg-secondary border-none text-secondary hover:text-primary">
                                Explore Menu
                            </NavLink>

                        </div>
                    </div>
                </div>
            </div>

            <div
                className="hero  mt-14"
                style={{ backgroundImage: `url(${bannerimg2})` }}
            >
                <div className="hero-overlay"></div>
                <div className="hero-content text-neutral-content text-center">
                    <div className="max-w-2xl">
                        <h1 className="text-3xl animationbtn md:text-5xl font-bold leading-tight">
                            Grand Hall Restaurant
                            <br />
                            <span className="text-primary">
                                Where Every Meal Becomes a Memory
                            </span>
                        </h1>

                        <p className="py-6 opacity-90">
                            Experience delicious chef-crafted meals made from fresh ingredients.
                            Enjoy premium dining, fast service, and unforgettable taste with
                            every bite.
                        </p>

                        <div className="flex gap-4 justify-center flex-wrap">

                            <NavLink to={'all-foods'} className="btn animationbtn bg-primary hover:bg-secondary border-none text-secondary hover:text-primary">
                                Explore Menu
                            </NavLink>

                        </div>
                    </div>
                </div>
            </div>

            <div
                className="hero mt-14"
                style={{ backgroundImage: `url(${bannerimg3})` }}
            >
                <div className="hero-overlay"></div>
                <div className="hero-content text-neutral-content text-center">
                    <div className="max-w-2xl">
                        <h1 className="text-3xl animationbtn md:text-5xl font-bold leading-tight">
                            Grand Hall Restaurant
                            <br />
                            <span className="text-primary">
                                Where Every Meal Becomes a Memory
                            </span>
                        </h1>

                        <p className="py-6 opacity-90">
                            Experience delicious chef-crafted meals made from fresh ingredients.
                            Enjoy premium dining, fast service, and unforgettable taste with
                            every bite.
                        </p>

                        <div className="flex gap-4 justify-center flex-wrap">

                            <NavLink to={'all-foods'} className="btn animationbtn bg-primary hover:bg-secondary border-none text-secondary hover:text-primary">
                                Explore Menu
                            </NavLink>

                        </div>
                    </div>
                </div>
            </div>

        </Carousel>
    );

};

export default Banner;
