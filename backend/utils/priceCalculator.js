// Price calculation logic based on category and distance
export const calculatePrice = (category, distance, additionalParams = {}) => {
  const basePrices = {
    pickup_drop: 50,
    delivery: 40,
    home_service: 200,
    repair: 300,
    cleaning: 250,
    moving: 500,
    other: 100,
  };

  const perKmRate = {
    pickup_drop: 10,
    delivery: 8,
    home_service: 0,
    repair: 0,
    cleaning: 0,
    moving: 15,
    other: 5,
  };

  let basePrice = basePrices[category] || 100;
  let distanceCharge = (distance || 0) * (perKmRate[category] || 5);
  
  // Additional charges
  let additionalCharge = 0;
  if (additionalParams.urgent) {
    additionalCharge += basePrice * 0.3; // 30% surge for urgent tasks
  }
  
  if (additionalParams.heavyLoad) {
    additionalCharge += 100;
  }

  const totalPrice = Math.round(basePrice + distanceCharge + additionalCharge);
  
  return {
    basePrice,
    distanceCharge,
    additionalCharge,
    totalPrice,
  };
};

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

