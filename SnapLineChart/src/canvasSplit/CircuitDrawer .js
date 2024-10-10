// Manages the drawing logic and direction changes.
export class CircuitDrawer {
  constructor(ctx) {
    this.ctx = ctx;
    this.d = 0;
    this.ix = 50;
    this.iy = 50;
    this.cx = 50;
    this.cy = 50;
    this.dx = 1;
    this.dy = 0;
    this.px = 0;
    this.py = 0;
    this.pd = 0;
    this.pdx = 0;
    this.pdy = 0;
  }
  start(ix=10, iy=10) {
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
  }
  
  finish(close=true) {
    if (close) {
      this.ctx.lineTo(this.ix, this.iy);
    }
    this.ctx.stroke();
  }
  
  save() {
    this.px = this.cx;
    this.py = this.cy;
    this.pd = this.d;
    this.pdx = this.dx;
    this.pdy = this.dy;
  }
  
  restore() {
    this.cx = this.px;
    this.cy = this.py;
    this.d = this.pd;
    this.dx = this.pdx;
    this.dy = this.pdy;
    this.ctx.moveTo(this.cx, this.cy);
  }
  
  newelement(len=50) {
    this.ctx.save();
    this.ctx.translate(this.cx, this.cy);
    this.ctx.rotate(this.d*Math.PI/2);
    if (this.dx < -0.5 ) {
      this.ctx.rotate(Math.PI);
      this.ctx.translate(-len, 0);
    }
    this.ctx.moveTo(0,0);
  }
  
  endelement(len=50) {
    this.ctx.restore();
    this.cx += this.dx * len;
    this.cy += this.dy * len;
    this.ctx.moveTo(this.cx,this.cy);
  }
  
  wire(len=50) {
    this.newelement(len);
 		this.ctx.lineTo(len,0);
    this.endelement(len);
  }
  
  drawWire(len=50) {
    this.cx += this.dx * len;
    this.cy += this.dy * len;
    this.ctx.lineTo(this.cx, this.cy);
  }
  
  power(len=50, n=2, label="") {
    var space = 5;
    var wl = (len - (2*n-1)*space)/2;
    this.newelement(len);
    this.ctx.lineTo(wl,0);
    this.ctx.fillText(label, wl, 4*space);
    while (n--) {
        this.ctx.moveTo(wl+space*(2*n+1), -space);
        this.ctx.lineTo(wl+space*(2*n+1), space);
        this.ctx.moveTo(wl+space*(2*n), -2*space);
        this.ctx.lineTo(wl+space*(2*n), 2*space);
    }
    this.ctx.moveTo(len-wl, 0);
    this.ctx.lineTo(len,0);
    this.endelement(len);
  }

  drawPower(len=50, n=2, label="") {
    var space = 5;
    var wl = (len - (2*n-1)*space)/2;
    this.drawWire(wl);
    this.ctx.fillText(label, this.cx + 30 * this.dy, this.cy + 30 * this.dx);
    while (n--) {
        this.ctx.moveTo(this.cx + 15 * this.dy, this.cy + 15 * this.dx);
        this.ctx.lineTo(this.cx - 15 * this.dy, this.cy - 15 * this.dx);
        this.cx += this.dx * space;
        this.cy += this.dy * space;
        this.ctx.moveTo(this.cx + 2*space * this.dy, this.cy + 2*space * this.dx);
        this.ctx.lineTo(this.cx - 2*space * this.dy, this.cy - 2*space * this.dx);
        if (n != 0) {
            this.cx += this.dx * space;
            this.cy += this.dy * space;
        }
    }
    this.ctx.moveTo(this.cx, this.cy);
    this.drawWire(wl);
  }

	capacitor(len=50, label="") {
    var space=5;
    var hh = space*1.8;
    var cl = (len-space)/2;
    this.newelement(len);
    this.ctx.lineTo(cl,0);
    this.ctx.fillText(label, cl, hh+10)
    this.ctx.moveTo(cl, -hh);
    this.ctx.lineTo(cl, hh);
    this.ctx.moveTo(cl+space, -hh);
    this.ctx.lineTo(cl+space, hh);
    this.ctx.moveTo(cl+space, 0);
    this.ctx.lineTo(len,0);
    this.endelement(len);
  }
  
  drawCapacitor(len=50, label="") {
    var space=5;
    var cl = (len-space)/2;
    this.drawWire(cl);
    this.ctx.fillText(label, this.cx + 20 * this.dy, this.cy + 20 * this.dx )
    this.ctx.moveTo(this.cx + 10 * this.dy, this.cy + 10 * this.dx);
    this.ctx.lineTo(this.cx - 10 * this.dy, this.cy - 10 * this.dx);
    this.cx += this.dx * space;
    this.cy += this.dy * space;
    this.ctx.moveTo(this.cx + 10 * this.dy, this.cy + 10 * this.dx);
    this.ctx.lineTo(this.cx - 10 * this.dy, this.cy - 10 * this.dx);
    this.ctx.moveTo(this.cx, this.cy);
    this.drawWire(cl);
  }

  inductor(len=50, n=4, label="") {
    var xs, ys;
    xs = 1;
    ys = 2;
    var space = 6;
    var wl = (len-(n+1)*space)/2;
    this.newelement(len);
    this.ctx.lineTo(wl, 0);
    this.ctx.fillText(label, wl, 25);
    this.ctx.scale(xs, ys);
    while (n--) {
        this.ctx.moveTo(wl+space*(n+2), 0);
        this.ctx.arc(wl+space*(n+1), 0, space, 0, Math.PI, 1);
        this.ctx.moveTo(wl+space*(n), 0);
        if (n>0) {
          this.ctx.arc(wl+space*(n+1/2), 0, space/2, Math.PI,0, 1);
        }
    }
    this.ctx.scale(1/xs, 1/ys);
    this.ctx.moveTo(len-wl,0);
    this.ctx.lineTo(len,0);
    this.endelement(len);
}

  drawInductor(len=50, n=4, label="") {
    var xs, ys;
    xs = 1 + Math.abs(this.dy);
    ys = 1 + Math.abs(this.dx);
    var space = 6;
    var wl = (len-n*space)/2;
    this.drawWire(len);
    this.ctx.fillText(label, this.cx+(10+space)*this.dy, this.cy+(10+space)*this.dx)
    this.cx += this.dx * space;
    this.cy += this.dy * space;
    this.ctx.scale(xs, ys);
    while (n--) {
        //ctx.moveTo(x/xs+5*Math.abs(dx),y/ys+5*dy);
        this.ctx.moveTo(this.cx / xs + space * Math.abs(this.dx), this.cy / ys + space * this.dy);
        this.ctx.arc(this.cx / xs, this.cy / ys, space, Math.PI / 2 * this.dy, Math.PI + Math.PI / 2 * this.dy, 1);
        this.cx += space * this.dx;
        this.cy += space * this.dy;
        if (n != 0) {
            if (this.dx >= 0) {
                this.ctx.moveTo(this.cx / xs - space * this.dx, this.cy / ys - space * this.dy);
            }

            this.ctx.moveTo(this.cx / xs - space * this.dx, this.cy / ys - space * this.dy);
            this.ctx.arc(this.cx / xs - space / 2 * this.dx, this.cy / ys - space / 2 * this.dy, 1.5, Math.PI + Math.PI / 2 * this.dy, Math.PI / 2 * this.dy, 1);
        }
    }
    this.ctx.moveTo(this.cx / xs - 1.75 * this.dx, this.cy / ys - 1.75 * this.dy);
    this.ctx.scale(1 / xs, 1 / ys);
    this.ctx.lineTo(this.cx, this.cy);
    this.drawWire(len);
}

  trimmer(len=50, label="") {
    //capacitor
    var space=5;
    var hh = space * 1.8;
    var cl = (len-space)/2;
    var size=1.4*hh;
    var psize = size*Math.cos(Math.PI/4);
		this.newelement(len);
		//draw capacitor
    this.ctx.moveTo(0,0);
    this.ctx.lineTo(cl,0);
    this.ctx.fillText(label, cl, hh+10)
    this.ctx.moveTo(cl, -hh);
    this.ctx.lineTo(cl, hh);
    this.ctx.moveTo(cl+space, -hh);
    this.ctx.lineTo(cl+space, hh);
    this.ctx.moveTo(cl+space, 0);
    this.ctx.lineTo(len,0);

    var x = len/2-psize;
    var y = 0+psize;
    this.ctx.moveTo(x,y);
    var x1 = len/2+psize;
    var y1 = 0-psize;
    this.ctx.lineTo(x1,y1);
    //short line
    psize /= 3;
    x = x1-psize;
    y = y1-psize;
    this.ctx.moveTo(x,y);
    x = x1+psize;
    y = y1+psize;
    this.ctx.lineTo(x,y);
    this.endelement(len);
}

  drawTrimmer(len=50, label="") {
    var size=12;
    var psize = size*Math.cos(Math.PI/4);
    var x = this.cx+len/2*this.dx;
    var y = this.cy+len/2*this.dy;
    var x1 = x-psize*Math.abs(this.dx-this.dy);
    var y1 = y+psize*Math.abs(this.dy-this.dx);
    this.ctx.moveTo(x1,y1);
    x1 = x+psize*Math.abs(this.dx-this.dy);
    y1 = y-psize*Math.abs(this.dy-this.dx);
    this.ctx.lineTo(x1,y1);
    //short line
    psize /= 3;
    x = x1-psize*Math.abs(this.dx-this.dy);
    y = y1-psize*Math.abs(this.dy-this.dx);
    this.ctx.moveTo(x,y);
    x = x1+psize*Math.abs(this.dx-this.dy);
    y = y1+psize*Math.abs(this.dy-this.dx);
    this.ctx.lineTo(x,y);
    this.ctx.moveTo(this.cx, this.cy);
    this.drawCapacitor(len, label);
}

  resistor(len=50, n=5, style=1, label="") {
    var size = 5;
    var wl = (len-(n+1)*size)/2;
    this.newelement(len);
    this.ctx.lineTo(wl,0);
    this.ctx.fillText(label, wl, size+15);
		if (style == 1) {
      var x = wl+size;
      var y = -size;
      while (n--) {
        this.ctx.lineTo(x,y);
        this.ctx.lineTo(x,y+2*size);
        x += size;
      }
      this.ctx.lineTo(len-wl, 0);
    } else {
      this.ctx.rect(wl,-size, size*(n+1), 2*size);
    }
    this.ctx.moveTo(len-wl, 0);
    this.ctx.lineTo(len,0);
		this.endelement(len);
    
  }

  drawResistor(len=50, n=5, style=1, label="") {
    var size = 5;
    var wl = (len-(n+1)*size)/2;
    this.drawWire(wl);
    this.ctx.fillText(label, this.cx+this.dy*(size+15), this.cy+this.dx*(size+15));
    if (style == 1) {
      this.cx += this.dx * size;
      this.cy += this.dy * size;
      while (n--) {
        this.ctx.lineTo(this.cx - size * this.dy, this.cy - size * this.dx);
        this.ctx.lineTo(this.cx + size * this.dy, this.cy + size * this.dx);
        this.cx += size * this.dx;
        this.cy += size * this.dy;
      }
      this.ctx.lineTo(this.cx, this.cy);
    } else {
      this.ctx.rect(this.cx-size*this.dy, this.cy-size*this.dx, size*(n+1)*this.dx+2*size*this.dy, size*(n+1)*this.dy+2*size*this.dx);
      this.cx += this.dx * size*(n+1);
    	this.cy += this.dy * size*(n+1) ;
    	this.ctx.moveTo(this.cx, this.cy);
    }
    this.drawWire(wl);
    
  }
  
  drawSwitch(len=50, open=true, label="S") {
    var size=len/2;
    var wl = (len-size)/2;
    this.drawWire(wl);
    var x = this.cx;
    var y = this.cy;
    this.ctx.fillText(label, x - 15*this.dy, y+15*this.dx);
    //this.ctx.arc(x,y,2, 0, Math.PI*2);
    x += size*this.dx;
    y += size*this.dy;
    if (open) {
      this.ctx.lineTo(x-size/2*this.dy, y-size/2*this.dx);
    } else {
      this.ctx.lineTo(x, y);
    }
    this.ctx.arc(this.cx, this.cy, 2, 0, Math.PI*2);
    this.ctx.moveTo(x, y);
    this.ctx.arc(x,y, 2,0, Math.PI*2);
    this.ctx.moveTo(x, y);
        this.cx = x;
    this.cy = y;
    this.drawWire(wl);
  }
  
  switch(len=50, open=true, label="S") {
    var size=len/2;
    var circle = 2;
    var wl = (len-size)/2;
    this.newelement(len);
    this.ctx.lineTo(wl,0);
    this.ctx.moveTo(wl+circle,0);
    this.ctx.fillText(label, wl+circle, circle+15);
    this.ctx.arc(wl+circle,0, circle, 0, Math.PI*2);
    this.ctx.moveTo(wl+size-circle, 0);
    this.ctx.arc(wl+size-circle,0,circle, 0, Math.PI*2);
    this.ctx.moveTo(wl+circle,-circle);
    if (open) {
       this.ctx.lineTo(wl+size, -circle-size/2);
    } else {
       this.ctx.lineTo(wl+size, -circle);
    }
    this.ctx.moveTo(len-wl,0);
    this.ctx.lineTo(len,0);
    this.endelement(len);
  }
  
  

  turnClockwise() {
    this.d++;
    this.dx = Math.cos(Math.PI/2 * this.d);
    this.dy = Math.sin(Math.PI/2 * this.d);
	}

	turnCounterClockwise() {
    this.d--;
    this.dx = Math.cos(Math.PI/2 * this.d);
    this.dy = Math.sin(Math.PI/2 * this.d);
	}
}
