import React, { Component } from "react";
import { ForceGraph3D } from "react-force-graph";

class Graph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                nodes: [
                    {
                        id: 0,
                    },
                    {
                        id: 1,
                    },
                    {
                        id: 2,
                    },
                ],
                links: [
                    {
                        source: 0,
                        target: 1,
                    },
                    {
                        source: 1,
                        target: 2,
                    },
                ],
            },
            highlightNodes: [],
            highlightLink: [],
        };
    }

    render() {
        const { data, highlightNodes, highlightLink } = this.state;
        return <ForceGraph3D graphData={data} />;
    }
}

export default Graph;
