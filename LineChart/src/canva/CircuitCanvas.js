import React, { useRef, useEffect } from 'react';

const CircuitCanvas = ({ width = 500, height = 500 }) => {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = 2;
        ctxRef.current = ctx;

        const cc = {
            d: 0,
            ix: 50,
            iy: 50,
            cx: 50,
            cy: 50,
            dx: 1,
            dy: 0,
            px: 0,
            py: 0,
            pd: 0,
            pdx: 0,
            pdy: 0,
            ctx: ctx,

            start(ix = 10, iy = 10) {
                this.d = 0;
                this.ix = ix;
                this.iy = iy;
                this.cx = ix;
                this.cy = iy;
                this.dx = 1;
                this.dy = 0;
                this.px = 0;
                this.py = 0;
                this.pd = 0;
                this.pdx = 0;
                this.pdy = 0;
                this.ctx.beginPath();
                this.ctx.moveTo(this.cx, this.cy);
            },

            finish(close = true) {
                if (close) {
                    this.ctx.lineTo(this.ix, this.iy);
                }
                this.ctx.stroke();
            },

            save() {
                this.px = this.cx;
                this.py = this.cy;
                this.pd = this.d;
                this.pdx = this.dx;
                this.pdy = this.dy;
            },

            restore() {
                this.cx = this.px;
                this.cy = this.py;
                this.d = this.pd;
                this.dx = this.pdx;
                this.dy = this.pdy;
                this.ctx.moveTo(this.cx, this.cy);
            },

            newelement(len = 50) {
                this.ctx.save();
                this.ctx.translate(this.cx, this.cy);
                this.ctx.rotate(this.d * Math.PI / 2);
                if (this.dx < -0.5) {
                    this.ctx.rotate(Math.PI);
                    this.ctx.translate(-len, 0);
                }
                this.ctx.moveTo(0, 0);
            },

            endelement(len = 50) {
                this.ctx.restore();
                this.cx += this.dx * len;
                this.cy += this.dy * len;
                this.ctx.moveTo(this.cx, this.cy);
            },

            wire(len = 50) {
                this.newelement(len);
                this.ctx.lineTo(len, 0);
                this.endelement(len);
            },

            drawWire(len = 50) {
                this.cx += this.dx * len;
                this.cy += this.dy * len;
                this.ctx.lineTo(this.cx, this.cy);
            },

            power(len = 50, n = 2, label = "") {
                var space = 5;
                var wl = (len - (2 * n - 1) * space) / 2;
                this.newelement(len);
                this.ctx.lineTo(wl, 0);
                this.ctx.fillText(label, wl, 4 * space);
                while (n--) {
                    this.ctx.moveTo(wl + space * (2 * n + 1), -space);
                    this.ctx.lineTo(wl + space * (2 * n + 1), space);
                    this.ctx.moveTo(wl + space * (2 * n), -2 * space);
                    this.ctx.lineTo(wl + space * (2 * n), 2 * space);
                }
                this.ctx.moveTo(len - wl, 0);
                this.ctx.lineTo(len, 0);
                this.endelement(len);
            },

            drawPower(len = 50, n = 2, label = "") {
                var space = 5;
                var wl = (len - (2 * n - 1) * space) / 2;
                this.drawWire(wl);
                this.ctx.fillText(label, this.cx + 30 * this.dy, this.cy + 30 * this.dx);
                while (n--) {
                    this.ctx.moveTo(this.cx + 15 * this.dy, this.cy + 15 * this.dx);
                    this.ctx.lineTo(this.cx - 15 * this.dy, this.cy - 15 * this.dx);
                    this.cx += this.dx * space;
                    this.cy += this.dy * space;
                    this.ctx.moveTo(this.cx + 2 * space * this.dy, this.cy + 2 * space * this.dx);
                    this.ctx.lineTo(this.cx - 2 * space * this.dy, this.cy - 2 * space * this.dx);
                    if (n !== 0) {
                        this.cx += this.dx * space;
                        this.cy += this.dy * space;
                    }
                }
                this.ctx.moveTo(this.cx, this.cy);
                this.drawWire(wl);
            },

            capacitor(len = 50, label = "") {
                var space = 5;
                var hh = space * 1.8;
                var cl = (len - space) / 2;
                this.newelement(len);
                this.ctx.lineTo(cl, 0);
                this.ctx.fillText(label, cl, hh + 10);
                this.ctx.moveTo(cl, -hh);
                this.ctx.lineTo(cl, hh);
                this.ctx.moveTo(cl + space, -hh);
                this.ctx.lineTo(cl + space, hh);
                this.ctx.moveTo(cl + space, 0);
                this.ctx.lineTo(len, 0);
                this.endelement(len);
            },

            drawCapacitor(len = 50, label = "") {
                var space = 5;
                var cl = (len - space) / 2;
                this.drawWire(cl);
                this.ctx.fillText(label, this.cx + 20 * this.dy, this.cy + 20 * this.dx);
                this.ctx.moveTo(this.cx + 10 * this.dy, this.cy + 10 * this.dx);
                this.ctx.lineTo(this.cx - 10 * this.dy, this.cy - 10 * this.dx);
                this.cx += this.dx * space;
                this.cy += this.dy * space;
                this.ctx.moveTo(this.cx + 10 * this.dy, this.cy + 10 * this.dx);
                this.ctx.lineTo(this.cx - 10 * this.dy, this.cy - 10 * this.dx);
                this.ctx.moveTo(this.cx, this.cy);
                this.drawWire(cl);
            },

            inductor(len = 50, n = 4, label = "") {
                var xs = 1;
                var ys = 2;
                var space = 6;
                var wl = (len - (n + 1) * space) / 2;
                this.newelement(len);
                this.ctx.lineTo(wl, 0);
                this.ctx.fillText(label, wl, 25);
                this.ctx.scale(xs, ys);
                while (n--) {
                    this.ctx.moveTo(wl + space * (n + 2), 0);
                    this.ctx.arc(wl + space * (n + 1), 0, space, 0, Math.PI, 1);
                    this.ctx.moveTo(wl + space * (n), 0);
                    if (n > 0) {
                        this.ctx.arc(wl + space * (n + 1 / 2), 0, space / 2, Math.PI, 0, 1);
                    }
                }
                this.ctx.scale(1 / xs, 1 / ys);
                this.ctx.moveTo(len - wl, 0);
                this.ctx.lineTo(len, 0);
                this.endelement(len);
            },

            drawInductor(len = 50, n = 4, label = "") {
                var xs = 1 + Math.abs(this.dy);
                var ys = 1 + Math.abs(this.dx);
                var space = 6;
                var wl = (len - n * space) / 2;
                this.drawWire(len);
                this.ctx.fillText(label, this.cx + (10 + space) * this.dy, this.cy + (10 + space) * this.dx);
                this.cx += this.dx * space;
                this.cy += this.dy * space;
                this.ctx.scale(xs, ys);
                while (n--) {
                    this.ctx.moveTo(this.cx / xs + space * Math.abs(this.dx), this.cy / ys + space * this.dy);
                    this.ctx.arc(this.cx / xs, this.cy / ys, space, Math.PI / 2 * this.dy, Math.PI + Math.PI / 2 * this.dy, 1);
                    this.cx += space * this.dx;
                    this.cy += space * this.dy;
                }
                this.ctx.scale(1 / xs, 1 / ys);
                this.ctx.moveTo(this.cx, this.cy);
                this.drawWire(len - space * n);
            },
            resistor(len = 50, n = 4, w = 1, label = "") {
                var space = 6;
                var cl = (len - (n + 1) * space) / 2;
                this.newelement(len);
                this.ctx.lineTo(cl, 0);
                this.ctx.fillText(label, cl, 25);
                while (n--) {
                    this.ctx.moveTo(cl + space * (n + 1), -w);
                    this.ctx.lineTo(cl + space * (n + 1), w);
                    if (n != 0) {
                        this.ctx.moveTo(cl + space * (n + 1), -2 * w);
                        this.ctx.lineTo(cl + space * (n + 1), 2 * w);
                    }
                }
                this.ctx.moveTo(len - cl, 0);
                this.ctx.lineTo(len, 0);
                this.endelement(len);
            },

            drawResistor(len = 50, n = 4, w = 1, label = "") {
                var space = 6;
                var cl = (len - (n + 1) * space) / 2;
                this.drawWire(cl);
                this.ctx.fillText(label, this.cx + (10 + space) * this.dy, this.cy + (10 + space) * this.dx);
                this.cx += this.dx * space;
                this.cy += this.dy * space;
                while (n--) {
                    this.ctx.moveTo(this.cx + 15 * this.dy, this.cy + 15 * this.dx);
                    this.ctx.lineTo(this.cx - 15 * this.dy, this.cy - 15 * this.dx);
                    if (n != 0) {
                        this.ctx.moveTo(this.cx + 10 * this.dy, this.cy + 10 * this.dx);
                        this.ctx.lineTo(this.cx - 10 * this.dy, this.cy - 10 * this.dx);
                    }
                    this.cx += space * this.dx;
                    this.cy += space * this.dy;
                }
                this.ctx.moveTo(this.cx, this.cy);
                this.drawWire(cl);
            },
            ////
            trimmer(len = 50, label = "") {
                var space = 5;
                var cl = (len - space) / 2;
                this.newelement(len);
                this.ctx.lineTo(cl, 0);
                this.ctx.fillText(label, cl, 20);
                this.ctx.moveTo(cl - space, -space);
                this.ctx.lineTo(cl - space, space);
                this.ctx.moveTo(cl + space, -space);
                this.ctx.lineTo(cl + space, space);
                this.ctx.moveTo(cl, -2 * space);
                this.ctx.lineTo(cl, 2 * space);
                this.ctx.moveTo(len - cl, 0);
                this.ctx.lineTo(len, 0);
                this.endelement(len);
            },

            drawTrimmer(len = 50, label = "") {
                var space = 5;
                var cl = (len - space) / 2;
                this.drawWire(cl);
                this.ctx.fillText(label, this.cx + 10 * this.dy, this.cy + 10 * this.dx);
                this.ctx.moveTo(this.cx, this.cy - space);
                this.ctx.lineTo(this.cx, this.cy + space);
                this.ctx.moveTo(this.cx - space, this.cy);
                this.ctx.lineTo(this.cx + space, this.cy);
                this.cx += this.dx * cl;
                this.cy += this.dy * cl;
                this.drawWire(cl);
            },

            switch(len = 50, state = true) {
                var space = 5;
                var cl = (len - space) / 2;
                this.newelement(len);
                this.ctx.lineTo(cl, 0);
                this.ctx.fillText(state ? "ON" : "OFF", cl, 20);
                this.ctx.moveTo(cl, -space);
                this.ctx.lineTo(cl, space);
                this.ctx.moveTo(cl - space, 0);
                this.ctx.lineTo(cl + space, 0);
                this.ctx.moveTo(len - cl, 0);
                this.ctx.lineTo(len, 0);
                this.endelement(len);
            },

            drawSwitch(len = 50, state = true) {
                var space = 5;
                var cl = (len - space) / 2;
                this.drawWire(cl);
                this.ctx.fillText(state ? "ON" : "OFF", this.cx + 10 * this.dy, this.cy + 10 * this.dx);
                this.ctx.moveTo(this.cx, this.cy - space);
                this.ctx.lineTo(this.cx, this.cy + space);
                this.ctx.moveTo(this.cx - space, this.cy);
                this.ctx.lineTo(this.cx + space, this.cy);
                this.cx += this.dx * cl;
                this.cy += this.dy * cl;
                this.drawWire(cl);
            },

            turnClockwise() {
                this.d = (this.d + 1) % 4;
                this.dx = [1, 0, -1, 0][this.d];
                this.dy = [0, 1, 0, -1][this.d];
            },

            turnCounterClockwise() {
                this.d = (this.d + 3) % 4;
                this.dx = [1, 0, -1, 0][this.d];
                this.dy = [0, 1, 0, -1][this.d];
            }


        };


        cc.start(100, 300);
        cc.wire();
        cc.power(50, 2, "E");
        cc.resistor(50, 4, 1, "R");
        cc.switch(50, false)
        //cc.wire();
        //cc.turnCounterClockwise();
        cc.capacitor(50, "C");
        cc.trimmer(50, "T");
        cc.wire();
        cc.turnClockwise();
        //cc.wire();
        cc.trimmer(50, "T");
        cc.inductor(50, 4, "Inductor");
        cc.wire();
        cc.turnClockwise();
        //cc.wire();
        cc.capacitor(50, "CC");
        //cc.trimmer(50,"T2");
        cc.inductor(50, 5, "Ind");
        //cc.wire();
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
        //cc.drawSwitch(50,false, "S3");
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

    return <canvas ref={canvasRef} width={width} height={height} style={{ border: '1px solid black' }} />;
};

export default CircuitCanvas;
