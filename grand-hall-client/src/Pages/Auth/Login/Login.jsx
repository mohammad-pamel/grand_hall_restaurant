import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router';
import SocialLogin from '../SocialLogin/SocialLogin';

const Login = () => {

    const { register, handleSubmit, formState: {errors} } = useForm();
    const {signInUser} = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogin = (data) => {
        console.log('After login', data);
        signInUser(data.email, data.password)
        .then(result => {
            console.log(result.user);
            navigate(location?.state || '/');
        })
        .catch(error => {
            console.log(error);
        })

    }

    return (
        <div>
            <div className="card border-2 py-8 w-full max-w-sm mx-auto shrink-0 shadow-2xl">
                <h3 className='text-3xl text-white text-center font-bold'>Welcome Back</h3>
                <p className='text-center text-white'>Please Login</p>
                <form onSubmit={handleSubmit(handleLogin)} className="card-body">
                    <fieldset className="fieldset">
                        <label className="label">Email</label>
                        <input type="email" {...register('email', {required: true})} className="input" placeholder="Email" />
                        {errors.email?.type==='required' && <p className='text-red-600'>Email is required</p>}

                        <label className="label text-white">Password</label>
                        <input type="password" {...register('password', {required: true, minLength: 6, pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/})} className="input" placeholder="Password" />
                        {errors.password?.type==='required' && <p className='text-red-600'>Password is required</p>}
                        {errors.password?.type==='minLength' && <p className='text-red-600'>Password must be at least 6 character</p>}
                        {errors.password?.type==='pattern' && <p className='text-red-600'>Password must be at least one uppercase one lowercase one number and one special character</p>}

                        <div><a className="link link-hover">Forgot password?</a></div>
                        <button className="btn bg-primary text-secondary hover:bg-secondary hover:text-primary mt-4">Login</button>
                        <div className='mt-3'>Don't have any account? <Link state={location.state} to='/register' className='text-primary font-bold hover:text-secondary'>Rgister</Link></div>
                    </fieldset>
                </form>
                <SocialLogin></SocialLogin>
            </div>
        </div>
    );
};

export default Login;