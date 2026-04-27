import React from 'react';
import useAuth from '../hooks/useAuth';
// import Loading from '../components/Loading/Loading';
import useRole from '../hooks/useRole';
import Forbidden from '../Components/Forbidden/Forbidden';
// import Forbidden from '../components/Forbidden/Forbidden';

const AdminRoute = ({ children }) => {
    const { loading } = useAuth();
    const { role, roleLoading } = useRole()

    if(loading || roleLoading){
        return <div>
            <span className='loading loading-infinity loading-xl'></span>
        </div>
    }


    if (role !== 'admin') {
        // return <div><h2 className='font-bold text5xl'>not admin</h2></div>
        return <Forbidden></Forbidden>
    }

    return children;
};

export default AdminRoute;