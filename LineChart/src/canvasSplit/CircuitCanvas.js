// CircuitCanvas.js
import React, { useRef, useEffect } from 'react';
import { CircuitDrawer } from './CircuitDrawer ';

const CircuitCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const cc = new CircuitDrawer(ctx);


        cc.start(100, 300);
        cc.wire();
        cc.power(50, 2, "E");
        cc.resistor(50, 4, 1, "R");
        cc.switch(50, false)
        cc.capacitor(50, "C");
        cc.trimmer(50, "T");
        cc.wire();
        cc.turnClockwise();
        cc.trimmer(50, "T");
        cc.inductor(50, 4, "Inductor");
        cc.wire();
        cc.turnClockwise();
        cc.capacitor(50, "CC");
        cc.inductor(50, 5, "Ind");
        cc.resistor(50, 4, 2, "R");
        cc.switch();
        cc.save();
        cc.turnCounterClockwise();
        cc.wire(20);
        cc.turnClockwise();
        cc.resistor(50, 6, 1, "R6");
        cc.turnClockwise();
        cc.wire(20);
        cc.restore();
        cc.turnClockwise();
        cc.wire(20);
        cc.turnCounterClockwise();
        cc.resistor(50, 5, 1, "R5");
        cc.turnCounterClockwise();
        cc.wire(20);
        cc.turnClockwise();
        cc.wire();
        cc.resistor(50, 4, 1, "R");
        cc.turnClockwise();
        cc.wire();
        cc.power(50, 1, "E2");
        cc.finish();

        cc.start(100, 250);
        cc.wire();
        cc.capacitor();
        cc.turnClockwise();
        cc.wire(20);
        cc.turnCounterClockwise();
        cc.capacitor();
        cc.turnCounterClockwise();
        cc.wire(20);
        cc.save();
        cc.wire(20);
        cc.turnCounterClockwise();
        cc.capacitor();
        cc.turnCounterClockwise();
        cc.wire(20);
        cc.restore();
        cc.turnClockwise();
        cc.wire();
        cc.turnCounterClockwise();
        cc.wire(20);
        cc.switch();
        cc.wire(20);
        cc.turnCounterClockwise();
        cc.resistor();
        cc.wire();
        cc.trimmer();
        cc.inductor();
        cc.turnCounterClockwise();
        cc.power();
        cc.finish();
    }, []);

    return <canvas ref={canvasRef} width={800} height={600} />;
};

export default CircuitCanvas;
