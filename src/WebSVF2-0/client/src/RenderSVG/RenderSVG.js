import React, { useEffect } from 'react';
import ReactHtmlParser from 'react-html-parser';

import './rendersvg.css';

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

  return <div>{props.output ? ReactHtmlParser(props.output) : <div></div>}</div>;
};

export default RenderSVG;
