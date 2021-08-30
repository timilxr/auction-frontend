import React, {useState} from 'react';
import axios from 'axios';

const AddProduct = ({user, trigger, props }) => {
    // const [open, setOpen] = useState(false);
    const [inputData, setInputData] = useState({
        user: user ? user._id : null,
    });
    const [selectedFile, setSelectedFile] = useState();
    const [color, setColor] = useState(null);
    const [loading, setLoading] = useState(false);
    // {color === 'success' && history.push('/home')}
    const [resMessage, setResMessage] = useState(null);

    const handleInput = e => {
        let { value, name } = e.target;
        if(name === 'image'){
            value = e.target.files[0];
        }
        setInputData(data => {
            return {
                ...data,
                [name]: value,
            }
        });
        // console.log(value);
        // console.log(e);
    }

    const handleFile = e => {
        setSelectedFile(e.target.files[0]);
        // console.log(e);
    }

    const handleSubmit = async e => {
        const formData = new FormData();
        setLoading(true);
        for(let key in inputData){
            formData.append(key, inputData[key]);
            // console.log(key, inputData[key]);
        }
        formData.append('image', selectedFile);
        e.preventDefault();
        // console.log(formData);
        try {
            // let user = null;
            await axios.post('https://auctionner.herokuapp.com/products/', formData)
                .then(res => {
                    // console.log(res.data);

                    // setLocUser(res.data.user);
                    setColor('success');
                    trigger(res.data._id);
                    setResMessage('Product Added');
                    // setOpen(false);
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
        setLoading(false);
    }


    return (
        <div className="card mx-auto my-5 shadow border-0" style={{ backgroundColor: '' }}>
            <div className="card-header text-center">
                <h2>Add a product to sell</h2>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit} encType='multipart/form-data'>
                    {resMessage && <div className="p-2 w-100 text-center bg-light">
                        <p className={`lead text-${color}`}>{resMessage}</p>
                    </div>}
                    {loading && <div className="p-2 w-100 text-center bg-light">
                        <p className={`lead text-primary`}>Loading...</p>
                    </div>}
                    <div className="row">
                    <div className="col-md-6">
                        <label htmlFor="customFile">Choose file(jpg or png file types)</label>
                        <input type="file" name='image' onChange={handleFile} className="form-control" id="customFile" />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="exampleFormControlInput1">Name</label>
                        <input type="text" name="name" className="form-control" onChange={handleInput} id="exampleFormControlInput1" placeholder="Name of Product" autoComplete='false' required />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="exampleFormControlInput2">Price</label>
                        <input type="number" name="price" className="form-control" onChange={handleInput} id="exampleFormControlInput2" placeholder="enter your base price" required />
                    </div>
                    <div className="col">
                        <label htmlFor="exampleFormControlInput2">Description</label>
                        <textarea name="description" className="form-control" onChange={handleInput} id="exampleFormControlInput2" placeholder="Description of product..." rows='4' cols='50'></textarea>
                    </div>
                    <div className="col-md-6">
                        <button type="submit" className="btn btn-primary mt-3 ml-auto">Submit</button>
                    </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default AddProduct;