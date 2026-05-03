export enum Role {
  DONOR = 'DONOR',
  RECIPIENT = 'RECIPIENT',
  ADMIN = 'ADMIN',
  HOSPITAL = 'HOSPITAL'
}

export enum BloodType {
  A_POSITIVE = 'A_POSITIVE',
  A_NEGATIVE = 'A_NEGATIVE',
  B_POSITIVE = 'B_POSITIVE',
  B_NEGATIVE = 'B_NEGATIVE',
  AB_POSITIVE = 'AB_POSITIVE',
  AB_NEGATIVE = 'AB_NEGATIVE',
  O_POSITIVE = 'O_POSITIVE',
  O_NEGATIVE = 'O_NEGATIVE'
}

export enum Urgency {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  NORMAL = 'NORMAL'
}

export enum RequestStatus {
  OPEN = 'OPEN',
  MATCHED = 'MATCHED',
  FULFILLED = 'FULFILLED',
  EXPIRED = 'EXPIRED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  bloodType?: BloodType;
  locationLat?: number;
  locationLng?: number;
  isAvailable: boolean;
  lastDonationDate?: Date;
  createdAt: Date;
}

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodType: BloodType;
  units: number;
  urgency: Urgency;
  hospital: string;
  location: {
    lat: number;
    lng: number;
  };
  status: RequestStatus;
  requestedBy: string;
  matchedDonors: string[];
  createdAt: Date;
  expiresAt: Date;
}

export interface BloodInventory {
  id: string;
  bloodBank: string;
  bloodType: BloodType;
  units: number;
  expiresAt: Date;
  updatedAt: Date;
}

export interface Campaign {
  id: string;
  title: string;
  organizer: string;
  targetUnits: number;
  location: string;
  startDate: Date;
  endDate: Date;
  registrations: string[];
}

export type KafkaTopic = 
  | 'donor.registered'
  | 'donor.updated'
  | 'request.created'
  | 'match.found'
  | 'donor.accepted'
  | 'donation.completed';

export interface KafkaEvent<T = any> {
  topic: KafkaTopic;
  payload: T;
  timestamp: number;
}

export interface SocketEvent<T = any> {
  event: string;
  data: T;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}
