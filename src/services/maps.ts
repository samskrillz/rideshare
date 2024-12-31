import { LoadScript } from '@react-google-maps/api';

const libraries: ("places" | "geometry" | "drawing")[] = ["places", "geometry"];

export const calculateDistance = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<{ distance: number; duration: number }> => {
  const service = new google.maps.DistanceMatrixService();
  
  try {
    const response = await service.getDistanceMatrix({
      origins: [new google.maps.LatLng(origin.lat, origin.lng)],
      destinations: [new google.maps.LatLng(destination.lat, destination.lng)],
      travelMode: google.maps.TravelMode.DRIVING,
    });

    const result = response.rows[0].elements[0];
    return {
      distance: result.distance.value,
      duration: result.duration.value,
    };
  } catch (error) {
    console.error('Error calculating distance:', error);
    throw error;
  }
};

export const estimateFare = (
  distance: number,
  duration: number,
  baseFare: number,
  surgeMultiplier: number
): number => {
  const distanceRate = 2; // $ per km
  const timeRate = 0.5; // $ per minute
  
  const distanceFare = (distance / 1000) * distanceRate;
  const timeFare = (duration / 60) * timeRate;
  
  return (baseFare + distanceFare + timeFare) * surgeMultiplier;
};
