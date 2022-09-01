// Get: Initial speed, initial angle to the horizon and initial height above the ground.
// Do: Collects many positions of the body during its movement and returns two arrays,
//     one indicating the positions on the X axis and the other on the Y axis.
//     These positions are intended for drawing the body movement graph.

module.exports = function PaintBalisticThrow(V0, initialAngle, h0) {
  const g = 9.81;
  V0 = parseFloat(V0);
  initialAngle = parseFloat(initialAngle);
  h0 = parseFloat(h0);

  Vx = V0 * Math.cos(initialAngle * (Math.PI / 180));
  Vy = V0 * Math.sin(initialAngle * (Math.PI / 180));

  if (initialAngle == 90) {
    Vx = 0;
    Vy = V0;
  }

  // time of flight
  t = [Vy + Math.sqrt(Math.pow(Vy, 2) + 2 * g * h0)] / g;

  positionsX = [];
  positionsY = [];

  if (V0 == 0) {
    d = 0;
    angleHitGround = 90;
    VTotal = g * t;

    if (h0 == 0) {
      throw new Error("No Movement");
    } else {
      throw new Error("Free Fall Movement");
    }
  } else if (initialAngle != 90) {
    for (let timeInAct = 0; timeInAct < t; timeInAct += 0.05) {
      x = Vx * timeInAct;
      y =
        h0 +
        x * Math.tan(initialAngle * (Math.PI / 180)) -
        0.5 *
          g *
          Math.pow(x / (V0 * Math.cos(initialAngle * (Math.PI / 180))), 2);

      positionsX.push(x);
      positionsY.push(y);
    }
  } else {
    throw new Error("Free Fall Movement");
  }

  // last point - touching the ground
  x = Vx * t;
  positionsX.push(x);
  positionsY.push(0);

  const Data = [positionsX, positionsY];

  return Data;
};
