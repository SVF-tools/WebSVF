import React, { useEffect, useRef } from 'react';
import { IAnnotation, IMarker } from 'react-ace';
import parse, { domToReact, HTMLReactParserOptions, Element as HtmlElement } from 'html-react-parser';

const options: HTMLReactParserOptions = {
  replace: (node) => {
    if ((node as HtmlElement).type === 'tag') {
      const el = node as HtmlElement;
      if (el.name === 'svg') {
        const { attribs, children } = el;
        const { viewbox: viewBox, 'xmlns:xlink': xmlnsXlink, ...rest } = attribs || {};
        return (
          <svg viewBox={viewBox} xmlnsXlink={xmlnsXlink} {...rest}>
            {domToReact(children as any, options)}
          </svg>
        );
      }

      if (el.name === 'polygon') {
        const { attribs, children } = el;
        const { 'stroke-width': strokeWidth, ...rest } = attribs || {};
        return (
          <polygon strokeWidth={strokeWidth} {...rest}>
            {domToReact(children as any, options)}
          </polygon>
        );
      }

      if (el.name === 'text') {
        const { attribs, children } = el;
        const { 'text-anchor': textAnchor, 'font-family': fontFamily, 'font-size': fontSize, ...rest } = attribs || {};
        return (
          <text textAnchor={textAnchor} fontFamily={fontFamily} fontSize={fontSize} {...rest}>
            {domToReact(children as any, options)}
          </text>
        );
      }

      if (el.name === 'path') {
        const { attribs } = el;
        const { 'stroke-dasharray': strokeDasharray, ...rest } = attribs || {};
        return <path strokeDasharray={strokeDasharray} {...rest} />;
      }
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
    return <>{parse(output, options)}</>;
  }

  return <div></div>;
};

export default RenderSvg;
