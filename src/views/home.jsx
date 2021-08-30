import React, { useEffect, useState } from 'react';
import Product from '../components/product';
import useLocalStorage from '../common/useLocalStore';
import axios from 'axios';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [trigger, setTrigger] = useState(null);
    const [locUser, setLocUser] = useLocalStorage('student', null);
    const [resMessage, setResMessage] = useState(null);
    const history = useHistory();

    const fetchData = async () => {
        // e.preventDefault();
        // console.log(data);
        try {
            await axios.get('http://localhost:5000/products')
                .then(res => {
                    console.log(res.data);
                    // if (!res.data.success) {
                    //     console.log(res.data.message);
                    //     // console.log('me');
                    //     setErrors(res.data.errors);
                    //     setColor('danger');
                    //     setResMessage(res.data.message);
                    // }

                    // setColor('success');
                    console.log(res.data)
                    setProducts(res.data);
                })
                .catch(err => {
                    // if (!err.response) {
                    //     setResMessage(err.message);
                    // }
                    // else {
                    setResMessage(err.message);
                    // setErrors(err.response.data.errors);
                    // };
                    // setColor('danger');
                });
        } catch (error) {
            // console.error(error.message);
            // setColor('danger');
            setResMessage(error.message);
        }
    }

    const logout = () => {
        // localStorage.removeItem('student');
        setLocUser(null);
    }

    useEffect(() => {
        locUser ? fetchData() : history.push('/');
    }, [locUser, trigger]);

    return (
        <>
            <div className="container-fluid">
                <h1 className='text-center py-5'>Welcome on board</h1>
                <Link to='/dashboard' className='text-decoration-none'>Dashboard</Link>
                <div className="text-end w-100 mb-3 px-4">
                    <button className='btn btn-danger' onClick={() => logout()}>Log out</button>
                </div>
                <hr />
            </div>
            <div className="container">
                <div className="row mt-5">
                    {resMessage && <h1 className='text-center mt-3'>{resMessage}</h1>}
                    {products.length > 0 ?
                        products.map(product =>
                            <div key={product._id} className="col-6 col-md-3">
                                <Product data={product} user={locUser} trigger={setTrigger} />
                            </div>
                        )
                        :
                        <h1 className='text-center'>No Products available yet</h1>}
                </div>
            </div>
        </>
    )
}

export default Home;