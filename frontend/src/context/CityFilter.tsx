// src/context/CityFilter.tsx
import React, { useState, useEffect, ReactNode } from "react";

export interface City {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  admin1?: string;
  population?: number;
}

interface CityFilterProps {
  children: (props: {
    cityInput: string;
    setCityInput: (value: string) => void;
    selectedCity: City | null;
    setSelectedCity: (city: City | null) => void;
    suggestions: City[];
    handleSelectCity: (city: City) => void;
  }) => ReactNode;
}

export const CityFilter = ({ children }: CityFilterProps) => {
  const [cityInput, setCityInput] = useState("");
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const isSelectingRef = React.useRef(false);

  useEffect(() => {
    if (isSelectingRef.current) {
      isSelectingRef.current = false;
      return;
    }

    if (cityInput.length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchCities = async () => {
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${cityInput}&count=5`
        );
        const data = await res.json();

        const filteredResults = (data.results || [])
          .filter(
            (city: City) =>
              city.name.toLowerCase().startsWith(cityInput.toLowerCase()) &&
              city.name.length >= 3 &&
              city.latitude &&
              city.longitude
          )
          .sort((a: City, b: City) => (b.population || 0) - (a.population || 0));

        setSuggestions(filteredResults);
      } catch (err) {
        console.error(err);
        setSuggestions([]);
      }
    };

    fetchCities();
  }, [cityInput]);

  const handleSelectCity = (city: City) => {
    isSelectingRef.current = true;
    setSelectedCity(city);
    setCityInput(`${city.name}${city.admin1 ? ", " + city.admin1 : ""}, ${city.country}`);
    setSuggestions([]);
  };

  // ⚡ Devolver siempre un JSX válido
  return <>{children({ cityInput, setCityInput, selectedCity, setSelectedCity, suggestions, handleSelectCity })}</>;
};
