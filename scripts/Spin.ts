import { Script } from 'messier';

/** Turns the object around its vertical axis, tilted by tilt degrees. */
export default class Spin extends Script {
  /** Degrees per second. */
  speed = 20;
  /** Tilt of the axis, degrees. */
  tilt = 0;
  private angle = 0;

  start(): void {
    this.angle = this.transform.getEulerDeg()[1];
  }

  update(dt: number): void {
    this.angle = (this.angle + this.speed * dt) % 360;
    this.transform.setEulerDeg(this.tilt, this.angle, 0);
  }
}
