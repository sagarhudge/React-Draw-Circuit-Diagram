import React, { useEffect, useRef } from 'react';
import Snap from 'snapsvg-cjs';
import ground from './ground.svg';
import openSwitch from './openSwitch.svg';
import curve from './curve.svg';
import camera from './camera.svg';

// JSON input for the circuit diagram
const circuitData = {
    elements: [
        { type: "busbar", orientation: "horizontal", x: 50, y: 100, length: 250 },
        { type: "camera", x: 175, y: 75, length: 50 },
        { type: "openSwitch", x: 275, y: 96, orientation: "right", length: 50 },
        { type: "ground", x: 240, y: 100, orientation: "left", length: 50 },
        { type: "busbar", orientation: "vertical", x: 300, y: 143, length: 50 },
        { type: "text", x: 283, y: 210, content: "1200" },
        { type: "busbar", orientation: "vertical", x: 300, y: 215, length: 200 },
        { type: "busbar", orientation: "horizontal", x: 300, y: 265, length: -150 },
        { type: "busbar", orientation: "vertical", x: 150, y: 334, length: -70 },
        { type: "curve", orientation: "", x: 150, y: 334, length: 150 },
    ]
};

const CircuitDiagramSnap = () => {
    const svgRef = useRef(null);

    useEffect(() => {
        const s = Snap(svgRef.current);

        const drawElement = (element) => {
            switch (element.type) {
                case "busbar":
                    drawBusbar(element);
                    break;
                case "camera":
                    drawCamera(element);
                    break;
                case "openSwitch":
                    drawOpenSwitch(element);
                    break;
                case "ground":
                    drawGround(element);
                    break;
                case "text":
                    drawText(element);
                    break;
                case "curve":
                    drawCurve(element);
                    break;
                default:
                    break;
            }
        };

        const drawBusbar = ({ orientation, x, y, length }) => {
            if (orientation === "horizontal") {
                s.line(x, y, x + length, y).attr({ stroke: "#000", strokeWidth: 2 });
            } else if (orientation === "vertical") {
                s.line(x, y, x, y + length).attr({ stroke: "#000", strokeWidth: 2 });
            }
        };

        const drawCamera = ({ x, y, length }) => {
            const cam = s.image(camera, x, y, length, length);
            cam.click(() => alert('Camera clicked!'));
        };

        const drawGround = ({ x, y, orientation, length }) => {
            const groundImage = s.image(ground, x, y, length, length);
            applyRotation(groundImage, x, y, length, orientation);
        };

        const drawOpenSwitch = ({ x, y, orientation, length }) => {
            const switchImage = s.image(openSwitch, x, y, length, length);
            applyRotation(switchImage, x, y, length, orientation);
        };

        const drawCurve = ({ x, y, orientation, length }) => {
            const curveImage = s.image(curve, x, y, length, length);
            applyRotation(curveImage, x, y, length, orientation);
        };

        const drawText = ({ x, y, content }) => {
            const textElement = s.text(x, y, content).attr({ fontSize: "14px", fill: "#000" });
            const bbox = textElement.getBBox();
            const border = s.rect(bbox.x - 2, bbox.y - 2, bbox.width + 4, bbox.height + 4)
                .attr({ fill: "none", stroke: "#000", strokeWidth: 1 });

            s.group(border, textElement);
        };

        const applyRotation = (element, x, y, length, orientation) => {
            const centerX = x + length / 2;
            const centerY = y + length / 2;

            switch (orientation) {
                case "left":
                    element.transform(`rotate(90, ${centerX}, ${centerY})`);
                    break;
                case "right":
                    element.transform(`rotate(-90, ${centerX}, ${centerY})`);
                    break;
                case "down":
                    element.transform(`rotate(180, ${centerX}, ${centerY})`);
                    break;
                default:
                    break; // Default is pointing up (no rotation)
            }
        };

        // Clear the SVG before drawing to avoid duplicate elements
        s.clear();

        // Loop through elements in the JSON and draw them
        circuitData.elements.forEach(drawElement);

    }, []);

    return (
        <svg ref={svgRef} width="800" height="600" style={{ border: "1px solid black" }} />
    );
};

export default CircuitDiagramSnap;
