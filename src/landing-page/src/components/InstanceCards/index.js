import React from 'react'

import './instancecard.scss'

const InstanceCard = () => {
    return (
        <div className="instance-card">
            <div className="instance-card__wrapper">
                <div className="row">
                    <div className="col">
                        <div class="card m-3" >
                            <div class="card-body">
                                <h5 class="card-title">Instance Title </h5>
                                <h6 class="card-subtitle mb-2 text-muted">instance info goes here</h6>
                                <p class="card-text">Some quick example text to build on the card title and make up the bulk of
                            the card's content.</p>
                                <a href="https://websvf.top/login?to=%2F" class="card-link" target="_blank" >Open</a>
                                <a class="card-link">Delete</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InstanceCard;