import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import ground from './ground.svg';
import openSwitch from './openSwitch.svg';
import curve from './curve.svg';
import camera from './camera.svg';

// JSON input for the circuit diagram
const circuitData = {
    structures: [
        {
            id: 1,
            elements: [
                { type: "busbar", orientation: "horizontal", x: 150, y: 100, length: 60, visible: true },
                { type: "camera", x: 210, y: 83, length: 35, visible: true }, //left
                { type: "busbar", orientation: "horizontal", x: 245, y: 100, length: 60, visible: true },
                { type: "openSwitch", x: 280, y: 96, orientation: "right", length: 50, visible: true },
                { type: "ground", x: 240, y: 100, orientation: "left", length: 50, visible: true },
                { type: "busbar", orientation: "vertical", x: 305, y: 143, length: 50, visible: true },
                { type: "text", x: 290, y: 210, content: "1200", visible: true },
                { type: "busbar", orientation: "vertical", x: 305, y: 215, length: 200, visible: true },
                { type: "busbar", orientation: "horizontal", x: 305, y: 265, length: -100, visible: true },
                { type: "busbar", orientation: "vertical", x: 205, y: 334, length: -70, visible: true },
                { type: "curve", x: 130, y: 314, length: 150, visible: true },
                { type: "halfcurve", x: 290, y: 430, length: 30, visible: true },
            ]
        },
        {
            id: 2,
            elements: [
                { type: "busbar", orientation: "horizontal", x: 150, y: 100, length: 60, visible: true },
                { type: "camera", x: 210, y: 83, length: 35, visible: true }, //left
                { type: "busbar", orientation: "horizontal", x: 245, y: 100, length: 60, visible: true },
                { type: "openSwitch", x: 280, y: 96, orientation: "right", length: 50, visible: true },
                { type: "ground", x: 240, y: 100, orientation: "left", length: 50, visible: true },
                { type: "busbar", orientation: "vertical", x: 305, y: 143, length: 50, visible: true },
                { type: "text", x: 290, y: 210, content: "1200", visible: true },
                { type: "busbar", orientation: "vertical", x: 305, y: 215, length: 200, visible: true },
                { type: "busbar", orientation: "horizontal", x: 305, y: 265, length: -100, visible: true },
                { type: "busbar", orientation: "vertical", x: 205, y: 334, length: -70, visible: true },
                { type: "curve", x: 130, y: 314, length: 150, visible: true },
                { type: "halfcurve", x: 290, y: 430, length: 30, visible: true },
            ]
        },
    ]
};

const CircuitDiagramD3 = () => {
    const svgRef = useRef(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current);

        // Clear the SVG before drawing to avoid duplicate elements
        svg.selectAll('*').remove();

        const drawElement = (element, offsetX) => {
            if (!element.visible) return;

            switch (element.type) {
                case "busbar":
                    drawBusbar(element, offsetX);
                    break;
                case "camera":
                    drawImage(camera, element, offsetX);
                    break;
                case "openSwitch":
                    drawImage(openSwitch, element, offsetX);
                    break;
                case "ground":
                    drawImage(ground, element, offsetX);
                    break;
                case "text":
                    drawText(element, offsetX);
                    break;
                case "curve":
                    drawCurve(element, offsetX);
                    break;
                case "halfcurve":
                    drawHalfCurve(element, offsetX);
                    break;
                default:
                    break;
            }
        };

        const drawBusbar = ({ orientation, x, y, length }, offsetX) => {
            const line = svg.append('line')
                .attr('x1', x + offsetX)
                .attr('y1', y)
                .attr('x2', orientation === "horizontal" ? x + length + offsetX : x + offsetX)
                .attr('y2', orientation === "horizontal" ? y : y + length)
                .attr('stroke', '#000')
                .attr('stroke-width', 1.5);
        };

        const drawImage = (imgSrc, { x, y, length, orientation }, offsetX) => {
            const image = svg.append('image')
                .attr('href', imgSrc)
                .attr('x', x + offsetX)
                .attr('y', y)
                .attr('width', length)
                .attr('height', length);
            applyRotation(image, x + offsetX, y, length, orientation);
        };

        const drawHalfCurve = ({ x, y, length }, offsetX) => {
            const halfCurvePath = `M${x + offsetX},${y} Q${x + length / 2 + offsetX},${y - length} ${x + length + offsetX},${y}`;
            svg.append('path')
                .attr('d', halfCurvePath)
                .attr('stroke', '#000')
                .attr('stroke-width', 2)
                .attr('fill', 'none');
        };

        const drawCurve = ({ x, y, length }, offsetX) => {
            svg.append('image')
                .attr('href', curve)
                .attr('x', x + offsetX)
                .attr('y', y)
                .attr('width', length)
                .attr('height', length);
        };

        const drawText = ({ x, y, content }, offsetX) => {
            svg.append('text')
                .attr('x', x + offsetX)
                .attr('y', y)
                .text(content)
                .attr('font-size', '14px')
                .attr('fill', '#000');
        };

        const applyRotation = (element, x, y, length, orientation = '') => {
            const centerX = x + length / 2;
            const centerY = y + length / 2;
            const rotations = {
                left: `rotate(90, ${centerX}, ${centerY})`,
                right: `rotate(-90, ${centerX}, ${centerY})`,
                down: `rotate(180, ${centerX}, ${centerY})`,
            };
            if (orientation in rotations) {
                element.attr('transform', rotations[orientation]);
            }
        };

        const drawStructures = () => {
            circuitData.structures.forEach((structure, index) => {
                const offsetX = index * 150; // Adjust offsetX to separate structures horizontally
                structure.elements.forEach(element => drawElement(element, offsetX));

                // Draw a dotted box around each structure
                // DottedBox({ x: offsetX + 150, y: 80, width: 300, height: 300 });
                DottedBox({ x: offsetX+180, y: 80, width: 300, row1Height: 150, row2Height: 140 });

            });
        };
        const DottedBox = ({ x, y, width, row1Height, row2Height }) => {
            // First row
            svg.append('rect')
                .attr('x', x)
                .attr('y', y)
                .attr('width', width)
                .attr('height', row1Height)
                .attr('fill', 'none')
                .attr('stroke', 'green')
                .attr('stroke-width', 1)
                .attr('stroke-dasharray', '5,5');
        
            // Second row
            svg.append('rect')
                .attr('x', x)
                .attr('y', y + row1Height)
                .attr('width', width)
                .attr('height', row2Height)
                .attr('fill', 'none')
                .attr('stroke', 'green')
                .attr('stroke-width', 1)
                .attr('stroke-dasharray', '5,5');
        };
        

        drawStructures();

    }, []);

    return (
        <svg ref={svgRef} width="100%" height="600" style={{ border: '1px solid black' }} />
    );
};

export default CircuitDiagramD3;
