import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import ground from './ground.svg';
import openSwitch from './openSwitch.svg';
import curve from './curve.svg';
import camera from './camera.svg';

// JSON input for the circuit diagram
const circuitData = {
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
};

const CircuitDiagramD3 = () => {
    const svgRef = useRef(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current);

        // Clear the SVG before drawing to avoid duplicate elements
        svg.selectAll("*").remove();

        const drawDiagram = (offsetX) => {
            const drawElement = (element) => {
                if (!element.visible) return;

                const adjustedElement = {
                    ...element,
                    x: element.x + offsetX // Adjust the x position based on the offset
                };

                switch (element.type) {
                    case "busbar":
                        drawBusbar(adjustedElement);
                        break;
                    case "camera":
                        drawImage(camera, adjustedElement);
                        break;
                    case "openSwitch":
                        drawImage(openSwitch, adjustedElement);
                        break;
                    case "ground":
                        drawImage(ground, adjustedElement);
                        break;
                    case "text":
                        drawText(adjustedElement);
                        break;
                    case "curve":
                        drawCurve(adjustedElement);
                        break;
                    case "halfcurve":
                        drawHalfCurve(adjustedElement);
                        break;
                    default:
                        break;
                }
            };

            const drawBusbar = ({ orientation, x, y, length }) => {
                svg.append("line")
                    .attr("x1", x)
                    .attr("y1", y)
                    .attr("x2", orientation === "horizontal" ? x + length : x)
                    .attr("y2", orientation === "horizontal" ? y : y + length)
                    .attr("stroke", "#000")
                    .attr("stroke-width", 1.5);
            };

            const drawImage = (imgSrc, { x, y, length, orientation }) => {
                const image = svg.append("image")
                    .attr("xlink:href", imgSrc)
                    .attr("x", x)
                    .attr("y", y)
                    .attr("width", length)
                    .attr("height", length);

                applyRotation(image, x, y, length, orientation);

                if (imgSrc === camera) {
                    image.on("click", () => alert('Camera clicked!'));
                }
            };

            const drawCurve = ({ x, y, length }) => {
                svg.append("image")
                    .attr("xlink:href", curve)
                    .attr("x", x)
                    .attr("y", y)
                    .attr("width", length)
                    .attr("height", length);
            };

            const drawHalfCurve = ({ x, y, length }) => {
                svg.append("path")
                    .attr("d", `M${x},${y} Q${x + length / 2},${y - length} ${x + length},${y}`)
                    .attr("stroke", "#000")
                    .attr("stroke-width", 2)
                    .attr("fill", "none");
            };

            const drawText = ({ x, y, content }) => {
                const textElement = svg.append("text")
                    .attr("x", x)
                    .attr("y", y)
                    .text(content)
                    .attr("font-size", "14px")
                    .attr("fill", "#000");

                const bbox = textElement.node().getBBox();
                svg.append("rect")
                    .attr("x", bbox.x - 2)
                    .attr("y", bbox.y - 2)
                    .attr("width", bbox.width + 4)
                    .attr("height", bbox.height + 4)
                    .attr("fill", "none")
                    .attr("stroke", "#000")
                    .attr("stroke-width", 1);
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
                    element.attr("transform", rotations[orientation]);
                }
            };

            const DottedBox = ({ x, y, width, height }) => {
                svg.append("rect")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("width", width)
                    .attr("height", height)
                    .attr("fill", "none")
                    .attr("stroke", "green")
                    .attr("stroke-width", 1)
                    .attr("stroke-dasharray", "5,5");
            };

            // Draw elements from JSON input
            circuitData.elements.forEach(drawElement);
            DottedBox({ x: 150 + offsetX, y: 80, width: 200, height: 290 });
        };

        // Draw multiple diagrams side by side
        const numDiagrams = 1; // Number of diagrams to draw horizontally
        const spacing = 150; // Horizontal spacing between diagrams

        for (let i = 0; i < numDiagrams; i++) {
            drawDiagram(i * spacing);
        }

    }, []);

    return (
        <svg ref={svgRef} width="100%" height="600" style={{ border: "1px solid black" }} />
    );
};

export default CircuitDiagramD3;
