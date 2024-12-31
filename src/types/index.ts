export interface User {
  id: string;
  email: string;
  role: 'admin' | 'company' | 'dispatcher' | 'driver' | 'customer';
  name: string;
}

export interface Company {
  id: string;
  name: string;
  address: string;
  contactNumber: string;
  subscription: {
    plan: string;
    status: string;
    validUntil: Date;
  };
}

export interface Driver {
  id: string;
  userId: string;
  companyId: string;
  vehicle: Vehicle;
  status: 'available' | 'busy' | 'offline';
  location: {
    lat: number;
    lng: number;
  };
}

export interface Vehicle {
  id: string;
  model: string;
  plateNumber: string;
  type: 'sedan' | 'suv' | 'van';
  capacity: number;
}

export interface Ride {
  id: string;
  customerId: string;
  driverId?: string;
  companyId: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  pickup: {
    address: string;
    lat: number;
    lng: number;
  };
  dropoff: {
    address: string;
    lat: number;
    lng: number;
  };
  fare: number;
  createdAt: Date;
  completedAt?: Date;
}
