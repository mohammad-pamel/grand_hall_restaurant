import React from 'react';
import useAuth from '../hooks/useAuth';
// import Loading from '../components/Loading/Loading';
import useRole from '../hooks/useRole';
import Forbidden from '../Components/Forbidden/Forbidden';


const AdminRoute = ({ children }) => {
    const { loading } = useAuth();
    const { role, roleLoading } = useRole()

    if(loading || roleLoading){
        return <div>
            <span className='loading loading-infinity loading-xl'></span>
        </div>
    }
 

    if (role !== 'admin') {
        return <Forbidden></Forbidden>
    }

    return children;
};

export default AdminRoute;