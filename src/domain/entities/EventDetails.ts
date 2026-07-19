// src/domain/entities/EventDetails.ts

export interface ItineraryItem {
  time: string;
  title: string;
  description: string;
  icon: string;
}

export interface LocationDetail {
  name: string;
  time: string;
  address: string;
  googleMapsUrl: string;
}

export interface EventDetails {
  title: string;
  celebrationText: string;
  description: string;
  targetDate: string;
  misa: LocationDetail;
  recepcion: LocationDetail;
  itinerary: ItineraryItem[];
}
