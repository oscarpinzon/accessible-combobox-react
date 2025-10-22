import { Combobox, type ComboboxOption } from '@/components/Combobox';
import { useCities } from '@/hooks/useCities';
import React, { useEffect, useState } from 'react';
import type { CityFieldProps } from './types';

export const CityField: React.FC<CityFieldProps> = ({
  label,
  onCityChange,
  onStatusChange,
}) => {
  const [inputValue, setInputValue] = useState<string>('');

  const MAX_SUGGESTIONS = 10;

  const { cities } = useCities(inputValue);

  // Convert cities to ComboboxOption format
  const cityOptions: ComboboxOption[] = cities.map((city) => ({
    value: city,
    label: city,
  }));

  // Determine if the current input matches a valid city
  const isValidCity = cities.some(
    (city) => city.toLowerCase() === inputValue.toLowerCase(),
  );

  // Update status based on current state
  useEffect(() => {
    if (inputValue === '') {
      onStatusChange('empty');
    } else if (isValidCity) {
      onStatusChange('valid');
    } else if (inputValue.length >= 2 && cities.length > 0) {
      const displayCount = Math.min(cities.length, MAX_SUGGESTIONS);
      const count =
        cities.length > MAX_SUGGESTIONS
          ? `${displayCount} of ${cities.length}`
          : cities.length;
      onStatusChange(`${inputValue} (${count} suggestions)`);
    } else {
      onStatusChange('typing...');
    }
  }, [inputValue, cities, isValidCity, onStatusChange]);

  const handleChange = (value: string) => {
    setInputValue(value);
    onCityChange?.(value);
  };

  const handleSelect = (value: string) => {
    onCityChange?.(value);
  };

  return (
    <Combobox
      id="city-input"
      label={label}
      value={inputValue}
      options={cityOptions}
      onChange={handleChange}
      onSelect={handleSelect}
      maxDisplayed={MAX_SUGGESTIONS}
      isValid={(value) =>
        cities.some((city) => city.toLowerCase() === value.toLowerCase())
      }
      minCharsForSuggestions={2}
    />
  );
};
