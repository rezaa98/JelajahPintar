export interface Location {
  id: string;
  name: string;
  regency: 'Sleman' | 'Bantul' | 'Gunung Kidul' | 'Kulon Progo' | 'Kota Yogyakarta';
  lat: number;
  lng: number;
  description?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  userRatingCount: number;
  formattedAddress: string;
  lat: number;
  lng: number;
  photoUrl: string;
  description: string;
  cuisine: string;
  specialty: string;
  placeId?: string;
  phone?: string;
  priceLevel?: number; // 1-4 scale
  openNow: boolean;
}

export interface RouteStats {
  distanceKm: number;
  durationMin: number;
  polylineCoords: [number, number][]; // [lat, lng] array
}

export interface DetourResult {
  restaurant: Restaurant;
  originalDurationMin: number;
  detourDurationMin: number; // additional minutes (new_route_duration - original_route_duration)
  newDurationMin: number;
  isWithinFilter: boolean;
  distanceToRouteKm: number; // distance from restaurant to the nearest point on the route
}
