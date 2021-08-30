import React, { useState, useEffect } from 'react';
import axios from 'axios';
import calculateTimeLeft from '../common/calcTimeLeft';

const Product = ({ data, user, trigger, ...props }) => {
    const [open, setOpen] = useState(false);
    const [inputData, setInputData] = useState({
        user: user ? user._id : null,
        product: data._id
    });
    const [color, setColor] = useState(null);
    // {color === 'success' && history.push('/home')}
    const [resMessage, setResMessage] = useState(null);

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(data.deadline));

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft(data.deadline));
        }, 1000);
        // Clear timeout if the component is unmounted
        return () => clearTimeout(timer);
    });
    const timerComponents = [];

    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval]) {
            return;
        }

        timerComponents.push(
            <span key={interval}>
                {timeLeft[interval]} {interval}{" "}
            </span>
        );
    });



    const handleInput = e => {
        const { value, name } = e.target;
        setInputData(data => {
            return {
                ...data,
                [name]: value,
            }
        });
        // console.log(value);
        // console.log(e);
    }



    const handleSubmit = e => {
        e.preventDefault();
        // console.log(inputData);
        try {
            // let user = null;
            axios.post('https://auctionner.herokuapp.com/bids/', inputData)
                .then(res => {
                    // console.log(res.data);

                    // setLocUser(res.data.user);
                    setColor('success');
                    trigger(res.data._id);
                    setResMessage('Bid placed');
                    setOpen(false);
                    // setTimeout(() => setUser(res.data.user), 500);
                })
                .catch(err => {
                    if (!err.response) {
                        setResMessage(err.message);
                    }
                    else {
                        setResMessage(err.response.data.message);
                    };
                    setColor('danger');
                });
        } catch (error) {
            setColor('danger');
            setResMessage(error.message);
        }
    }

    if (!user) {
        return <h1>Loading...</h1>
    }

    return (
        <div className={`card shadow-lg ${timerComponents.length ? 'border-success' : 'border-danger'}`}>
            <div className="card-header px-0">
                <h2>{data.name}</h2>
                {timerComponents.length ? timerComponents : <span>Time's up!</span>}
                {/* <p className={data.open ? 'text-success' : 'text-danger'}>status: {data.open ? 'open' : 'closed'}</p> */}
            </div>
            <div className="card-body px-0">
                {resMessage && <div className="p-2 w-100 text-center bg-light">
                    <p className={`lead text-${color}`}>{resMessage}</p>
                </div>}
                {(data.last_bid.user === user._id) && <div className="p-2 w-100 text-center">
                    <p className={`text-dark`}>my status: Topping</p>
                </div>}
                <img src={data.image} className="card-img-top" alt="..." />
                <h5 className="card-title">{data.name}</h5>
                <p className="card-subtitle lead">Price: #<b>{data.last_bid.price}</b></p>
                <p className='card-text mb-1'><b>Description(s)</b></p>
                <p className="card-text px-md-2">{data.description}</p>
            </div>
            <div className="card-footer">
                {timerComponents.length ?
                    <>
                        {(!open && data.open) && <button type='button' className='btn btn-primary btn-sm btn-block' onClick={() => setOpen(true)}>Bid</button>}
                        {open &&
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="exampleFormControlInput2">Amount</label>
                                    <input type="number" name="price" min={parseFloat(data.last_bid.price) + 1} className="form-control" onChange={handleInput} id="exampleFormControlInput2" placeholder="enter bid amount" required />
                                </div>
                                <div className="text-end">
                                    <button type="submit" className={`btn btn-success mt-3 ml-auto`}>Submit Bid</button>
                                </div>
                            </form>}
                    </>
                    :
                    <p className="text-danger">Closed</p>}
            </div>
        </div>
    )
}

export default Product;