import React, { useState, useEffect } from 'react';
import AddProduct from '../components/addProduct';
import axios from 'axios';
import useLocalStorage from '../common/useLocalStore';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import Table from '../components/table';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [bids, setBids] = useState([]);
    const [bidder, setBidder] = useState(null);
    const [bidInfo, setBidInfo] = useState(null);
    const [trigger, setTrigger] = useState(null);
    const [locUser, setLocUser] = useLocalStorage('student', null);
    const [resMessage, setResMessage] = useState(null);
    const history = useHistory();

    const deleteItem = async (item, id) => {
        // e.preventDefault();
        const API = item === 'product' ? `https://auctionner.herokuapp.com/products/${id}` : `https://auctionner.herokuapp.com/bids/${id}`;
        // console.log(prod);
        try {
            await axios.delete(API)
                .then(res => {
                    // console.log(res.data);
                    setTrigger(res.data);
                })
                .catch(err => {
                    setResMessage(err.message);
                });
        } catch (error) {
            setResMessage(error.message);
        }
    }

    const closeBid = async (prod) => {
        // e.preventDefault();
        console.log(prod);
        try {
            await axios.post(`https://auctionner.herokuapp.com/bids/accept/`, prod)
                .then(res => {
                    // console.log(res.data);
                    setTrigger(res.data);
                })
                .catch(err => {
                    setResMessage(err.message);
                });
        } catch (error) {
            setResMessage(error.message);
        }
    }
    
    const getUser = async (item, bid) => {
        // e.preventDefault();
        const id = item === 'bid' ? bid : bid.user;
        // console.log(bid);
        setBidInfo(id);
        try {
            await axios.get(`https://auctionner.herokuapp.com/users/${id}`)
                .then(res => {
                    // console.log(res.data);
                    setBidder(res.data);
                })
                .catch(err => {
                    setResMessage(err.message);
                });
        } catch (error) {
            setResMessage(error.message);
        }
    }
    
    
    const fetchData = async () => {
        // e.preventDefault();
        // console.log(data);
        try {
            await axios.get(`https://auctionner.herokuapp.com/products/user/${locUser._id}`)
                .then(res => {
                    // console.log(res.data)
                    setProducts(res.data);
                })
                .catch(err => {
                    setResMessage(err.message);
                });
            await axios.get(`https://auctionner.herokuapp.com/bids/user/${locUser._id}`)
                .then(res => {
                    // console.log(res.data)
                    setBids(res.data);
                })
                .catch(err => {
                    setResMessage(err.message);
                });
        } catch (error) {
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
                <h1 className='text-center py-5'>Welcome to your Dashboard</h1>
                <Link to='/home' className='text-decoration-none'>Home</Link>

                <div className="text-end w-100 mb-3 px-4">
                    <button className='btn btn-danger' onClick={() => logout()}>Log out</button>
                </div>
                <hr />
            </div>
            <div className="container">
                {resMessage && <h1 className='text-center mt-3'>{resMessage}</h1>}

                <div className="row mt-5">
                    <div className="col-md-6">
                    <AddProduct user={locUser} data={products[0]} trigger={setTrigger} />
                    </div>
                    {bidder && <div className="col-md-6 bg-light rounded shadow text-uppercase pt-3 p-md-0">
                        <h2>Full Name: {bidder.fullName}</h2>
                        <h2>Price: {bidInfo.price}</h2>
                        <p>matric: {bidder.matric}</p>
                        <p>level: {bidder.level}</p>
                        <p>department: {bidder.department}</p>
                        <p>email: {bidder.email}</p>
                    </div>}
                </div>
                <div className="row mt-3">
                    <div className="col-md-12 bg-light rounded shadow mb-3">
                    <div className="text-center p-2">
                            <h2 className='text-decoration-underline'>My Products</h2>
                        </div>
                        {products.length > 0 ?
                        <Table data={products} namz='products' removeItem={deleteItem} closer={closeBid} getUser={getUser} />
                    :
                    <h3>No Products yet</h3>}
                    </div>
                    <div className="col-md-12 rounded bg-light shadow mb-3">
                        <div className="text-center p-2">
                            <h2 className='text-decoration-underline'>My Bids</h2>
                        </div>
                    {bids.length > 0 ? <Table data={bids} removeItem={deleteItem} getUser={getUser} namz='bids' />
                    :
                    <h3>No Bids yet</h3>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;