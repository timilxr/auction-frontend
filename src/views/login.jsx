import React, { useEffect, useState } from 'react';
// import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import useLocalStorage from '../common/useLocalStore';
import axios from 'axios';


const Login = () => {
    const [data, setData] = useState({});
    const [locUser, setLocUser] = useLocalStorage('student', null);
    const [user, setUser] = useState(null);
    const history = useHistory();
    // const [errors, setErrors] = useState(null);
    const [color, setColor] = useState(null);
    // {color === 'success' && history.push('/home')}
    const [resMessage, setResMessage] = useState(null);


    const handleInput = e => {
        const { value, name } = e.target;
        setData(data => {
            return {
                ...data,
                [name]: value,
            }
        });
        console.log(value);
        // console.log(e);
    }

    useEffect(()=>{
        console.log(locUser);
        locUser && history.push('/home');
    }, [user]);

    const handleSubmit = e => {
        e.preventDefault();
        console.log(data);
        try {
            // let user = null;
            axios.post('https://auctionner.herokuapp.com/users/login', data)
                .then(res => {
                    console.log(res.data);
                    if (!res.data.success) {
                        console.log(res.data.message);
                        setColor('danger');
                        setResMessage(res.data.message);
                    }
                    setLocUser(res.data.user);
                    setColor('success');
                    setResMessage(res.data.message);
                    setTimeout(() => setUser(res.data.user), 500);
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

    return (
        <div className="container-fluid py-5" style={{ backgroundColor: '#bababa', color: '#bababa', height: `100vh` }}>
            <div className="card mx-auto my-5 shadow border-0" style={{ width: `300px`, backgroundColor: '#a20404' }}>
                <div className="card-header text-white text-center">
                    <h2>Student Account login</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        {resMessage && <div className="p-2 w-100 text-center bg-light">
                            <p className={`lead text-${color}`}>{resMessage}</p>
                        </div>}
                        <div className="form-group">
                            <label htmlFor="exampleFormControlInput1">Matric number</label>
                            <input type="text" name="matric" className="form-control" onChange={handleInput} id="exampleFormControlInput1" placeholder="u/12/ab/3456" autoComplete='false' required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleFormControlInput2">Password</label>
                            <input type="password" name="password" className="form-control" onChange={handleInput} id="exampleFormControlInput2" placeholder="enter your password" required />
                        </div>
                        <div className="text-end">
                            <button type="submit" className="btn btn-primary mt-3 ml-auto">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}

export default Login;