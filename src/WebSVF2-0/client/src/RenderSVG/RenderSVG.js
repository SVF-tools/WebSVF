import React, { useEffect } from 'react';
import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser';

import './rendersvg.css';

const transform = (node, index) => {
  if (node.type === 'tag') {
    if (node.name === 'svg') {
      const children = node.children;
      const { viewbox: viewBox, 'xmlns:xlink': xmlnsXlink, ...rest } = node.attribs;

      return (
        <svg key={index} viewBox={viewBox} xmlnsXlink={xmlnsXlink} {...rest}>
          {children.map((x, i) => convertNodeToElement(x, i, transform))}
        </svg>
      );
    }

    if (node.name === 'text') {
      const child = node.children[0];
      const { 'text-anchor': textAnchor, 'font-family': fontFamily, 'font-size': fontSize, ...rest } = node.attribs;
      return (
        <text key={index} textAnchor={textAnchor} fontFamily={fontFamily} fontSize={fontSize} {...rest}>
          {convertNodeToElement(child, index, transform)}
        </text>
      );
    }

    if (node.name === 'path') {
      const { 'stroke-dasharray': strokeDasharray, ...rest } = node.attribs;
      return <path key={index} strokeDasharray={strokeDasharray} {...rest} />;
    }
  }
};

const RenderSVG = (props) => {
  function handleOnClick(e) {
    var splitString = e.target.innerHTML.split(' ');

    let lineElementIndex = splitString.findIndex((value) => {
      return value === 'ln:';
    });

    //ace editor line number starts from 0 although users can see it start from one in frontend
    var lineNumber = splitString[lineElementIndex + 1] - 1;
    const markers = [
      {
        startRow: lineNumber,
        endRow: lineNumber + 1,
        type: 'text',
        className: 'test-marker'
      }
    ];
    const annotation = [
      {
        row: lineNumber,
        column: 3,
        text: e.target.innerHTML,
        type: 'text'
      }
    ];
    props.updateMarker(markers);
    props.updateAnnotation(annotation);
  }

  useEffect(() => {
    if (document.querySelector(`#graph0`)) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(props.output, 'text/xml');

      let text = Array.from(xmlDoc.getElementsByTagName('g'));

      let filtered = text
        .filter(
          (value) =>
            /\{[\s]+ln\:[\s]+[0-9]+[\s]+cl\:[\s]+[0-9]+[\s]+fl\:[\s]+[a-z]+\.c[\s]+\}/.test(value.innerHTML) ||
            /\{[\s]+in[\s]+line\:[\s]+[0-9]+[\s]+file\:[\s]+[a-z]+\.c[\s]+\}/.test(value.innerHTML)
        )
        .map((value) => {
          return value.id;
        });

      filtered.forEach((value) => {
        if (value !== 'graph0') {
          document.querySelector(`#${value}`).addEventListener('click', handleOnClick);
        }
      });
    }
  });

  if (props.output) {
    let html = props.output;

    return <div>{ReactHtmlParser(html, { transform: transform })}</div>;
  }

  return <div></div>;
};

export default RenderSVG;
