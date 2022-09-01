// Get: Initial speed, initial angle to the horizon and initial height above the ground.
// Do: Calculates the final velocity, angle of impact and horizontal distance traveled by the body, and then returns them.
module.exports = function BalisticThrow(V0, initialAngle, h0) {
  g = 9.81;
  V0 = parseFloat(V0);
  initialAngle = parseFloat(initialAngle);
  h0 = parseFloat(h0);

  // velocity
  // Vx = V * cos(α)
  // Vy = V * sin(α)
  Vx = V0 * Math.cos(initialAngle * (Math.PI / 180));
  Vy = V0 * Math.sin(initialAngle * (Math.PI / 180));

  if (initialAngle == 90) {
    Vx = 0;
    Vy = V0;
  }

  // Range of the projectile
  d = (Vx * [Vy + Math.sqrt(Math.pow(Vy, 2) + 2 * g * h0)]) / g;

  // Final Speed
  VTotal = Math.sqrt(2 * g * h0 + Math.pow(V0, 2));

  angleHitGround = (Math.acos(Vx / VTotal) * 180) / Math.PI;

  if (V0 == 0) {
    d = 0;
    angleHitGround = 90;
    VTotal = g * t;
  }

  return { speed: VTotal, angle: angleHitGround, distance: d };
};
