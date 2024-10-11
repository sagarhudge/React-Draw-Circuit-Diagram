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
                { type: "busbar", orientation: "horizontal", x: 180, y: 100, length: 60, visible: true },
                { type: "camera", x: 240, y: 88, length: 25, visible: true },
                { type: "busbar", orientation: "horizontal", x: 265, y: 100, length: 70, visible: true },
                { type: "openSwitch", x: 280, y: 96, orientation: "right", length: 50, visible: true },
                { type: "ground", x: 260, y: 110, orientation: "left", length: 30, visible: true },
                { type: "busbar", orientation: "vertical", x: 305, y: 143, length: 50, visible: true },
                { type: "text", x: 290, y: 210, content: "1200", visible: true },
                { type: "busbar", orientation: "vertical", x: 305, y: 215, length: 200, visible: true },
                { type: "busbar", orientation: "horizontal", x: 305, y: 265, length: -70, visible: true },
                { type: "busbar", orientation: "vertical", x: 235, y: 334, length: -70, visible: true },
                { type: "curve", x: 160, y: 314, length: 150, visible: true },
                { type: "halfcurve", x: 290, y: 430, length: 30, visible: true },
                { type: "halfcurve", x: 290, y: 430, length: 30, visible: true },
            ]
        },{
            id: 2,
            elements: [
                { type: "busbar", orientation: "horizontal", x: 180, y: 100, length: 60, visible: true },
                { type: "camera", x: 240, y: 88, length: 25, visible: true },
                { type: "busbar", orientation: "horizontal", x: 265, y: 100, length: 70, visible: true },
                { type: "openSwitch", x: 280, y: 96, orientation: "right", length: 50, visible: true },
                { type: "ground", x: 260, y: 110, orientation: "left", length: 30, visible: true },
                { type: "busbar", orientation: "vertical", x: 305, y: 143, length: 50, visible: true },
                { type: "text", x: 290, y: 210, content: "1200", visible: true },
                { type: "busbar", orientation: "vertical", x: 305, y: 215, length: 200, visible: true },
                { type: "busbar", orientation: "horizontal", x: 305, y: 265, length: -70, visible: true },
                { type: "busbar", orientation: "vertical", x: 235, y: 334, length: -70, visible: true },
                { type: "curve", x: 160, y: 314, length: 150, visible: true },
                { type: "halfcurve", x: 290, y: 430, length: 30, visible: true },
            ]
        }
    ]
};

const CircuitDiagramD3 = () => {
    const svgRef = useRef(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); // Clear the SVG before drawing

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
            svg.append('line')
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
            const boxWidth = 155;
            const boxHeightRow1 = 130;
            const boxHeightRow2 = 190;

            circuitData.structures.forEach((structure, index) => {
                const offsetX = index * (boxWidth);
                const margin = 10;

                // Draw the red box with margin
                LineBox(svg, {
                    x: offsetX + 180 - margin,
                    y: 50 - margin,
                    width: boxWidth + margin * 2,
                    height: boxHeightRow1 + boxHeightRow2 + margin * 2,
                });

                // Draw the dotted box
                DottedBox({
                    x: offsetX + 180,
                    y: 50,
                    width: boxWidth,
                    row1Height: boxHeightRow1,
                    row2Height: boxHeightRow2
                });

                structure.elements.forEach((element) => drawElement(element, offsetX));
            });
        };

        const DottedBox = ({ x, y, width, row1Height, row2Height }) => {
            svg.append('rect')
                .attr('x', x)
                .attr('y', y)
                .attr('width', width)
                .attr('height', row1Height + row2Height)
                .attr('fill', 'none')
                .attr('stroke', 'green')
                .attr('stroke-width', 1.5)
                .attr('stroke-dasharray', '5,5');
        };

        const LineBox = (svg, { x, y, width, height }) => {
            svg.append('rect')
                .attr('x', x)
                .attr('y', y)
                .attr('width', width)
                .attr('height', height)
                .attr('fill', 'none')
                .attr('stroke', 'red')
                .attr('stroke-width', 2);
        };

        drawStructures();
    }, []);

    return <svg ref={svgRef} width="100%" height="600" />;
};

export default CircuitDiagramD3;
