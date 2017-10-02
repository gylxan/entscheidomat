class Fireworks {
	bits = 80;
	speed = 20;
	bangs = 5;
	colours = ["#03f", "#f03", "#0e0", "#93f", "#0cf", "#f93", "#f0c"];
	starChar = "*";
	bangheight = [];
	intensity = [];
	colour = [];
	Xpos = [];
	Ypos = [];
	dX = [];
	dY = [];
	stars = [];
	decay = [];
	swide = 800;
	shigh = 600;
	boddie;
	timerIds = [];
	status = Fireworks.STATES.stopped;

	/**
	 * States for the fireworks
	 * @type {{started: string, stopping: string, stopped: string}}
	 */
	static STATES = {
		started : "started",
		stopping : "stopping",
		stopped  : "stopped"
	};

	/**
	 * Create a new fireworks
	 * @param {int} [bits=80] Count of bits
	 * @param {int} [speed=33] Speed (smaller is faster)
	 * @param {int} [bangs=5] Count of simultaneously bangs (note that using to many can slow the script down)
	 * @param {Array} [colors] Array with colors for the fireworks
	 * @param {string} [starChar=*] The character to use for explosion (Text can also be used)
	 */
	constructor(bits, speed, bangs, colors, starChar) {
		let self = this;
		window.addEventListener('resize', function(){
			self.setWidth();
		}, true);

		this.bits = bits || this.bits;
		this.speed = speed || this.speed;
		this.bangs = bangs || this.bangs;
		this.colours = colors || this.colours;
		this.starChar = starChar || this.starChar;
	}

	/**
	 * Start the fireworks
	 */
	start() {
		let self= this;
		this.status = Fireworks.STATES.started;
		this.boddie = document.createElement("div");
		this.boddie.style.position = "fixed";
		this.boddie.style.top = "0px";
		this.boddie.style.left = "0px";
		this.boddie.style.overflow = "visible";
		this.boddie.style.width = "1px";
		this.boddie.style.height = "1px";
		this.boddie.style.backgroundColor = "transparent";
		document.body.appendChild(this.boddie);
		this.setWidth();
		for (let counter = 0; counter < this.bangs; counter++) {
			// Check the firework has been canceled
			if(this.status !== Fireworks.STATES.started) {
				return;
			}
			this.writeFire(counter);
			this.launch(counter);
			this.timerIds.push(setInterval(function () {
				self.stepthrough(counter);
			}, self.speed));
		}
	}

	/**
	 * Stop the fireworks
	 */
	stop() {
		// Set state to stopping
		this.status = Fireworks.STATES.stopping;

		// Clear all intervals
		for(let timerId in this.timerIds) {
			clearInterval(timerId);
		}
		// When the body was created,remove it
		if(this.boddie) {
			try {
				document.body.removeChild(this.boddie);
			} catch(e)
			{
				// Catch not found error
			}
		}
		// Set state to stopped
		this.status = Fireworks.STATES.stopped;
	}

	writeFire(N) {
		this.stars[N + 'r'] = Fireworks.createStarDiv('|', 12);
		this.boddie.appendChild(this.stars[N + 'r']);
		for (let i = this.bits * N; i < this.bits + this.bits * N; i++) {
			// Check the firework has been canceled
			if(this.status !== Fireworks.STATES.started) {
				return;
			}
			this.stars[i] = Fireworks.createStarDiv(this.starChar, 13);
			this.boddie.appendChild(this.stars[i]);
		}
	}

	static createStarDiv(char, size) {
		let div = document.createElement("div");
		div.style.font = size + "px monospace";
		div.style.position = "absolute";
		div.style.visibility = "hidden";
		div.style.backgroundColor = "transparent";
		div.style.zIndex = "-1";
		div.appendChild(document.createTextNode(char));
		return (div);
	}

	launch(N) {
		this.colour[N] = Math.floor(Math.random() * this.colours.length);
		this.Xpos[N + "r"] = this.swide * 0.5;
		this.Ypos[N + "r"] = this.shigh - 5;
		this.bangheight[N] = Math.round((0.5 + Math.random()) * this.shigh * 0.4);
		this.dX[N + "r"] = (Math.random() - 0.5) * this.swide / this.bangheight[N];
		if (this.dX[N + "r"] > 1.25) {
			this.stars[N + "r"].firstChild.nodeValue = "/";
		}
		else if (this.dX[N + "r"] < -1.25) {
			this.stars[N + "r"].firstChild.nodeValue = "\\";
		}
		else {
			this.stars[N + "r"].firstChild.nodeValue = "|";
		}
		this.stars[N + "r"].style.color = this.colours[this.colour[N]];
	}

	bang(N) {
		let i, Z, A = 0, self = this;
		for (i = this.bits * N; i < this.bits + this.bits * N; i++) {
			Z = this.stars[i].style;
			Z.left = this.Xpos[i] + "px";
			Z.top = this.Ypos[i] + "px";
			if (this.decay[i]) {
				this.decay[i]--;
			}
			else {
				A++;
			}
			if (this.decay[i] === 15) {
				Z.fontSize = "7px";
			}
			else if (this.decay[i] === 7) {
				Z.fontSize = "2px";
			}
			else if (this.decay[i] === 1) {
				Z.visibility = "hidden";
			}
			this.Xpos[i] += this.dX[i];
			this.Ypos[i] += (this.dY[i] += 1.25 / this.intensity[N]);
		}
		if (A !== this.bits) {
			setTimeout(function () {
				self.bang(N);
			}, self.speed);
		}
	}

	stepthrough(N) {
		let i, M, Z;
		let oldx = this.Xpos[N + "r"];
		let oldy = this.Ypos[N + "r"];
		this.Xpos[N + "r"] += this.dX[N + "r"];
		this.Ypos[N + "r"] -= 4;
		if (this.Ypos[N + "r"] < this.bangheight[N]) {
			M = Math.floor(Math.random() * 3 * this.colours.length);
			this.intensity[N] = 5 + Math.random() * 4;
			for (i = N * this.bits; i < this.bits + this.bits * N; i++) {
				// Check the firework has been canceled
				if(this.status !== Fireworks.STATES.started) {
					return;
				}
				this.Xpos[i] = this.Xpos[N + "r"];
				this.Ypos[i] = this.Ypos[N + "r"];
				this.dY[i] = (Math.random() - 0.5) * this.intensity[N];
				this.dX[i] = (Math.random() - 0.5) * (this.intensity[N] - Math.abs(this.dY[i])) * 1.25;
				this.decay[i] = 16 + Math.floor(Math.random() * 16);
				Z = this.stars[i];
				if (M < this.colours.length) {
					Z.style.color = this.colours[i % 2 ? this.colour[N] : M];
				}
				else if (M < 2 * this.colours.length) {
					Z.style.color = this.colours[this.colour[N]];
				}
				else {
					Z.style.color = this.colours[i % this.colours.length];
				}
				Z.style.fontSize = "13px";
				Z.style.visibility = "visible";
			}
			this.bang(N);
			this.launch(N);
		}
		this.stars[N + "r"].style.visibility = "visible";
		this.stars[N + "r"].style.left = oldx + "px";
		this.stars[N + "r"].style.top = oldy + "px";
	}

	setWidth() {
		let sw_min = 999999;
		let sh_min = 999999;
		if (document.documentElement && document.documentElement.clientWidth) {
			if (document.documentElement.clientWidth > 0) sw_min = document.documentElement.clientWidth;
			if (document.documentElement.clientHeight > 0) sh_min = document.documentElement.clientHeight;
		}
		if (typeof(window.innerWidth) !== "undefined" && window.innerWidth) {
			if (window.innerWidth > 0 && window.innerWidth < sw_min) sw_min = window.innerWidth;
			if (window.innerHeight > 0 && window.innerHeight < sh_min) sh_min = window.innerHeight;
		}
		if (document.body.clientWidth) {
			if (document.body.clientWidth > 0 && document.body.clientWidth < sw_min) sw_min = document.body.clientWidth;
			if (document.body.clientHeight > 0 && document.body.clientHeight < sh_min) sh_min = document.body.clientHeight;
		}
		if (sw_min === 999999 || sh_min === 999999) {
			sw_min = 800;
			sh_min = 600;
		}
		this.swide = sw_min;
		this.shigh = sh_min;
	}
}


// import React from "react";
// import './Fireworks.css.css';
//
//
// class Fireworks extends React.Component {
// 	constructor(props) {
// 		super(props);
//
// 		this.stars = [];
// 	}
//
//
// 	/**
// 	 * Creates a star div with the given char and given font size
// 	 * @param {string} char Character for start
// 	 * @param {int} fontSize Font size of the star
// 	 * @returns {XML}
// 	 */
// 	createStar(char, fontSize) {
// 		return <div className="fireworks-star" style={{fontSize: fontSize}}>{char}</div>;
// 	}
//
//
// 	render() {
// 		let self = this;
// 		return <div className="fireworks">
// 			{this.props.bangs.forEach(function () {
// 				return self.createStar()
// 			})}
// 		</div>
// 	}
// }

// Fireworks.defaultProps = {
// 	// how many bits
// 	bits: 80,
// 	// how fast - smaller is faster
// 	speed: 33,
// 	// how many can be launched simultaneously (note that using too many can slow the script down)
// 	bangs: 5,
// 	// blue    red     green   purple  cyan    orange  pink
// 	colours: ["#03f", "#f03", "#0e0", "#93f", "#0cf", "#f93", "#f0c"]
// };

export default Fireworks;
