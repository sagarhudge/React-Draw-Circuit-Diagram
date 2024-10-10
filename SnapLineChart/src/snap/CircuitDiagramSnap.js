import React, { useEffect, useRef } from 'react';
import Snap from 'snapsvg-cjs';
import ground from './ground.svg'
import openSwitch from './openSwitch.svg'
import camera from './camera.svg'

// JSON input for the circuit diagram
const circuitData = {
    elements: [
        { type: "busbar", orientation: "horizontal", x: 50, y: 100, length: 250 },
        { type: "camera", x: 175, y: 75,length: 50  },
        { type: "openSwitch", x: 275, y: 96, orientation: "right", length: 50 },
        { type: "ground", x: 240, y: 100, orientation: "left", length: 50 },

        { type: "busbar", orientation: "vertical", x: 300, y: 143, length: 50 },
        { type: "text", x: 283, y: 210, content: "1200" },
        { type: "busbar", orientation: "vertical", x: 300, y: 215, length: 200 },
        { type: "busbar", orientation: "horizontal", x: 300, y: 265, length: -150 },
        { type: "busbar", orientation: "vertical", x:150, y: 334, length: -70 },

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
                    openSwitches(element);
                    break;
                case "ground":
                    drawGround(element);
                    break;
                case "text":
                    drawText(element);
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

        const drawCamera = ({ x, y,length }) => {
         

            Snap.load("./camera.svg", (fragment) => {

                const cam = s.image(camera, x, y,length,length);
                cam.click(() => {
                    {
                        // onClick(content); // Call the onClick function with content or any relevant info
                        alert('Camera')
                    }
                });
               
            });


            // const camera = s.circle(x, y, 10).attr({ fill: "#000" });
            // camera.click(() => {
            //     {
            //         // onClick(content); // Call the onClick function with content or any relevant info
            //         alert('Camera')
            //     }
            // });

        };



        const drawGround = ({ x, y, orientation, length }) => {
            Snap.load("./ground.svg", (fragment) => {

                const groundImage = s.image(ground, x, y, length, length);

                // Apply rotation based on orientation
                switch (orientation) {
                    case "left":
                        groundImage.transform(`rotate(90, ${x + length / 2}, ${y + length / 2})`);
                        break;
                    case "right":
                        groundImage.transform(`rotate(-90, ${x + length / 2}, ${y + length / 2})`);
                        break;
                    case "down":
                        groundImage.transform(`rotate(180, ${x + length / 2}, ${y + length / 2})`);
                        break;
                    default:
                        break; // Default is pointing up
                }
            });
        };
        const openSwitches = ({ x, y, orientation, length }) => {
            Snap.load("./openSwitches.svg", (fragment) => {

                const groundImage = s.image(openSwitch, x, y, length, length);

                // Apply rotation based on orientation
                switch (orientation) {
                    case "left":
                        groundImage.transform(`rotate(90, ${x + length / 2}, ${y + length / 2})`);
                        break;
                    case "right":
                        groundImage.transform(`rotate(-90, ${x + length / 2}, ${y + length / 2})`);
                        break;
                    case "down":
                        groundImage.transform(`rotate(180, ${x + length / 2}, ${y + length / 2})`);
                        break;
                    default:
                        break; // Default is pointing up
                }
            });
        };

        const drawText = ({ x, y, content }) => {
            // Calculate the width of the text to create a border around it
            const textElement = s.text(x, y, content).attr({ fontSize: "14px", fill: "#000" });
            const bbox = textElement.getBBox(); // Get the bounding box of the text

            // Create a rectangle as the border
            const border = s.rect(bbox.x - 2, bbox.y - 2, bbox.width + 4, bbox.height + 4)
                .attr({ fill: "none", stroke: "#000", strokeWidth: 1 });

            // Group the border and the text together
            const group = s.group(border, textElement);
            return group;
        };

        // Loop through elements in the JSON and draw them
        circuitData.elements.forEach(drawElement);

    }, []);

    return (
        <svg ref={svgRef} width="800" height="600" style={{ border: "1px solid black" }} />
    );
};

export default CircuitDiagramSnap;
