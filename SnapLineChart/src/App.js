import React from 'react';
import CircuitDiagramSnap from './snap/CircuitDiagramSnap';

const Diagram = ({ elements }) => {
  return (
    <svg width="500" height="500">
      {elements.map((element, index) => {
        const rotateElement = (orientation, x, y) => {
          switch (orientation) {
            case 'vertical':
              return `rotate(90, ${x}, ${y})`;
            case 'horizontal':
            default:
              return 'horizontal';
          }
        };
        switch (element.type) {
          case 'busbar':
            return (
              <line
                key={index}
                x1={element.position.x}
                y1={element.position.y}
                x2={element.position.x + element.length}
                y2={element.position.y}
                stroke="black"
                strokeWidth="2"


              />
            );
          case 'text':
            return (
              <text
                key={index}
                x={element.position.x}
                y={element.position.y}
                fontSize="12"
                fill="black"
              >
                {element.content}
              </text>
            );
          case 'line':
            return (
              <line
                key={index}
                x1={element.start.x}
                y1={element.start.y}
                x2={element.end.x}
                y2={element.end.y}
                stroke="black"
                strokeWidth="2"
              />
            );
          case 'circuitBreaker':
            return (
              <rect
                key={index}
                x={element.position.x}
                y={element.position.y}
                width={element.size.width}
                height={element.size.height}
                fill="none"
                stroke="black"
              />
            );
          case 'disconnectSwitch':
            return (
              <line
                key={index}
                x1={element.position.x}
                y1={element.position.y}
                x2={element.position.x + 20}
                y2={element.position.y - 20}
                stroke="black"
                strokeWidth="2"
              />
            );
          case 'ground':
            return (
              <>
                <line
                  key={index}
                  x1={element.position.x}
                  y1={element.position.y}
                  x2={element.position.x}
                  y2={element.position.y + 10}
                  stroke="black"
                />
                <line
                  key={`${index}-1`}
                  x1={element.position.x - 5}
                  y1={element.position.y + 10}
                  x2={element.position.x + 5}
                  y2={element.position.y + 10}
                  stroke="black"
                />
                <line
                  key={`${index}-2`}
                  x1={element.position.x - 3}
                  y1={element.position.y + 15}
                  x2={element.position.x + 3}
                  y2={element.position.y + 15}
                  stroke="black"
                />
                <line
                  key={`${index}-3`}
                  x1={element.position.x - 1}
                  y1={element.position.y + 20}
                  x2={element.position.x + 1}
                  y2={element.position.y + 20}
                  stroke="black"
                />
              </>
            );
          default:
            return null;
        }
      })}
    </svg>
  );
};

const App = () => {
  const jsonData = {
    elements: [
      { type: 'busbar', position: { x: 50, y: 20 }, length: 300, orientation: 'horizontal' },
      { type: 'text', content: '11K', position: { x: 150, y: 10 } },
      { type: 'line', start: { x: 100, y: 20 }, end: { x: 100, y: 300 }, orientation: 'horizontal' },
      { type: 'line', start: { x: 200, y: 20 }, end: { x: 200, y: 300 }, orientation: 'horizontal' },
      { type: 'circuitBreaker', position: { x: 100, y: 150 }, size: { width: 30, height: 20 } },
      { type: 'circuitBreaker', position: { x: 200, y: 150 }, size: { width: 30, height: 20 } },
      { type: 'disconnectSwitch', position: { x: 100, y: 250 } },
      { type: 'disconnectSwitch', position: { x: 200, y: 250 } },
      { type: 'ground', position: { x: 100, y: 320 } },
      { type: 'ground', position: { x: 200, y: 320 } },
      { type: 'text', content: '69KV BS 1-2', position: { x: 110, y: 100 } },
      { type: 'text', content: '69KV BS 7', position: { x: 210, y: 100 } }
    ]
  };

  return <CircuitDiagramSnap />;
};

export default App;
