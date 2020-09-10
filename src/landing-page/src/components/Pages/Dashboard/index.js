import React from 'react'

//import InstanceCard from '../../InstanceCards'

const Dashboard = () => {
    return (
        <div className="dashboard__main">
            <div className="content-wrapper">
                <div className="container">
                    <div className="row d-flex justify-content-between">
                        {/* <h1>Dashboard </h1> */}
                        {/* <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#create-instance">
                            Create Instance
                        </button> */}
                    </div>
                    {/* <div className="modal fade" id="create-instance">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Enter Details to create Instance</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="form-group">
                                            <label htmlFor="instance-name">Name</label>
                                            <input type="text" className="form-control" id="instance-name" placeholder="Enter a name for your instance " />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="description">Description</label>
                                            <textarea className="form-control" id="description" rows="3" placeholder="Enter Description"></textarea>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                            <button type="button" className="btn btn-primary">Create</button>
                                        </div>
                                    </form>
                                </div>

                            </div>
                        </div>
                    </div> */}


                    <div className="embed-responsive embed-responsive-1by1 my-3">
                        <iframe className="embed-responsive-item" src="https://websvf.tools/" allowFullScreen></iframe>
                    </div>


                </div>
            </div>
        </div>
    );
}

export default Dashboard;
