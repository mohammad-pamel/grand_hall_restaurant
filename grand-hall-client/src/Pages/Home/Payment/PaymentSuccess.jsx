import React from 'react';
import { useParams } from 'react-router';

const PaymentSuccess = () => {
    const { id } = useParams();
    console.log(id);
    return (
        <div>
             <h2>payment successfull : ${id}</h2>
        </div>
    );
};

export default PaymentSuccess;