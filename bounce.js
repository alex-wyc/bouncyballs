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
var deleting = false;

var balls = new Array();
var dxs = new Array();
var dys = new Array();

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

    var update_vel_list = function(a) {
        dxs[a] = dx;
        dys[a] = dy;
        // collision detection
        // with other balls

        for (var i = 0 ; i < balls.length ; i++) {
            var other = balls[i];
            if (i == a) {
                continue;
            }
            else {
                if (Math.pow(getx() - other.getx(), 2) + Math.pow(gety() - other.gety(), 2) <= Math.pow(getr() + other.getr(), 2)) { // dist between centers less than sum of radiuses
                    // PHYSICS
                    //var m1 = getr() * getr();
                    //var m2 = other.getr() * other.getr();
                    //dxs[a] = (dx * (m1 - m2) + 2 * m2 * other.getdx()) / (m1 + m2);
                    //dys[a] = (dy * (m1 - m2) + 2 * m2 * other.getdy()) / (m1 + m2);
                    dxs[a] = -1 * dx;
                    dys[a] = -1 * dy;
                }
            }
        }
        // border detection
        if ((getx() < getr() && dx < 0) || (getx() > width - getr() && dx > 0)) {
            dxs[a] = -1 * dx;
        }

        if ((gety() < getr() && dy < 0) || (gety() > width - getr() && dy > 0)) {
            dys[a] = -1 * dy;
        }


    }

    var update_vel = function(a) {
        dx = dxs[a];
        dy = dys[a];
    }

    var move = function() {
        var fx = getx() + dx;
        //if (fx > width) {
        //    fx = fx - width;
        //}
        //if (fx < 0) {
        //    fx = width - fx;
        //}

        var fy = gety() + dy;
        //if (fy > height) {
        //    fy = fy - height;
        //}
        //if (fy < 0) {
        //    fy = width - fy;
        //}
        c.setAttribute('cx', fx);
        c.setAttribute('cy', fy);
    };

    var click_delete = function(e){
        e.preventDefault();
        deleting = true;
        svg.removeChild(this);
        for (var i = 0 ; i < balls.length ; i++) {
            if (balls[i].getx() == getx() && balls[i].gety() == gety()) {
                balls.splice(i, 1);
                break;
            }
        }
    };
    
    c.addEventListener("click",click_delete);

    return {
        getx : getx,
        gety : gety,
        getr : getr,
        update_vel_list : update_vel_list,
        update_vel : update_vel,
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
        var totalpx = 0;
        var totalpy = 0;
        var totalke = 0;
        for (var i = 0 ; i < balls.length ; i++) {
            balls[i].update_vel_list(i);
            balls[i].update_vel(i);
            balls[i].move();
            totalpx += balls[i].getr() * balls[i].getr() * balls[i].getdx();
            totalpy += balls[i].getr() * balls[i].getr() * balls[i].getdy();
            totalke += 0.5 * balls[i].getr() * balls[i].getr() * (balls[i].getdx() * balls[i].getdx() + balls[i].getdy() * balls[i].getdy());
        }

        console.log("Total momentum: <" + totalpx + ', ' + totalpy + ">");
        console.log("Total KE: " + totalke);
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
    balls = [];
    //svg.selectAll("*").remove();
};

startButton.addEventListener('click',start);
stopButton.addEventListener('click',stop);
clearButton.addEventListener('click',clear);
main();


var click_for_ball = function(e){
    e.preventDefault();
    if (deleting)
	deleting = false;
    else
	make_random_ball(e.offsetX,e.offsetY);

};

svg.addEventListener('click',click_for_ball);

