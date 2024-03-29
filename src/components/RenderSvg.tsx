import React, { useEffect, useRef } from 'react';
import { IAnnotation, IMarker } from 'react-ace';
import ReactHtmlParser, { convertNodeToElement, Transform } from 'react-html-parser';

const transform: Transform = (node, index) => {
  if (node.type === 'tag') {
    if (node.name === 'svg') {
      const children = node.children as any[];
      const { viewbox: viewBox, 'xmlns:xlink': xmlnsXlink, ...rest } = node.attribs;

      return (
        <svg key={index} viewBox={viewBox} xmlnsXlink={xmlnsXlink} {...rest}>
          {children.map((x, i) => convertNodeToElement(x, i, transform))}
        </svg>
      );
    }

    if (node.name === 'polygon') {
      const children = node.children as any[];
      const { 'stroke-width': strokeWidth, ...rest } = node.attribs;

      return (
        <polygon key={index} strokeWidth={strokeWidth} {...rest}>
          {children.map((x, i) => convertNodeToElement(x, i, transform))}
        </polygon>
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

export interface IOnGraphClickProps {
  markers: IMarker[];
  annotations: IAnnotation[];
}

export interface IRenderSvgProps {
  output: string;
  onGraphClick: (props: IOnGraphClickProps) => void;
}

const RenderSvg: React.FC<IRenderSvgProps> = ({ output, onGraphClick }) => {
  const handleOnClickRef = useRef<number>();

  const handleOnClick: EventListenerOrEventListenerObject = (e) => {
    if (handleOnClickRef.current) {
      clearTimeout(handleOnClickRef.current);
    }

    handleOnClickRef.current = window.setTimeout(() => {
      const innerHtml = (e.target as Element).innerHTML;

      var splitString = innerHtml.split(' ');

      let lineElementIndex = splitString.findIndex((value) => {
        return value === 'ln:';
      });

      //ace editor line number starts from 0 although users can see it start from one in frontend
      var lineNumber = parseInt(splitString[lineElementIndex + 1]) - 1;

      const markers: IMarker[] = [
        {
          startRow: lineNumber,
          endRow: lineNumber + 1,
          type: 'text',
          className: 'test-marker',
          startCol: 0,
          endCol: 10
        }
      ];

      const annotations: IAnnotation[] = [
        {
          row: lineNumber,
          column: 3,
          text: innerHtml,
          type: 'info'
        }
      ];
      onGraphClick({ markers: markers, annotations: annotations });
    }, 1000);
  };

  useEffect(() => {
    if (document.querySelector(`#graph0`)) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(output, 'text/xml');

      let text = Array.from(xmlDoc.getElementsByTagName('g'));

      let filtered = text
        .filter(
          (value) =>
            /\{[\s]+ln:[\s]+[0-9]+[\s]+cl:[\s]+[0-9]+[\s]+fl:[\s]+[a-z]+\.c[\s]+\}/.test(value.innerHTML) ||
            /\{[\s]+in[\s]+line:[\s]+[0-9]+[\s]+file:[\s]+[a-z]+\.c[\s]+\}/.test(value.innerHTML)
        )
        .map((value) => {
          return value.id;
        });

      filtered.forEach((value) => {
        if (value !== 'graph0') {
          document?.querySelector(`#${value}`)?.addEventListener('click', handleOnClick);
        }
      });
    }
  });

  if (output) {
    return <>{ReactHtmlParser(output, { transform: transform })}</>;
  }

  return <div></div>;
};

export default RenderSvg;
