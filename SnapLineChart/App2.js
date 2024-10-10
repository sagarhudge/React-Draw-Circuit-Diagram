import React from 'react';
// Import your SVG files
import BusbarSVG from './canvasSplit/busBar.svg';
import CircuitBreakerSVG from './canvasSplit/switch.svg';
import OpenSwitchSVG from './canvasSplit/switch.svg';
import DisconnectSwitchSVG from './canvasSplit/switch.svg';
import GroundSVG from './canvasSplit/ground.svg';

const Diagram = ({ elements }) => {
  return (
    <svg width="500" height="500">
      {elements.map((element, index) => {
        const { position, orientation } = element;

        switch (element.type) {
          case 'busbar':
            return (
              <image
                key={index}
                href={BusbarSVG}
                x={position.x}
                y={position.y}
                width={orientation === 'horizontal' ? '200' : '20'}
                height={orientation === 'vertical' ? '200' : '20'}
                transform={`rotate(${
                  orientation === 'vertical' || orientation === 'bottom' ? 90 : 0
                })`}
              />
            );

          case 'circuitBreaker':
            return (
              <image
                key={index}
                href={CircuitBreakerSVG}
                x={position.x}
                y={position.y}
                width="40"
                height="40"
              />
            );

          case 'openSwitch':
            return (
              <image
                key={index}
                href={OpenSwitchSVG}
                x={position.x}
                y={position.y}
                width="40"
                height="40"
              />
            );

          case 'disconnectSwitch':
            return (
              <image
                key={index}
                href={DisconnectSwitchSVG}
                x={position.x}
                y={position.y}
                width="40"
                height="40"
              />
            );

          case 'ground':
            return (
              <image
                key={index}
                href={GroundSVG}
                x={position.x}
                y={position.y}
                width="40"
                height="40"
              />
            );

          case 'text':
            return (
              <text key={index} x={position.x} y={position.y} fontSize="12" fill="black">
                {element.content}
              </text>
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
      { type: 'busbar', position: { x: 50, y: 20 }, orientation: 'horizontal' },
      { type: 'circuitBreaker', position: { x: 100, y: 150 }, orientation: 'vertical' },
      { type: 'openSwitch', position: { x: 150, y: 20 }, orientation: 'horizontal' },
      { type: 'disconnectSwitch', position: { x: 100, y: 250 }, orientation: 'vertical' },
      { type: 'ground', position: { x: 100, y: 320 }, orientation: 'horizontal' },
      { type: 'text', content: '69KV BS 1-2', position: { x: 110, y: 100 }, orientation: 'vertical' },
    ]
  };

  return <Diagram elements={jsonData.elements} />;
};

export default App;
