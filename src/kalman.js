const _m = require('mathjs');

export default class KalmanCursor {
  constructor(initialX, initialY, dt=0.1, initialUncertainty=10.0, epochUncertainty=0.1) {
    if (initialX < 0 || initialY < 0) throw "All positions must be normalized to be greater than 0."
    this.dt = dt;

    // initial state (location and velocity)
    this.x = _m.matrix([[initialX], [initialY], [0], [0]]);

    // external motion
    this.u = _m.matrix([[0.0], [0.0], [0.0], [0.0]]);

    // initial uncertainty: 0 for positions x and y, 1000 for the two velocities
    this.P = _m.matrix([[0.0,0.0,0.0,0.0], [0.0,0.0,0.0,0.0], [0.0,0.0, initialUncertainty,0.0], [0.0,0.0,0.0, initialUncertainty]]);

    // next state function: generalize the 2d version to 4d
    this.F = _m.matrix([[1.0,0.0, this.dt, 0.0], [0.0, 1.0, 0.0, this.dt], [0.0,0.0,1.0,0.0], [0.0,0.0,0.0,1.0]]);

    // measurement function: reflect the fact that we observe x and y but not the two velocities
    this.H = _m.matrix([[0.0,1.0,0.0,0.0], [0.0,1.0,0.0,0.0]]);

    // measurement uncertainty: use 2x2 matrix with 0.1 as main diagonal
    this.R = _m.matrix([[epochUncertainty, 0.0], [0.0, epochUncertainty]]);

    // 4d identity matrix
    this.I = _m.matrix([[1.0,0.0,0.0,0.0], [0.0,1.0,0.0,0.0], [0.0,0.0,1.0,0], [0.0,0.0,0.0,1.0]]);
  }

  predict() {
    var predictedX = _m.add(_m.multiply(this.F, this.x), this.u);

    // updated cov matrix
    this.P = _m.multiply(_m.multiply(this.F, this.P), _m.transpose(this.F));

    return predictedX;
  }

  update(x) {
    // measurement update
      // update cov matrix
    var Z = _m.matrix([[x[0]], [x[1]]]);
    var S = _m.add(_m.multiply(_m.multiply(this.H, this.P), _m.transpose(this.H)), this.R);
    var K = _m.multiply(_m.multiply(this.P, _m.transpose(this.H)), _m.inv(S));

      // update state
      // TODO: This can just accept "x", since there is 0 error
    var test = _m.multiply(this.H, this.x);
    var y = _m.subtract(Z, test);
    var test2 = _m.multiply(K, y);

    console.log(test2._data, this.x._data)
    this.x = _m.add(this.x, test2);
    this.P = _m.multiply(_m.subtract(this.I, _m.multiply(K, this.H)), this.P);

    // this.x._data[0][0] = x[0]
    // this.x._data[1][0] = x[1]


  }
}