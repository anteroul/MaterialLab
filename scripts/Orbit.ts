import { Script, quat } from 'messier';

/** Circles a directional light around the scene, so the light (and the sky's sun) comes from every side in turn. */
export default class Orbit extends Script {
  /** Seconds for a full circle. */
  period = 24;
  /** Height of the light above the horizon, degrees. */
  elevation = 24;
  private startAngle = 0;

  start(): void {
    const forward = this.transform.forward;
    this.startAngle = Math.atan2(-forward[2], -forward[0]);
  }

  update(_dt: number, time: number): void {
    const a = this.startAngle + (time / this.period) * Math.PI * 2;
    const e = (this.elevation * Math.PI) / 180;
    // Lights shine along their local -Z: aim it from its place on the circle at the centre.
    this.transform.rotation = quat.lookRotation([-Math.cos(a) * Math.cos(e), -Math.sin(e), -Math.sin(a) * Math.cos(e)]);
  }
}
