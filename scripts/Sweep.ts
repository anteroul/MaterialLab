import { Script, vec3, type Vec3 } from 'messier';

/** Swings the object from side to side (and a little up and down), so the light it carries rakes across the scene. */
export default class Sweep extends Script {
  /** How far it swings each way, meters. */
  width = 5;
  /** Seconds for a swing there and back. */
  period = 10;
  /** How far it rises and falls, meters. */
  bob = 0.5;
  private origin: Vec3 = [0, 0, 0];

  start(): void {
    this.origin = vec3.clone(this.transform.position);
  }

  update(_dt: number, time: number): void {
    const a = (time / this.period) * Math.PI * 2;
    const o = this.origin;
    this.transform.position = [o[0] + Math.sin(a) * this.width, o[1] + Math.sin(a * 2) * this.bob, o[2]];
  }
}
