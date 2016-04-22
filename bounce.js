console.log('bounce.js loaded');

var svgNSID = "http://www.w3.org/2000/svg";

var startButton = document.getElementById('start');
var stopButton = document.getElementById('stop');
var clearButton = document.getElementById('clear');
var svg = document.getElementById('castle');
var width = svg.getAttribute('width');
var height = svg.getAttribute('height');
var max_r = 50;
var max_v = 5;
var intervalID;

var balls = new Array();

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


var make_ball = function(xi, yi, ri, colori, dxi, dyi) {
    var c = document.createElementNS(svgNSID, 'circle');
    c.setAttribute('cx', xi);
    c.setAttribute('cy', yi);
    c.setAttribute('fill', colori);
    c.setAttribute('r', ri);

    svg.appendChild(c);

    var dx = dxi, dy = dyi;

    var getx = function() {
        return parseInt(c.getAttribute('cx'), 10);
    };

    var gety = function() {
        return parseInt(c.getAttribute('cy'), 10);
    };

    var getr = function() {
        return parseInt(c.getAttribute('r'), 10);
    };

    var getdx = function() {
        return dx;
    }

    var getdy = function() {
        return dy;
    }

    var move = function() {
        // collision detection
        // border detection
        if ((getx() < getr() && dx < 0) || (getx() > width - getr() && dx > 0)) {
            dx = -1 * dx;
        }

        if ((gety() < getr() && dy < 0) || (gety() > width - getr() && dy > 0)) {
            dy = -1 * dy;
        }

        // with other balls

        for (var i = 0 ; i < balls.length ; i++) {
            var other = balls[i];
            if (getx() == other.getx() && gety() == other.gety()) {
                continue;
            }
            else {
                if (Math.pow(getx() - other.getx(), 2) + Math.pow(gety() - other.gety(), 2) <= Math.pow(getr() + other.getr(), 2)) { // dist between centers less than sum of radiuses
                    // PHYSICS
                    //dx = (2 * other.getr() / (getr() + other.getr())) * other.getdx() - (other.getr() - getr()) * dx / (other.getr() + getr());
                    //dy = (2 * other.getr() / (getr() + other.getr())) * other.getdy() - (other.getr() - getr()) * dy / (other.getr() + getr());
                    dx = -1 * dx;
                    dy = -1 * dy;
            }
            }
        }

        // actual mvt
        c.setAttribute('cx', getx() + dx);
        c.setAttribute('cy', gety() + dy);
    };

    var click_delete = function(e){
	e.preventDefault();
	svg.removeChild(this);
    };
    c.addEventListener("click",click_delete);

    return {
        getx : getx,
        gety : gety,
        getr : getr,
        move : move,
        getdx : getdx,
        getdy : getdy,
    };
}


var make_random_ball = function(xi,yi){
    var dx = Math.random() < 0.5 ? -Math.random() * max_v : Math.random() * max_v;
    var dy = Math.random() < 0.5 ? -Math.random() * max_v : Math.random() * max_v;
    balls[balls.length] = make_ball(xi,
				    yi,
				    Math.floor(Math.random() * max_r),
				    getRandomColor(),
				    Math.floor(dx),
				    Math.floor(dy));
};

var start = function(){
    var animate = function() {
        for (var i = 0 ; i < balls.length ; i++) {
            balls[i].move();
        }
    }
    intervalID = window.setInterval(animate,16);
};

var main = function() {

    for (var i = 0 ; i < 10 ; i++) {
	make_random_ball(Math.floor(Math.random() * width),
			 Math.floor(Math.random() * height));
    }

    start();
}

var stop = function(){
    window.clearInterval(intervalID);
};

var clear = function(){
    while (svg.lastChild){
	svg.removeChild(svg.lastChild);
    }
    //svg.selectAll("*").remove();
};

startButton.addEventListener('click',start);
stopButton.addEventListener('click',stop);
clearButton.addEventListener('click',clear);
main();


var click_for_ball = function(e){
    e.preventDefault();
    make_random_ball(e.offsetX,e.offsetY);
};

svg.addEventListener('click',click_for_ball);

