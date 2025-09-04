// types/node-vibrant.d.ts
declare module 'node-vibrant/browser' {
  export interface Swatch {
    hex: string;
    rgb: [number, number, number];
    hsl: [number, number, number];
    population: number;
    getHex(): string;
    getRgb(): [number, number, number];
    getHsl(): [number, number, number];
    getPopulation(): number;
    getTitleTextColor(): string;
    getBodyTextColor(): string;
  }

  export interface Palette {
    Vibrant: Swatch | null;
    Muted: Swatch | null;
    DarkVibrant: Swatch | null;
    DarkMuted: Swatch | null;
    LightVibrant: Swatch | null;
    LightMuted: Swatch | null;
  }

  export interface VibrantStatic {
    from(src: string | Buffer | Uint8Array | HTMLImageElement | HTMLCanvasElement): {
      getPalette(): Promise<Palette>;
      getPalette(callback: (err: Error | null, palette: Palette | null) => void): void;
    };
  }

  const Vibrant: VibrantStatic;
  export default Vibrant;
}