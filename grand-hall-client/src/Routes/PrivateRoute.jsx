import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router';

const PrivateRoute = ({ children }) => {

    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="min-h-screen flex justify-center items-center">
            <span className="loading loading-infinity loading-xl"></span>
        </div>
    }

    if (!user) {
        return (<Navigate
            // state={location.pathname} 
            state={{ from: location }}
            to='/login'>
            replace
        </Navigate>)
    }

    return children;
};

export default PrivateRoute;