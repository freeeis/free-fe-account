export function appendRouteSegment(path, segment) {
  const normalizedPath = String(path || '').replace(/\/+$/, '');
  return `${normalizedPath}/${segment}`;
}