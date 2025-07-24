import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Users, Clock, Star } from 'lucide-react';
import apiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';

interface Ride {
  _id: string;
  origin: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  destination: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  departureTime: string;
  availableSeats: number;
  pricePerSeat: number;
  driver: {
    _id: string;
    firstName: string;
    lastName: string;
    rating: {
      average: number;
      count: number;
    };
  };
  notes?: string;
}

interface SearchRidesIntegratedProps {
  onAuthRequired: (mode: 'signin' | 'signup') => void;
}

const SearchRidesIntegrated: React.FC<SearchRidesIntegratedProps> = ({ onAuthRequired }) => {
  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    date: ''
  });
  const [rides, setRides] = useState<Ride[]>([]);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  
  const { user, isAuthenticated } = useAuth();
  const { data: searchResults, loading: searchLoading, error: searchError, execute: searchRides } = useApi(apiService.searchRides);
  const { loading: bookingLoading, error: bookingError, execute: bookRide } = useApi(apiService.bookRide);

  // Search for rides
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const results = await searchRides({
        origin: searchData.origin,
        destination: searchData.destination,
        date: searchData.date
      });
      setRides(results.rides || []);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  // Book a ride
  const handleBookRide = async (ride: Ride, seatsToBook: number) => {
    if (!isAuthenticated) {
      onAuthRequired('signin');
      return;
    }

    try {
      // Initialize payment first
      const paymentData = await apiService.initializePayment({
        amount: ride.pricePerSeat * seatsToBook * 100, // Convert to kobo
        email: user?.email || ''
      });

      // In a real app, you'd redirect to Paystack payment page
      // For demo purposes, we'll simulate a successful payment
      const simulatedPaymentRef = `ref_${Date.now()}`;

      // Book the ride with payment reference
      await bookRide(ride._id, {
        seatsBooked: seatsToBook,
        paymentReference: simulatedPaymentRef
      });

      alert('Ride booked successfully!');
      // Refresh search results
      handleSearch(e);
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Your Ride</h2>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="From where?"
                value={searchData.origin}
                onChange={(e) => setSearchData({ ...searchData, origin: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Where to?"
                value={searchData.destination}
                onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={searchData.date}
                onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={searchLoading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {searchLoading ? 'Searching...' : 'Search Rides'}
          </button>
        </form>

        {searchError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {searchError}
          </div>
        )}
      </div>

      {/* Search Results */}
      {rides.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Available Rides</h3>
          
          {rides.map((ride) => (
            <div key={ride._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 text-gray-600 mb-1">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{ride.origin.address}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{ride.destination.address}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-2 text-gray-600 mb-1">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">{formatDate(ride.departureTime)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{formatTime(ride.departureTime)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{ride.availableSeats} seats</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">
                          {ride.driver.rating.average.toFixed(1)} ({ride.driver.rating.count})
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        ₦{ride.pricePerSeat.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">per seat</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm text-gray-600">
                    <strong>Driver:</strong> {ride.driver.firstName} {ride.driver.lastName}
                  </div>
                  
                  {ride.notes && (
                    <div className="mt-2 text-sm text-gray-600">
                      <strong>Notes:</strong> {ride.notes}
                    </div>
                  )}
                </div>
                
                <div className="ml-6">
                  <button
                    onClick={() => handleBookRide(ride, 1)}
                    disabled={bookingLoading}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bookingLoading ? 'Booking...' : 'Book Now'}
                  </button>
                </div>
              </div>
              
              {bookingError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {bookingError}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {rides.length === 0 && searchData.origin && searchData.destination && !searchLoading && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No rides found</div>
          <p className="text-gray-400">Try adjusting your search criteria or check back later.</p>
        </div>
      )}
    </div>
  );
};

export default SearchRidesIntegrated;
