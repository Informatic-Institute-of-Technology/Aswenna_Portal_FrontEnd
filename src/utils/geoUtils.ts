export interface GNDivision {
  name: string;
  number: string;
}

export interface DSBoundary {
  province: string;
  district: string;
  ds: string;
  rings: [number, number][][];
  gnDivisions: GNDivision[];
}

function pointInRing(
  px: number,
  py: number,
  ring: [number, number][],
): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

export function findDSDivisionByCoords(
  lat: number,
  lng: number,
  boundaries: DSBoundary[],
): DSBoundary | null {
  for (const b of boundaries) {
    for (const ring of b.rings) {
      if (pointInRing(lng, lat, ring)) return b;
    }
  }
  return null;
}
