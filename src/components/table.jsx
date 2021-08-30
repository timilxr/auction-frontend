import React, {useState, useEffect} from 'react';

const MyTable = ({ namz, data, closer, removeItem, getUser, ...props }) => {
    // console.log(data);
    const header = Object.keys(data[0]);
    const [timeLeft, setTimeLeft] = useState(+new Date());

    useEffect(()=>{
        const timer = setTimeout(() => {
            setTimeLeft(+new Date());
        }, 1000);
        // Clear timeout if the component is unmounted
        return () => clearTimeout(timer);
    })
    
    
    return (
        <div className='table-responsive'>
        <table className="table">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    {header.map((head, index) =>
                        <th key={index} scope='col'>{head}</th>)}
                        <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                {data.map((info, index) =>{
                    let class1 = (+new Date(info.deadline) <= timeLeft) ? 'bg-success' : 'bg-danger';
                    let class2 = info.status === 'accepted' ? 'bg-success' : info.status === 'rejected' ? 'bg-danger' : 'bg-light';
                    return <tr key={index} className={namz === 'bids' ? class2 : class1}>
                        <td>{index+1}</td>
                        {Object.values(info).map((repo, index) =>{
                            // console.log(repo);
                            if(typeof repo === typeof {}){
                                return <td key={index}>{repo.fullName||repo.name||repo.price}</td>
                            }
                            if(typeof repo === typeof true){
                                return <td key={index}>{repo ? 'Yes' : 'No'}</td>
                            }
                            return <td key={index}>{repo}</td>}
                            )}
                            {(namz === 'products') && <td>{(+new Date(info.deadline) <= timeLeft) && <button type='button' onClick={()=>getUser('product', info.last_bid)} className='btn btn-sm btn-success shadow-lg'>view highest bidder</button>
                            }</td>}
                            {/* {(namz === 'products') && <td>{!info.open ? <button type='button' onClick={()=>removeItem('product', info._id)} className='btn btn-sm btn-danger'>delete product</button> : <></>}</td>} */}

                            {(namz === 'bids') && <td>{(info.status === 'accepted') ? <button type='button' onClick={()=>getUser('bid', info.product.user)} className='btn btn-sm btn-success shadow-lg'>view product owner</button> : <></>
                            }</td>}
                    </tr>}
                    )}
            </tbody>
        </table>
        </div>
    )
}

export default MyTable;