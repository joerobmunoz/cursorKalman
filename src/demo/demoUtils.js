import KalmanCursor from './../kalman'

window.drawPrediction = (ctx, x, isPrediction) => {
	let alpha = 1.0,   // full opacity
	    interval = setInterval(function () {

	    	if (isPrediction) {
				ctx.strokeStyle="red";
	    	} else {
	    		ctx.strokeStyle="green";
	    	}

	        ctx.beginPath();
			ctx.arc(x[0],x[1],30,0,2*Math.PI);
			ctx.stroke();

	        alpha = alpha - 0.05; // decrease opacity (fade out)
	        if (alpha <= 0) {
	            clearInterval(interval);
	            ctx.clearRect(0,0,canvas.width, canvas.height)
	        }
	    }, 30); 
};

window.initKalman = () => {
    window.kalman = new KalmanCursor(20, 20, 0.1, 1000);
};