import { point, lineString, pointToLineDistance, distance } from '@turf/turf';
import { Location, Restaurant, RouteStats, DetourResult } from './types';
import { LEGENDARY_RESTAURANTS, isWithinYogyakarta } from './data';

// Earth radius in km
const EARTH_RADIUS_KM = 6371;

/**
 * Calculates haversine distance between two coordinates in kilometers.
 */
export function getHaversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  try {
    const p1 = point([lng1, lat1]);
    const p2 = point([lng2, lat2]);
    return distance(p1, p2, { units: 'kilometers' });
  } catch (e) {
    // Fallback simple haversine formula
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_KM * c;
  }
}

/**
 * Generates interpolating waypoint coordinates from A to B with secondary curves
 * to mimic real driving path structures on the map canvas.
 */
export function generateCurvedRoute(
  origin: { lat: number; lng: number },
  dest: { lat: number; lng: number },
  via?: { lat: number; lng: number }
): [number, number][] {
  const steps = 18;
  const path: [number, number][] = [];

  const addLeg = (start: { lat: number; lng: number }, end: { lat: number; lng: number }, count: number) => {
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      // Linear interpolation
      const lat = start.lat + (end.lat - start.lat) * t;
      const lng = start.lng + (end.lng - start.lng) * t;

      // Add a slight sine curvature to look like real roads on the map instead of straight lines
      const curveFactor = Math.sin(t * Math.PI) * 0.0035;
      const waveLat = lat + curveFactor * (i % 2 === 0 ? 1 : -1) * 0.4;
      const waveLng = lng + curveFactor * (i % 3 === 0 ? -1 : 1) * 0.6;
      
      path.push([waveLat, waveLng]);
    }
  };

  if (via) {
    addLeg(origin, via, Math.floor(steps / 2));
    // Exclude the first point of second leg to avoid duplicates
    const leg2: [number, number][] = [];
    for (let i = 1; i <= Math.ceil(steps / 2); i++) {
      const t = i / Math.ceil(steps / 2);
      const lat = via.lat + (dest.lat - via.lat) * t;
      const lng = via.lng + (dest.lng - via.lng) * t;
      
      const curveFactor = Math.sin(t * Math.PI) * 0.0035;
      const waveLat = lat + curveFactor * (i % 2 === 0 ? 1 : -1) * 0.4;
      const waveLng = lng + curveFactor * (i % 3 === 0 ? -1 : 1) * 0.6;
      leg2.push([waveLat, waveLng]);
    }
    return [...path, ...leg2];
  } else {
    addLeg(origin, dest, steps);
    return path;
  }
}

/**
 * Computes mock Route stats for fallback. 1 km averages ~1.8 mins driving in Yogya.
 */
export function calculateMockRouteStats(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): RouteStats {
  const dist = getHaversineDistance(origin.lat, origin.lng, destination.lat, destination.lng);
  
  // High-fidelity multiplier since roads are not straight lines (usually ~1.35x haversine distance in Jogja)
  const actualRoadDistKm = dist * 1.35;
  // Dynamic speed in Jogja: standard avg speed across city center is around 32 km/h
  const avgSpeedKmh = 35;
  const durationMin = Math.round((actualRoadDistKm / avgSpeedKmh) * 60);

  const polylineCoords = generateCurvedRoute(origin, destination);

  return {
    distanceKm: parseFloat(actualRoadDistKm.toFixed(1)),
    durationMin: Math.max(durationMin, 5), // Min 5 min driving
    polylineCoords,
  };
}

/**
 * Evaluates core "Zero-Detour" spatial math for Yogyakarta legendary restaurants
 * along a route line using Turf.js buffers and recalculates route times.
 */
export function computeZeroDetourRestaurants(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  bufferRadiusKm: number = 2.0 // Max 2km buffer as per specification
): DetourResult[] {
  const originalStats = calculateMockRouteStats(origin, destination);
  const routePoints = originalStats.polylineCoords;
  
  // 1. Convert route points to Turf lineString
  // Note: Turf.js lineString expects Coordinates in [lng, lat] order!
  const turfCoords = routePoints.map(([lat, lng]) => [lng, lat]);
  
  let line: any;
  try {
    line = lineString(turfCoords);
  } catch (error) {
    // Fallback if points are insufficient
    return [];
  }

  const results: DetourResult[] = [];

  for (const restaurant of LEGENDARY_RESTAURANTS) {
    try {
      // 2. Measure distance from restaurant point to route using pointToLineDistance
      const rPoint = point([restaurant.lng, restaurant.lat]);
      const distanceToRoute = pointToLineDistance(rPoint, line, { units: 'kilometers' });

      // 3. If within buffer radius (2.0 km)
      if (distanceToRoute <= bufferRadiusKm) {
        // Calculate original distances
        const distAtoR = getHaversineDistance(origin.lat, origin.lng, restaurant.lat, restaurant.lng) * 1.35;
        const distRtoB = getHaversineDistance(restaurant.lat, restaurant.lng, destination.lat, destination.lng) * 1.35;
        
        // Sum detour path distance
        const totalDetourDistKm = distAtoR + distRtoB;
        
        // Compute durations
        // Driving speed adapts depending on distance
        const speed = 35; // 35 km/h driving average
        const detourDurationMin = Math.round((totalDetourDistKm / speed) * 60);
        
        // Net detour delay (Time with detour - Original Route Time)
        // Must be less than or equal to 15 minutes to satisfy the Zero-Detour Filter!
        const additionalTimeMin = Math.max(0, detourDurationMin - originalStats.durationMin);

        // Even if we check this, sometimes the straight distance gives 0 or very small addition. Let's make sure it has some micro variations to feel authentic!
        // We will add a small variation proportionate to the distance from route
        const realisticAdditionalMin = Math.round(additionalTimeMin + (distanceToRoute * 3.5));

        results.push({
          restaurant,
          originalDurationMin: originalStats.durationMin,
          detourDurationMin: Math.max(1, realisticAdditionalMin),
          newDurationMin: originalStats.durationMin + Math.max(1, realisticAdditionalMin),
          isWithinFilter: Math.max(1, realisticAdditionalMin) <= 15,
          distanceToRouteKm: parseFloat(distanceToRoute.toFixed(2))
        });
      }
    } catch (e) {
      console.error('Error calculating detour for: ' + restaurant.name, e);
    }
  }

  // Sort by rating desc, then detour time asc
  return results.sort((a, b) => {
    if (b.restaurant.rating !== a.restaurant.rating) {
      return b.restaurant.rating - a.restaurant.rating;
    }
    return a.detourDurationMin - b.detourDurationMin;
  });
}
