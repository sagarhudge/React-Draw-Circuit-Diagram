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
            id: 0,
            elements: [
                // { type: "busbar", orientation: "horizontal", x: 180, y: 100, length: 60, visible: true },
                // { type: "camera", x: 240, y: 88, length: 25, visible: true },
                // { type: "busbar", orientation: "horizontal", x: 265, y: 100, length: 90, visible: true },
                // { type: "openSwitch", x: 280, y: 96, orientation: "right", length: 50, visible: true },
                // { type: "ground", x: 260, y: 110, orientation: "left", length: 30, visible: true },
                // { type: "busbar", orientation: "vertical", x: 305, y: 143, length: 50, visible: true },
                // { type: "text", x: 290, y: 210, content: "1200", visible: true },
                // { type: "busbar", orientation: "vertical", x: 305, y: 215, length: 200, visible: true },
                // { type: "busbar", orientation: "horizontal", x: 305, y: 265, length: -70, visible: true },
                // { type: "busbar", orientation: "vertical", x: 235, y: 334, length: -70, visible: true },
                // { type: "curve", x: 160, y: 314, length: 150, visible: true },
                // { type: "halfcurve", x: 290, y: 430, length: 30, visible: true },
                // // { type: "dotBox",  x: 180, y: 0, width: 200, row1Height: 150, row2Height: 150 },
                // { type: "dotBox", x: 205, y: 55, row1Height: 130, row2Height: 190, width: 120, visible: true },
                { type: "redBox", x: 165, y: 35, row1Height: 150, row2Height: 230, width: 180, visible: true },
            ]
        }, {
            id: 1,
            elements: [
                { type: "busbar", orientation: "horizontal", x: 170, y: 100, length: 70, visible: true },
                { type: "camera", x: 240, y: 88, length: 25, visible: true },
                { type: "busbar", orientation: "horizontal", x: 265, y: 100, length: 90, visible: true },
                { type: "openSwitch", x: 280, y: 96, orientation: "right", length: 50, visible: true },
                { type: "ground", x: 260, y: 110, orientation: "left", length: 30, visible: true },
                { type: "busbar", orientation: "vertical", x: 305, y: 143, length: 50, visible: true },
                { type: "text", x: 290, y: 210, content: "1200", visible: true },
                { type: "busbar", orientation: "vertical", x: 305, y: 215, length: 200, visible: true },
                { type: "busbar", orientation: "horizontal", x: 305, y: 265, length: -70, visible: true },
                { type: "busbar", orientation: "vertical", x: 235, y: 334, length: -70, visible: true },
                { type: "curve", x: 160, y: 314, length: 150, visible: true },
                { type: "halfcurve", x: 290, y: 430, length: 30, visible: true },
                // { type: "dotBox",  x: 180, y: 0, width: 200, row1Height: 150, row2Height: 150 },
                { type: "dotBox", x: 205, y: 55, row1Height: 130, row2Height: 190, width: 120, visible: true },
                { type: "redBox", x: 170, y: 35, row1Height: 150, row2Height: 230, width: 180, visible: true },
            ]
        },  {
            id: 2,
            elements: [
                { type: "busbar", orientation: "horizontal", x: 180, y: 100, length: 60, visible: true },
                { type: "camera", x: 240, y: 88, length: 25, visible: true },
                { type: "busbar", orientation: "horizontal", x: 265, y: 100, length: 90, visible: true },
                { type: "openSwitch", x: 280, y: 96, orientation: "right", length: 50, visible: true },
                { type: "ground", x: 260, y: 110, orientation: "left", length: 30, visible: true },
                { type: "busbar", orientation: "vertical", x: 305, y: 143, length: 50, visible: true },
                { type: "text", x: 290, y: 210, content: "1200", visible: true },
                { type: "busbar", orientation: "vertical", x: 305, y: 215, length: 200, visible: true },
                { type: "busbar", orientation: "horizontal", x: 305, y: 265, length: -70, visible: true },
                { type: "busbar", orientation: "vertical", x: 235, y: 334, length: -70, visible: true },
                { type: "curve", x: 160, y: 314, length: 150, visible: true },
                { type: "halfcurve", x: 290, y: 430, length: 30, visible: true },
                // { type: "dotBox",  x: 180, y: 0, width: 200, row1Height: 150, row2Height: 150 },
                { type: "dotBox", x: 205, y: 55, row1Height: 130, row2Height: 190, width: 120, visible: true },
                { type: "redBox", x: 175, y: 35, row1Height: 150, row2Height: 230, width: 180, visible: true },
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
                case "dotBox":
                    drawDottedBox(element, offsetX);
                    break;
                case "redBox":
                    drawRedBox(element, offsetX);
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
                .attr('stroke-width', 1.5)
                .on('click', () => handleElementClick({ type: 'busbar', x: x + offsetX, y }));

            line.raise(); // Bring line to front
        };

        const drawImage = (imgSrc, { x, y, length, orientation }, offsetX) => {
            const image = svg.append('image')
                .attr('href', imgSrc)
                .attr('x', x + offsetX)
                .attr('y', y)
                .attr('width', length)
                .attr('height', length)
                .on('click', () => handleElementClick({ type: imgSrc, x: x + offsetX, y }));

            applyRotation(image, x + offsetX, y, length, orientation);
            image.raise(); // Bring image to front
        };

        const drawHalfCurve = ({ x, y, length }, offsetX) => {
            const halfCurvePath = `M${x + offsetX},${y} Q${x + length / 2 + offsetX},${y - length} ${x + length + offsetX},${y}`;
            const path = svg.append('path')
                .attr('d', halfCurvePath)
                .attr('stroke', '#000')
                .attr('stroke-width', 2)
                .attr('fill', 'none')
                .on('click', () => handleElementClick({ type: 'halfcurve', x: x + offsetX, y }));

            path.raise(); // Bring path to front
        };

        const drawCurve = ({ x, y, length }, offsetX) => {
            const curveImage = svg.append('image')
                .attr('href', curve)
                .attr('x', x + offsetX)
                .attr('y', y)
                .attr('width', length)
                .attr('height', length)
                .on('click', () => handleElementClick({ type: 'curve', x: x + offsetX, y }));

            curveImage.raise(); // Bring image to front
        };

        const drawText = ({ x, y, content }, offsetX) => {
            // Create a text element
            const textElement = svg.append('text')
                .attr('x', x + offsetX)
                .attr('y', y)
                .text(content)
                .attr('font-size', '14px')
                .attr('fill', '#000');

            // Get the bounding box of the text
            const bbox = textElement.node().getBBox();

            // Create a rectangle behind the text for the border
            svg.append('rect')
                .attr('x', bbox.x - 2) // Adding some padding
                .attr('y', bbox.y - 2) // Adding some padding
                .attr('width', bbox.width + 4) // Adding some padding
                .attr('height', bbox.height + 4) // Adding some padding
                .attr('fill', 'none') // Make it transparent
                .attr('stroke', '#000') // Border color
                .attr('stroke-width', 1); // Border width
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

        const handleElementClick = (element) => {
            alert(`Clicked on: ${element.type} at (${element.x}, ${element.y})`);
        };

        const drawStructures = () => {
            const boxHeightRow1 = 130; // Height of the first row
            const boxHeightRow2 = 190; // Height of the second row
            const boxWidth = 155; // Width of the dotted box

            circuitData.structures.forEach((structure, index) => {
                const offsetX = index * (boxWidth + 20); // Adjust the offset for each structure with some margin

                // Draw the elements of the current structure
                structure.elements.forEach((element) => drawElement(element, offsetX));
            });
        };

        const drawDottedBox = ({ x, y, row1Height, row2Height, width }, offsetX, color = "green") => {
            // Draw the top edge of the box
            svg.append('line')
                .attr('x1', x + offsetX)
                .attr('y1', y)
                .attr('x2', x + offsetX + width)
                .attr('y2', y)
                .attr('stroke', color)
                .attr('stroke-width', 1.5)
                .attr('stroke-dasharray', '5,5');

            // Draw the left side of the top row
            svg.append('line')
                .attr('x1', x + offsetX)
                .attr('y1', y)
                .attr('x2', x + offsetX)
                .attr('y2', y + row1Height)
                .attr('stroke', color)
                .attr('stroke-width', 1.5)
                .attr('stroke-dasharray', '5,5');

            // Draw the right side of the top row
            svg.append('line')
                .attr('x1', x + offsetX + width)
                .attr('y1', y)
                .attr('x2', x + offsetX + width)
                .attr('y2', y + row1Height)
                .attr('stroke', color)
                .attr('stroke-width', 1.5)
                .attr('stroke-dasharray', '5,5');

            // Draw the middle horizontal line
            svg.append('line')
                .attr('x1', x + offsetX)
                .attr('y1', y + row1Height)
                .attr('x2', x + offsetX + width)
                .attr('y2', y + row1Height)
                .attr('stroke', color)
                .attr('stroke-width', 1.5)
                .attr('stroke-dasharray', '5,5');

            // Draw the bottom edge of the box
            svg.append('line')
                .attr('x1', x + offsetX)
                .attr('y1', y + row1Height + row2Height)
                .attr('x2', x + offsetX + width)
                .attr('y2', y + row1Height + row2Height)
                .attr('stroke', color)
                .attr('stroke-width', 1.5)
                .attr('stroke-dasharray', '5,5');

            // Draw the left side of the bottom row
            svg.append('line')
                .attr('x1', x + offsetX)
                .attr('y1', y + row1Height)
                .attr('x2', x + offsetX)
                .attr('y2', y + row1Height + row2Height)
                .attr('stroke', color)
                .attr('stroke-width', 1.5)
                .attr('stroke-dasharray', '5,5');

            // Draw the right side of the bottom row
            svg.append('line')
                .attr('x1', x + offsetX + width)
                .attr('y1', y + row1Height)
                .attr('x2', x + offsetX + width)
                .attr('y2', y + row1Height + row2Height)
                .attr('stroke', color)
                .attr('stroke-width', 1.5)
                .attr('stroke-dasharray', '5,5');
        };

        const drawRedBox = ({ x, y, row1Height, row2Height, width }, offsetX, color = "red") => {
            // Draw the top edge of the box
            svg.append('line')
                .attr('x1', x + offsetX)
                .attr('y1', y)
                .attr('x2', x + offsetX + width)
                .attr('y2', y)
                .attr('stroke', 'red')
                .attr('stroke-width', 1.5)

            // Draw the left side of the top row
            svg.append('line')
                .attr('x1', x + offsetX)
                .attr('y1', y)
                .attr('x2', x + offsetX)
                .attr('y2', y + row1Height)
                .attr('stroke', color)
                .attr('stroke-width', 1.5)

            // Draw the right side of the top row
            svg.append('line')
                .attr('x1', x + offsetX + width)
                .attr('y1', y)
                .attr('x2', x + offsetX + width)
                .attr('y2', y + row1Height)
                .attr('stroke', color)
                .attr('stroke-width', 1.5)

             

            // Draw the bottom edge of the box
            svg.append('line')
                .attr('x1', x + offsetX)
                .attr('y1', y + row1Height + row2Height)
                .attr('x2', x + offsetX + width)
                .attr('y2', y + row1Height + row2Height)
                .attr('stroke', color)
                .attr('stroke-width', 1.5)

            // Draw the left side of the bottom row
            svg.append('line')
                .attr('x1', x + offsetX)
                .attr('y1', y + row1Height)
                .attr('x2', x + offsetX)
                .attr('y2', y + row1Height + row2Height)
                .attr('stroke', color)
                .attr('stroke-width', 1.5)

            // Draw the right side of the bottom row
            svg.append('line')
                .attr('x1', x + offsetX + width)
                .attr('y1', y + row1Height)
                .attr('x2', x + offsetX + width)
                .attr('y2', y + row1Height + row2Height)
                .attr('stroke', color)
                .attr('stroke-width', 1.5)
        };



        drawStructures(); // Call to draw structures
    }, []);

    return <svg ref={svgRef} width="100%" height="600" />;
};

export default CircuitDiagramD3;
