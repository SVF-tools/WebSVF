import React, { Component } from 'react';
import { ForceGraph2D, ForceGraph3D, ForceGraphVR } from 'react-force-graph';
import axios from 'axios';
import { thisExpression } from '@babel/types';

class Graph extends Component {
    static NODE_R = 4;
    constructor(props) {
        super(props);
        this.state = {
            data: {
                nodes: [],
                links: []
            },
            highlightNodes: [],
            highlightLink: [],
        };
    }

    _handleNodeHover = node => {
        // this.setState({ highlightNodes: node ? [... this.state.highlightNodes, node] : [... this.state.highlightNodes] });
    };
    _handleLinkHover = link => {

        let flag_source = false;
        let flag_target = false;

        this.setState(({ highlightNodes, highlightLink }) => {
            if (link) {


                for (let i = 0; i < highlightNodes.length; i++) {
                    if (link.source === highlightNodes[i]) {
                        flag_source = true;
                        if (flag_target) {
                            break;
                        }
                        continue;
                    }
                    if (link.target === highlightNodes[i]) {
                        flag_target = true;
                        if (flag_source) {
                            break;
                        }
                        continue;
                    }
                }
                console.log("flag_source: ", flag_source);
                console.log("flag_target: ", flag_target);
                if (flag_source && flag_target) {
                    // if (highlightLink.length === 0) {
                    //     return { highlightLink: link }
                    // }
                    return { highlightLink: [...highlightLink, link] }
                }
            }
        });
        // console.log("flag_source: ", flag_source);
        // console.log("flag_target: ", flag_target);
        // if (flag_source && flag_target) {
        //     this.setState({
        //         highlightLink: [...this.state.highlightLink, link]
        //     });

        // }

        // this.setState({
        //     highlightLink: link,
        //     highlightNodes: link ? [link.source, link.target] : []
        // });
    };
    _handleNodeClick = async node => {

        const position = {
            listid: node.listid,
            time: this.getTime()
        }
        const { data: posts } = await axios.post('https://localhost:6999/api/add_info', position);
        this.sleep(1000);
        // const { data: add_info } = await axios.get('https://localhost:6999/api/add_info');
        // this.setState({ data: posts });
        this.setState(({ data: { nodes, links } }) => {
            // const newNodes = posts.nodes.slice();
            // const newLinks = posts.links.slice();
            // return { data: { nodes: [...nodes, ...posts.nodes], links: [...links, ...posts.links] } };
            // return { data: { nodes: [...nodes, ...posts.nodes], links: [...links, ...posts.links] } };
            // let nodes_json = JSON.parse(nodes);
            let nodes_json = nodes;
            for (let i = 0; i < posts.nodes.length; i++) {

                nodes_json.push(posts.nodes[i]);
            }
            // let links_json = JSON.parse(links);
            let links_json = links;
            for (let j = 0; j < posts.links.length; j++) {

                links_json.push(posts.links[j]);
            }

            return { data: { nodes: [...nodes_json], links: [...links_json] } };
        });
        this.setState({ highlightNodes: node ? [... this.state.highlightNodes, node] : [... this.state.highlightNodes] });

    };
    _handleNodeRightClick = async node =>{
        const position = {
            listid: node.listid,
            time: this.getTime()
        }
        await axios.post('https://localhost:6999/api/jump_info', position);
    };
    // _handlelinkClick = link => {
    //     this.setState({
    //         highlightLink: link,
    //         highlightNodes: link ? [link.source, link.target] : []
    //     });
    // };

    getTime() {
        const myDate = new Date();
        return myDate.toLocaleString();
    };

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    };
    _paintRing = (node, ctx) => {
        const { NODE_R } = Graph;
        // add ring just for highlighted nodes
        ctx.beginPath();
        ctx.arc(node.x, node.y, NODE_R * 1.4, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'red';
        ctx.fill();
    };
    // _nodeColor = (node) => {
    //     return this.state.highlightNodes.indexOf(node) === -1 ? 'rgba(0,255,255,0.6)' : 'rgb(255,0,0,1)';
    // }
    // async componentDidMount() {
    async componentDidMount() {
        const OK = await axios.get('http://localhost:6996/api/get_info');
        this.sleep(1000);
        const { data: posts } = await axios.get('https://localhost:6999/api/get_info_next');

        // const Data = require('../data/SVFG_before_opt.json');
        this.setState({ data: posts });
        // setInterval(() => {
        //     // this.setState(({ data: { nodes, links } }) => {
        //     //     return { data: { nodes: [...nodes], links: [...links] } };
        //     // });
        // }, 1000);
    }
    render() {
        // const { cpResult } = require('./wllvm.js');
        // cpResult();
        const { NODE_R } = Graph;
        const { data, highlightNodes, highlightLink } = this.state;
        // return <ForceGraph2D
        //     ref={el => { this.fg = el; }}
        //     graphData={data}
        //     nodeColor='ncolor'
        //     nodeLabel='wholelabel'
        //     backgroundColor='#B8B6B6'
        //     onNodeClick={this._handleClick}
        //     nodeRelSize={NODE_R}
        //     linkWidth={link => link === highlightLink ? 5 : 1}
        //     linkDirectionalParticles={4}
        //     linkDirectionalParticleWidth={link => link === highlightLink ? 4 : 0}
        //     nodeCanvasObjectMode={node => highlightNodes.indexOf(node) !== -1 ? 'before' : undefined}
        //     nodeCanvasObject={this._paintRing}
        //     onNodeHover={this._handleNodeHover}
        //     onLinkHover={this._handleLinkHover}
        // />;
        return <ForceGraph3D
            graphData={data}
            nodeColor={node => highlightNodes.indexOf(node) === -1 ? node.ncolor : 'rgba(0,255,255,0.6)'}
            nodeLabel='wholelabel'
            // backgroundColor='#B8B6B6'
            backgroundColor='#1f2430'
            linkDirectionalArrowLength={3.5}
            linkDirectionalArrowRelPos={1}
            linkCurvature={0.25}
            linkWidth={link => -1 === highlightLink.indexOf(link) ? 0 : 0}
            linkDirectionalParticles={link => -1 === highlightLink.indexOf(link) ? 0 : 4}
            linkDirectionalParticleWidth={link => -1 === highlightLink.indexOf(link) ? 0 : 2}
            onNodeClick={this._handleNodeClick}
            // onLinkClick={this._handleLinkClick}
            onNodeHover={this._handleNodeHover}
            onLinkHover={this._handleLinkHover}
            onNodeRightClick={this._handleNodeRightClick}
            nodeRelSize={NODE_R}
        />;
    }

}

export default Graph;