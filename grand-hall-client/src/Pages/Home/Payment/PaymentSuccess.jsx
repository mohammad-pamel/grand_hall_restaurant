import React from 'react';
import { useParams } from 'react-router';

const PaymentSuccess = () => {
    const { tran_id } = useParams();
    console.log(tran_id);
    return (
        <div>
             <h2>payment successfull : ${tran_id}</h2>
        </div>
    );
};

export default PaymentSuccess;