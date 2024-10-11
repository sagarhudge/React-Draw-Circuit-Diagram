import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import ground from './ground.svg';
import openSwitch from './openSwitch.svg';
import curve from './curve.svg';
import camera from './camera.svg';
import fuse from './fuse.svg';
import resistor from './resisor.svg';

// JSON input for the circuit diagram
import circuitData from './circuitData.json';

const CircuitDiagramD3 = () => {
    const svgRef = useRef(null);
    const [selectedBox, setSelectedBox] = useState(null); // State for selected box

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); // Clear the SVG before drawing

        const drawElement = (element, offsetX, index) => {
            if (!element.visible) return;

            switch (element.type) {
                case 'busbar':
                    drawBusbar(element, offsetX);
                    break;
                case 'camera':
                    drawImage(camera, element, offsetX);
                    break;
                case 'openSwitch':
                    drawImage(openSwitch, element, offsetX);
                    break;
                case 'fuse':
                    drawImage(fuse, element, offsetX);
                    break;
                case 'resistor':
                    drawImage(resistor, element, offsetX);
                    break;
                case 'ground':
                    drawImage(ground, element, offsetX);
                    break;
                case 'text':
                    drawText(element, offsetX);
                    break;
                case 'curve':
                    drawCurve(element, offsetX);
                    break;
                case 'halfcurve':
                    drawHalfCurve(element, offsetX);
                    break;
                case 'dotBox':
                    drawRectBox(element, offsetX, true); // Dotted box
                    break;
                case 'redBox':
                    drawRectBox(element, offsetX, false); // Red box
                    break;
                case 'trans':
                    drawTransformer(element, offsetX);
                    break;
                default:
                    break;
            }
        };

        const drawBusbar = ({ orientation, x, y, length }, offsetX) => {
            const line = svg
                .append('line')
                .attr('x1', x + offsetX)
                .attr('y1', y)
                .attr('x2', orientation === 'horizontal' ? x + length + offsetX : x + offsetX)
                .attr('y2', orientation === 'horizontal' ? y : y + length)
                .attr('stroke', 'red')
                .attr('stroke-width', 1.5)
                .on('click', () => handleElementClick({ type: 'busbar', x: x + offsetX, y }));

            line.raise(); // Bring line to front
        };

        const drawTransformer = ({ orientation, x, y, length }, offsetX) => {
            const line = svg
                .append('line')
                .attr('x1', x + offsetX)
                .attr('y1', y)
                .attr('x2', orientation === 'horizontal' ? x + length + offsetX : x + offsetX)
                .attr('y2', orientation === 'horizontal' ? y : y + length)
                .attr('stroke', 'black')
                .attr('stroke-width', 5)
                .on('click', () => handleElementClick({ type: 'busbar', x: x + offsetX, y }));

            line.raise(); // Bring line to front
        };

        const drawImage = (imgSrc, { x, y, length, orientation }, offsetX) => {
            const image = svg
                .append('image')
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
            const path = svg
                .append('path')
                .attr('d', halfCurvePath)
                .attr('stroke', 'red')
                .attr('stroke-width', 2)
                .attr('fill', 'none')
                .on('click', () => handleElementClick({ type: 'halfcurve', x: x + offsetX, y }));

            path.raise(); // Bring path to front
        };

        const drawCurve = ({ x, y, length }, offsetX) => {
            const curveImage = svg
                .append('image')
                .attr('href', curve)
                .attr('x', x + offsetX)
                .attr('y', y)
                .attr('width', length)
                .attr('height', length)
                .on('click', () => handleElementClick({ type: 'curve', x: x + offsetX, y }));

            curveImage.raise(); // Bring image to front
        };

        const drawText = ({ x, y, content }, offsetX) => {
            const textElement = svg
                .append('text')
                .attr('x', x + offsetX)
                .attr('y', y)
                .text(content)
                .attr('font-size', '14px')
                .attr('fill', '#000');

            const bbox = textElement.node().getBBox();

            svg.append('rect')
                .attr('x', bbox.x - 2)
                .attr('y', bbox.y - 2)
                .attr('width', bbox.width + 4)
                .attr('height', bbox.height + 4)
                .attr('fill', 'none')
                .attr('stroke', '#000')
                .attr('stroke-width', 1);
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

            const boxWidth = 155; // Width of the dotted box

            circuitData.structures.forEach((structure, index) => {
                const offsetX = index * (boxWidth + 20); // Adjust the offset for each structure with some margin

                // Draw the elements of the current structure
                structure.elements.forEach((element, index) => drawElement(element, offsetX, index));
            });
        };


        const drawRectBox = ({ x, y, row1Height, row2Height, width }, offsetX, isDotted) => {
            // Draw the main rectangle for the box
            const rect = svg.append('rect')
                .attr('x', x + offsetX)
                .attr('y', y)
                .attr('width', width)
                .attr('height', row1Height + row2Height)
                .attr('fill', 'none') // Set initial fill to none
                .attr('stroke', isDotted ? '#1919b5' : '#4c4c4c')
                .attr('stroke-width', 1.5)
                .attr('stroke-dasharray', isDotted ? '5,5' : 'none')
                .attr('pointer-events', 'all') // Ensure pointer events are captured
                .on('click', () => handleBoxClick({ x: x + offsetX, y, width, height: row1Height + row2Height, isDotted }));

            // Draw the middle dotted line only if it's a dotted box
            if (isDotted) {
                const middleY = y + row1Height; // Middle line position
                const middleLine = svg.append('line')
                    .attr('x1', x + offsetX)
                    .attr('y1', middleY)
                    .attr('x2', x + offsetX + width)
                    .attr('y2', middleY)
                    .attr('stroke', '#1919b5') // Dotted line color
                    .attr('stroke-width', 1.5)
                    .attr('stroke-dasharray', '5,5') // Dotted style
                    .attr('pointer-events', 'all') // Ensure pointer events are captured
                    .on('click', () => handleBoxClick({ x: x + offsetX, y, width, height: row1Height + row2Height, isDotted }));
            }

            // Highlight the selected box if it is selected
            if (selectedBox && selectedBox.x === x + offsetX && selectedBox.y === y) {
                rect.attr('fill', isDotted ? 'rgba(208, 224, 255, 0.5)' : 'rgba(255, 204, 204, 0.5)'); // Change fill color on selection with transparency
            }
        };

        const handleBoxClick = (box) => {
            // Toggle selection
            const newSelectedBox = selectedBox && selectedBox.x === box.x && selectedBox.y === box.y ? null : box;
            setSelectedBox(newSelectedBox);

            // Update the fill color of the previously selected box if it exists
            if (selectedBox) {
                const prevRect = svg.select(`rect[x="${selectedBox.x}"][y="${selectedBox.y}"]`);
                prevRect.attr('fill', 'none'); // Reset previous box fill
            }

            // Set the fill color for the newly selected box
            if (newSelectedBox) {
                const newRect = svg.select(`rect[x="${newSelectedBox.x}"][y="${newSelectedBox.y}"]`);
                if (newRect.node()) {
                    newRect.attr('fill', newSelectedBox.isDotted ? 'rgba(208, 224, 255, 0.5)' : 'rgba(255, 204, 204, 0.5)'); // Change fill color on selection with transparency
                }
            }
        };


        drawStructures(); // Call to draw structures
    }, [selectedBox]); // Re-draw when selectedBox changes

    return <div style={{
        display: 'flex',
        justifyContent: 'center', // Center the container horizontally
        alignItems: 'center', // Center the container vertically
        overflowX: 'auto', // Allow horizontal scrolling
        height: '100vh', // Full height of the viewport
        width: '100%', // Full width of the parent container
        border: '1px solid #ccc', // Optional: Add a border for visibility
    }}>
        <svg ref={svgRef} width="2000" height="600" /> {/* Set a fixed width to allow scrolling */}
    </div>
};

export default CircuitDiagramD3;
