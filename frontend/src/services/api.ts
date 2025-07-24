import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    dateOfBirth: string;
    gender: string;
    address?: any;
  }) {
    const response = await this.api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  }

  async logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  async getProfile() {
    const response = await this.api.get('/auth/profile');
    return response.data;
  }

  async updateProfile(userData: any) {
    const response = await this.api.put('/auth/profile', userData);
    return response.data;
  }

  async changePassword(passwords: { currentPassword: string; newPassword: string }) {
    const response = await this.api.post('/auth/change-password', passwords);
    return response.data;
  }

  // Driver endpoints
  async registerDriver(driverData: {
    licenseNumber: string;
    vehicle: {
      make: string;
      model: string;
      year: number;
      licensePlate: string;
      color: string;
    };
  }, vehicleImage?: File) {
    const formData = new FormData();
    formData.append('licenseNumber', driverData.licenseNumber);
    formData.append('vehicle', JSON.stringify(driverData.vehicle));
    if (vehicleImage) {
      formData.append('vehicleImage', vehicleImage);
    }

    const response = await this.api.post('/driver/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getDriverProfile() {
    const response = await this.api.get('/driver/profile');
    return response.data;
  }

  async updateDriverProfile(driverData: any, vehicleImage?: File) {
    const formData = new FormData();
    if (driverData.licenseNumber) {
      formData.append('licenseNumber', driverData.licenseNumber);
    }
    if (driverData.vehicle) {
      formData.append('vehicle', JSON.stringify(driverData.vehicle));
    }
    if (vehicleImage) {
      formData.append('vehicleImage', vehicleImage);
    }

    const response = await this.api.put('/driver/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getDriverVerificationStatus() {
    const response = await this.api.get('/driver/verification-status');
    return response.data;
  }

  // Ride endpoints
  async createRide(rideData: {
    origin: {
      address: string;
      latitude: number;
      longitude: number;
    };
    destination: {
      address: string;
      latitude: number;
      longitude: number;
    };
    departureTime: string;
    availableSeats: number;
    pricePerSeat: number;
    notes?: string;
  }) {
    const response = await this.api.post('/rides', rideData);
    return response.data;
  }

  async searchRides(params: {
    origin?: string;
    destination?: string;
    date?: string;
  }) {
    const response = await this.api.get('/rides', { params });
    return response.data;
  }

  async getRide(rideId: string) {
    const response = await this.api.get(`/rides/${rideId}`);
    return response.data;
  }

  async bookRide(rideId: string, bookingData: {
    seatsBooked: number;
    paymentReference: string;
  }) {
    const response = await this.api.put(`/rides/${rideId}/book`, bookingData);
    return response.data;
  }

  // Payment endpoints
  async initializePayment(paymentData: {
    amount: number;
    email: string;
  }) {
    const response = await this.api.post('/payments/initialize', paymentData);
    return response.data;
  }

  async verifyPayment(reference: string) {
    const response = await this.api.get(`/payments/verify/${reference}`);
    return response.data;
  }

  // Location endpoints
  async geocodeAddress(address: string) {
    const response = await this.api.get('/location/geocode', {
      params: { address },
    });
    return response.data;
  }

  async getDirections(origin: string, destination: string) {
    const response = await this.api.get('/location/directions', {
      params: { origin, destination },
    });
    return response.data;
  }

  // Notification endpoints
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
  }) {
    const response = await this.api.get('/notifications', { params });
    return response.data;
  }

  async markNotificationAsRead(notificationId: string) {
    const response = await this.api.put(`/notifications/${notificationId}/mark-read`);
    return response.data;
  }

  async markAllNotificationsAsRead() {
    const response = await this.api.put('/notifications/mark-all-read');
    return response.data;
  }

  async updateNotificationPreferences(preferences: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  }) {
    const response = await this.api.post('/notifications/preferences', preferences);
    return response.data;
  }

  // Rating endpoints
  async createRating(ratingData: {
    rideId: string;
    ratedUserId: string;
    rating: number;
    review?: string;
    categories?: {
      punctuality?: number;
      communication?: number;
      cleanliness?: number;
      safety?: number;
      overall?: number;
    };
  }) {
    const response = await this.api.post('/ratings', ratingData);
    return response.data;
  }

  async getRatings(params?: {
    userId?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await this.api.get('/ratings', { params });
    return response.data;
  }

  // Helper methods
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  isAuthenticated() {
    return !!this.getAuthToken();
  }
}

export default new ApiService();
