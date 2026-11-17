import { Script, Text2D, input, sceneManager, type Material, type Texture } from 'messier';

interface Maps {
  material: Material;
  normal: Texture | null;
  metallicRoughness: Texture | null;
  occlusion: Texture | null;
  emissive: Texture | null;
  glow: number;
}

/**
 * Runs the lab: Space takes every map but the base color off all materials (and puts them back), emissive maps
 * pulse, and N / P load the next and previous scene.
 */
export default class Lab extends Script {
  /** Glow pulses per second. */
  pulseRate = 0.4;
  /** How far the glow dips in a pulse: 0 keeps it steady, 1 lets it go dark. */
  pulseDepth = 0.55;
  private maps: Maps[] = [];
  private mapsOn = true;
  private status: Text2D | null = null;

  start(): void {
    const seen = new Set<Material>();
    this.scene.traverse((o) => {
      const m = o.material;
      if (!m || seen.has(m)) return;
      seen.add(m);
      this.maps.push({
        material: m,
        normal: m.normalTexture,
        metallicRoughness: m.metallicRoughnessTexture,
        occlusion: m.occlusionTexture,
        emissive: m.emissiveTexture,
        glow: m.emissiveStrength,
      });
    });
    this.status = this.scene.findByName('Status')?.getComponent(Text2D) ?? null;
    this.showStatus();
  }

  get mapsShown(): boolean {
    return this.mapsOn;
  }

  update(_dt: number, time: number): void {
    if (input.pressed('Space')) this.toggleMaps();
    if (input.pressed('KeyN')) this.loadScene(1);
    if (input.pressed('KeyP')) this.loadScene(-1);
    // A slow breath, between full strength and (1 - pulseDepth) of it.
    const pulse = 1 - this.pulseDepth * (0.5 - 0.5 * Math.cos(time * this.pulseRate * Math.PI * 2));
    for (const m of this.maps) if (m.emissive && this.mapsOn) m.material.emissiveStrength = m.glow * pulse;
  }

  toggleMaps(): void {
    this.mapsOn = !this.mapsOn;
    for (const m of this.maps) {
      const mat = m.material;
      mat.normalTexture = this.mapsOn ? m.normal : null;
      mat.metallicRoughnessTexture = this.mapsOn ? m.metallicRoughness : null;
      mat.occlusionTexture = this.mapsOn ? m.occlusion : null;
      mat.emissiveTexture = this.mapsOn ? m.emissive : null;
      // Without its map an emissive color would light the whole surface, so the glow goes with it.
      if (m.emissive) mat.emissiveStrength = this.mapsOn ? m.glow : 0;
    }
    this.showStatus();
  }

  private loadScene(step: number): void {
    const count = sceneManager.sceneCount;
    if (count < 2 || sceneManager.isLoading) return;
    void sceneManager.loadScene((sceneManager.activeSceneIndex + step + count) % count);
  }

  private showStatus(): void {
    if (this.status) this.status.text = this.mapsOn ? 'Maps: on' : 'Maps: base color only';
  }
}
