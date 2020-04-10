import React, { Component } from "react";
import { ForceGraph3D } from "react-force-graph";

interface ID {
    attr: string | number;
}
interface NodeData {
    id: number;
}

interface LinkData {
    source: number;
    target: number;
}

interface CoreData {
    nodes: Array<NodeData>;
    links: Array<LinkData>;
}

interface HighLightData {
    nodes: Array<NodeData>;
    links: Array<LinkData>;
}

interface Info {
    coreData: CoreData;
    highLightData: HighLightData;
}

interface vscode {
    postMessage(message: any): void;
}

declare const vscode: vscode;

class Graph extends Component<{}, Info> {
    initial() {
        const coreData: CoreData = {
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
        };
        this.setState({
            coreData: coreData,
        });
    }
    componentWillMount() {
        this.initial();
    }
    render() {
        const data = this.state.coreData;
        return (
            <ForceGraph3D
                graphData={data}
                onNodeClick={this._handleNodeClick}
            />
        );
    }

    _handleNodeClick = (node: any) => {
        this.func();
    };

    func() {
        // window.addEventListener("message", (event) => {
        //     const message = event.data; // The JSON data our extension sent
        //     switch (message.command) {
        //         case "refactor":
        //             count = Math.ceil(count * 0.5);
        //             counter.textContent = count;
        //             break;
        //     }
        // });
        vscode.postMessage({
            // command: "toSomeWhere",
            // info: { path: "This is path", line: 23, start: 3, end: 7 },
            command: "alert",
        });
    }
}

export default Graph;
