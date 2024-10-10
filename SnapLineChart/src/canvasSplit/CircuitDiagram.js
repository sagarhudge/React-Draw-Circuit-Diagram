import React from 'react';
import Switch from './switch.svg'

const CircuitDiagram = ({ data }) => {
    return (
        <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg" style={{ border: '1px solid black' }}>
            {data.components.map((component, index) => {
                switch (component.type) {
                    case 'switch':
                        return (
                            <g key={index}>
                                {/* Switch as a rectangle */}
                                <rect x={component.x} y={component.y - 10} width="20" height="20" fill="lightgray" stroke="black" />
                                {/* Switch Label */}
                                <text x={component.x} y={component.y - 15} fontSize="10">{component.label}</text>
                                {/* Ground connection */}
                                {component.connections.map((connection, idx) => (
                                    <g key={idx}>
                                        {/* Wire to ground */}
                                        <line
                                            x1={component.x + 10}
                                            y1={component.y + 10}
                                            x2={connection.x + 10}
                                            y2={connection.y}
                                            stroke="black"
                                            strokeWidth="2"
                                        />
                                        {/* Ground symbol */}
                                        {/* <circle cx={connection.x + 10} cy={connection.y} r="5" stroke="black" fill="none" /> */}
                                        <line x1={connection.x + 5} y1={connection.y} x2={connection.x + 15} y2={connection.y} stroke="black" />
                                        {/* <line x1={connection.x + 5} y1={connection.y} x2={connection.x + 15} y2={connection.y} stroke="black" /> */}
                                    </g>
                                ))}
                            </g>
                        );
                    case 'wire':
                        return (
                            <line
                                key={index}
                                x1={component.x1}
                                y1={component.y1}
                                x2={component.x2}
                                y2={component.y2}
                                stroke="black"
                                strokeWidth="2"
                            />
                        );
                    case 'vertical_wire':
                        return (
                            <line
                                key={index}
                                x1={component.x1}
                                y1={component.y1}
                                x2={component.x2}
                                y2={component.y2}
                                stroke="black"
                                strokeWidth="2"
                            />
                        );
                    case 'down_arrow':
                        return (
                            <g key={index}>
                                {/* Down arrow */}
                                <line x1={component.x} y1={component.y} x2={component.x} y2={component.y + 20} stroke="black" strokeWidth="2" />
                                <polygon points={`${component.x - 5},${component.y + 20} ${component.x + 5},${component.y + 20} ${component.x},${component.y + 30}`} fill="black" />
                            </g>
                        );
                    default:
                        return null;
                }
            })}
        </svg>
    );
};


export default CircuitDiagram;
