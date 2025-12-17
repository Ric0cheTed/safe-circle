import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
}

interface SOSContextType {
  isSOSActive: boolean;
  sosStartTime: Date | null;
  currentLocation: Location | null;
  activateSOS: () => void;
  deactivateSOS: () => void;
  updateLocation: () => void;
}

const SOSContext = createContext<SOSContextType | undefined>(undefined);

export const SOSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [sosStartTime, setSosStartTime] = useState<Date | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

  const updateLocation = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(),
          });
        },
        (error) => {
          console.error('Location error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  }, []);

  const activateSOS = useCallback(() => {
    setIsSOSActive(true);
    setSosStartTime(new Date());
    updateLocation();
    
    // Open phone dialer to 999 (UK emergency)
    window.location.href = 'tel:999';
  }, [updateLocation]);

  const deactivateSOS = useCallback(() => {
    setIsSOSActive(false);
    setSosStartTime(null);
    setCurrentLocation(null);
  }, []);

  return (
    <SOSContext.Provider
      value={{
        isSOSActive,
        sosStartTime,
        currentLocation,
        activateSOS,
        deactivateSOS,
        updateLocation,
      }}
    >
      {children}
    </SOSContext.Provider>
  );
};

export const useSOS = () => {
  const context = useContext(SOSContext);
  if (context === undefined) {
    throw new Error('useSOS must be used within an SOSProvider');
  }
  return context;
};