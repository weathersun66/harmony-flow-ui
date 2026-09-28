import type { CrosshairPoint } from './ChartCrosshair';

export function crosshairGeometry(points: readonly CrosshairPoint[]) {
  const finite = points.map((point) => point.value).filter((value): value is number => value !== null && Number.isFinite(value));
  let min = 0;
  let max = 0;
  for (const value of finite) {
    min = Math.min(min, value);
    max = Math.max(max, value);
  }
  const scale = Math.max(Math.abs(min), Math.abs(max), 1);
  const span = max / scale - min / scale;
  const coordinates = points.map((point, index) => ({
    x: points.length <= 1 ? 300 : 24 + index / (points.length - 1) * 552,
    y: point.value === null || !Number.isFinite(point.value) ? null
      : span === 0 ? 110 : 196 - (point.value / scale - min / scale) / span * 172,
  }));
  let path = '';
  let connected = false;
  for (const point of coordinates) {
    if (point.y === null) { connected = false; continue; }
    path += `${connected ? 'L' : 'M'}${point.x.toFixed(3)},${point.y.toFixed(3)} `;
    connected = true;
  }
  const indexById = new Map(points.map((point, index) => [point.id, index]));
  return { coordinates, path, min, max, indexById, hasValues: finite.length > 0 };
}
