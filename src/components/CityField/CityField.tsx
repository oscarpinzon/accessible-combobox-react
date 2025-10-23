import { Combobox } from '@/components/Combobox';
import { useCities } from '@/hooks/useCities';
import React, { useEffect, useState } from 'react';
import type { CityFieldProps } from './types';

const MAX_SUGGESTIONS = 10;

export const CityField: React.FC<CityFieldProps> = ({
  label,
  onCityChange,
  onStatusChange,
}) => {
  const [city, setCity] = useState<string>('');
  const { cities } = useCities(city);

  const cityOptions = cities.map((c) => ({ value: c, label: c }));

  const isValidCity = (value: string): boolean => {
    return cities.some((c) => c.toLowerCase() === value.toLowerCase());
  };

  useEffect(() => {
    if (city.trim() === '') {
      onStatusChange('empty');
      return;
    }

    if (cities.length === 0) {
      onStatusChange('typing...');
      return;
    }

    const hasExactMatch = cities.some(
      (c) => c.toLowerCase() === city.toLowerCase(),
    );

    if (hasExactMatch) {
      onStatusChange('valid');
      return;
    }

    if (cities.length > MAX_SUGGESTIONS) {
      onStatusChange(
        `${city} (showing ${MAX_SUGGESTIONS} of ${cities.length} suggestions)`,
      );
    } else if (cities.length === 1) {
      onStatusChange(`${city} (1 suggestion available)`);
    } else {
      onStatusChange(`${city} (${cities.length} suggestions available)`);
    }
  }, [city, cities, onStatusChange]);

  const handleCityChange = (value: string) => {
    setCity(value);
    onCityChange?.(value);
  };

  const handleCitySelect = (value: string) => {
    onCityChange?.(value);
  };

  return (
    <Combobox
      id="city-input"
      label={label}
      value={city}
      options={cityOptions}
      onChange={handleCityChange}
      onSelect={handleCitySelect}
      placeholder="Start typing a city name..."
      maxDisplayed={MAX_SUGGESTIONS}
      isValid={isValidCity}
      minCharsForSuggestions={2}
    />
  );
};
