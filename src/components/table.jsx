import React from 'react';

const MyTable = ({ namz, data, closer, getUser, ...props }) => {
    const header = Object.keys(data[0]);
    
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
                    let class1 = info.open ? 'bg-success' : 'bg-danger';
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
                            <td>{info.open ? <button type='button' onClick={()=>closer(info)} className='btn btn-sm btn-outline-danger'>close bid</button> :
                            <button type='button' onClick={()=>getUser(info.last_bid)} className='btn btn-sm btn-success'>view highest bidder</button>
                            }</td>
                    </tr>}
                    )}
            </tbody>
        </table>
        </div>
    )
}

export default MyTable;