// import React, { useEffect, useRef } from 'react';
// import * as d3 from 'd3';

// interface GraphProps {
//   dot: string;
// }

// const D3Graph: React.FC<GraphProps> = ({ dot }) => {
//     const svgRef = useRef<SVGSVGElement | null>(null);

//     useEffect(() => {
//       const svg = d3.select(svgRef.current);
//       svg.selectAll('*').remove();

//       // Handle empty or invalid DOT string
//       if (!dot.trim()) {
//         svg.append('text')
//           .attr('x', 250)
//           .attr('y', 250)
//           .attr('text-anchor', 'middle')
//           .text('No graph data available')
//           .style('font-size', '24px')
//           .style('fill', '#666');
//         return;
//       }

//       const { nodes, links } = parseDotToGraph(dot);

//       if (nodes.length === 0) {
//         console.error('No nodes found in DOT string');
//         return;
//       }

//       const width = 500;
//       const height = 500;

//       svg.attr('width', width).attr('height', height);

//       const simulation = d3
//         .forceSimulation(nodes)
//         .force('link', d3.forceLink(links).id((d: any) => d.id))
//         .force('charge', d3.forceManyBody().strength(-200))
//         .force('center', d3.forceCenter(width / 2, height / 2));

//       svg
//         .append('g')
//         .selectAll('line')
//         .data(links)
//         .enter()
//         .append('line')
//         .attr('stroke', '#999')
//         .attr('stroke-width', 2);

//       const node = svg
//         .append('g')
//         .selectAll('circle')
//         .data(nodes)
//         .enter()
//         .append('circle')
//         .attr('r', 10)
//         .attr('fill', (d) => d.color)
//         .call(
//           d3
//             .drag()
//             .on('start', (event, d) => {
//               if (!event.active) simulation.alphaTarget(0.3).restart();
//               d.fx = d.x;
//               d.fy = d.y;
//             })
//             .on('drag', (event, d) => {
//               d.fx = event.x;
//               d.fy = event.y;
//             })
//             .on('end', (event, d) => {
//               if (!event.active) simulation.alphaTarget(0);
//               d.fx = null;
//               d.fy = null;
//             })
//         );

//       node.append('title').text((d) => d.label);

//       simulation.on('tick', () => {
//         svg
//           .selectAll('line')
//           .attr('x1', (d) => (d as any).source.x)
//           .attr('y1', (d) => (d as any).source.y)
//           .attr('x2', (d) => (d as any).target.x)
//           .attr('y2', (d) => (d as any).target.y);

//         node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
//       });

//       // Example: Change color on click
//       node.on('click', (event, d) => {
//         d3.select(event.currentTarget).attr('fill', '#ff0000');
//       });

//       return () => {
//         simulation.stop();
//         svg.selectAll('*').remove();
//       };
//     }, [dot]);

//     return <svg ref={svgRef}></svg>;
//   };

//   export default D3Graph;

// // const D3Graph: React.FC<GraphProps> = ({ dot }) => {
// //     const containerRef = useRef<HTMLDivElement | null>(null);
// //     const svgRef = useRef<SVGSVGElement | null>(null);

// //   useEffect(() => {
// //     // Clear previous content
// //     const svg = d3.select(svgRef.current);
// //     svg.selectAll('*').remove();

// //     // Check if the DOT string is empty
// //     if (dot === '') {
// //       // Display a placeholder or message when DOT is empty
// //       svg.append('text')
// //         .attr('x', 250) // center x
// //         .attr('y', 250) // center y
// //         .attr('text-anchor', 'middle')
// //         .text('No graph data available')
// //         .style('font-size', '24px')
// //         .style('fill', '#666');
// //       return; // Exit early if no data
// //     }

// //     // Continue with normal parsing and rendering if the DOT string is not empty
// //     const { nodes, links } = parseDotToGraph(dot);

// //     // Debugging logs
// //     console.log('dot string', dot);
// //     console.log('Parsed nodes:', nodes);
// //     console.log('Parsed links:', links);

// //     // Ensure all nodes referenced in links exist in nodes
// //     const nodeIds = new Set(nodes.map((node: any) => node.id));
// //     const validLinks = links.filter((link: any) => nodeIds.has(link.source) && nodeIds.has(link.target));

// //     if (validLinks.length !== links.length) {
// //       console.warn('Some links reference non-existent nodes');
// //     }

// //     if (nodes.length === 0) {
// //       console.error('No nodes found in DOT string');
// //       return;
// //     }

// //     const width = 500;
// //     const height = 500;

// //     svg.attr('width', width).attr('height', height);

// //     const simulation = d3
// //       .forceSimulation(nodes)
// //       .force('link', d3.forceLink(links).id((d: any) => d.id))
// //       .force('charge', d3.forceManyBody().strength(-200))
// //       .force('center', d3.forceCenter(width / 2, height / 2));

// //     svg
// //       .append('g')
// //       .selectAll('line')
// //       .data(links)
// //       .enter()
// //       .append('line')
// //       .attr('stroke', '#999')
// //       .attr('stroke-width', 2);

// //     const node = svg
// //       .append('g')
// //       .selectAll('circle')
// //       .data(nodes)
// //       .enter()
// //       .append('circle')
// //       .attr('r', 10)
// //       .attr('fill', (d) => d.color)
// //     //   .call(
// //     //     d3
// //     //       .drag()
// //     //       .on('start', (event, d) => {
// //     //         if (!event.active) simulation.alphaTarget(0.3).restart();
// //     //         d.fx = d.x;
// //     //         d.fy = d.y;
// //     //       })
// //     //       .on('drag', (event, d) => {
// //     //         d.fx = event.x;
// //     //         d.fy = event.y;
// //     //       })
// //     //       .on('end', (event, d) => {
// //     //         if (!event.active) simulation.alphaTarget(0);
// //     //         d.fx = null;
// //     //         d.fy = null;
// //     //       })
// //     //   );

// //     node.append('title').text((d) => d.label);

// //     simulation.on('tick', () => {
// //       svg
// //         .selectAll('line')
// //         .attr('x1', (d) => (d as any).source.x)
// //         .attr('y1', (d) => (d as any).source.y)
// //         .attr('x2', (d) => (d as any).target.x)
// //         .attr('y2', (d) => (d as any).target.y);

// //       node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
// //     });

// //     // Example: Change color on click
// //     // node.on('click', (event, d) => {
// //     //   d3.select(event.currentTarget).attr('fill', '#ff0000');
// //     // });

// //     return () => {
// //       simulation.stop();
// //       svg.selectAll('*').remove();
// //     };
// //   }, [dot]);

// //   return (
// //     <div ref={containerRef} >
// //       <svg ref={svgRef}></svg>
// //     </div>
// //   );};

// // export default D3Graph;

// // Helper function to parse DOT data
// const parseDotToGraph = (dot: string) => {
//     console.log('parseDotToGraph dot is ', dot);
//     const nodes: { id: string; label: string; color: string }[] = [];
//     const links: { source: string; target: string }[] = [];
//     let match;

//     const splittedGraph = dot.split('\n');
//     console.log('splittedGraph', splittedGraph);

//     const edgePattern = /(\w+)\s+->\s+(\w+)/g;
//     const nodePattern = /(Node[^\s]+)\s*\[shape=([^\s,]+),color=([^\s,]+),label=\{([^}]*)\}\]/;

//     for (const line of splittedGraph) {
//         const trimmedLine = line.trim();
//         if ((match = trimmedLine.match(nodePattern))) {
//             const [id, shape, label, color] = match;
//             nodes.push({ id, label, color });
//         } else if ((match = edgePattern.exec(trimmedLine))) {
//             const [_, source, target] = match;
//             links.push({ source, target });
//         }
//     }
//     console.log('nodes', nodes);
//     console.log('links', links);

//     // const nodePattern = /(\w+)\s+\[.*label=\"([^\"]*)\".*color=([^,]*)/g;

//     // const nodePattern = /Node([0-9]+([A-Za-z][0-9]+)+).*\[shape=.*,.*label=".*\]/g;

//     // while ((match = nodePattern.exec(dot))) {
//     //     console.log('match', match);
//     //     const [_, id, label, color] = match;
//     //     nodes.push({ id, label, color });
//     // }

//     // while ((match = edgePattern.exec(dot))) {
//     // const [_, source, target] = match;
//     // links.push({ source, target });
//     // }

//     return { nodes, links };
// };
