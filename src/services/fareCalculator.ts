interface FareFactors {
  distance: number;
  duration: number;
  timeOfDay: Date;
  demandLevel: number;
  vehicleType: string;
  cityId: string;
}

interface CityRates {
  baseRate: number;
  perKilometer: number;
  perMinute: number;
  minimumFare: number;
}

export class FareCalculator {
  private static async getCityRates(cityId: string): Promise<CityRates> {
    // In real implementation, fetch from API
    return {
      baseRate: 5,
      perKilometer: 2,
      perMinute: 0.5,
      minimumFare: 10
    };
  }

  private static calculateSurgeMultiplier(
    timeOfDay: Date,
    demandLevel: number
  ): number {
    const hour = timeOfDay.getHours();
    let timeMultiplier = 1;

    // Peak hours: 7-9 AM and 5-7 PM
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      timeMultiplier = 1.5;
    }

    // Late night: 11 PM - 5 AM
    if (hour >= 23 || hour <= 5) {
      timeMultiplier = 1.25;
    }

    // Demand multiplier (1.0 to 2.0)
    const demandMultiplier = 1 + (Math.min(demandLevel, 100) / 100);

    return timeMultiplier * demandMultiplier;
  }

  private static getVehicleMultiplier(vehicleType: string): number {
    const multipliers: Record<string, number> = {
      'economy': 1.0,
      'comfort': 1.2,
      'premium': 1.5,
      'van': 1.8
    };
    return multipliers[vehicleType] || 1.0;
  }

  static async calculateFare(factors: FareFactors): Promise<number> {
    const cityRates = await this.getCityRates(factors.cityId);
    
    // Base calculation
    const distanceCost = factors.distance * cityRates.perKilometer;
    const timeCost = factors.duration * cityRates.perMinute;
    const baseFare = cityRates.baseRate + distanceCost + timeCost;

    // Apply multipliers
    const surgeMultiplier = this.calculateSurgeMultiplier(
      factors.timeOfDay,
      factors.demandLevel
    );
    const vehicleMultiplier = this.getVehicleMultiplier(factors.vehicleType);

    // Calculate final fare
    const calculatedFare = baseFare * surgeMultiplier * vehicleMultiplier;

    // Ensure minimum fare
    return Math.max(calculatedFare, cityRates.minimumFare);
  }
}
