import React, { type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useCities } from '../hooks/useCities';
import '../styles/CityField.css';

interface CityFieldProps {
  label: string;
  onCityChange?: (city: string) => void;
  onStatusChange: (status: string) => void;
}

export const CityField: React.FC<CityFieldProps> = ({
  label,
  onCityChange,
  onStatusChange,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isSuggestionVisible, setIsSuggestionVisible] =
    useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionListRef = useRef<HTMLUListElement>(null);

  const MAX_SUGGESTIONS = 10;

  const { cities } = useCities(inputValue);

  // Limit displayed suggestions
  const displayedCities = cities.slice(0, MAX_SUGGESTIONS);

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
    } else if (isSuggestionVisible && cities.length > 0) {
      const count =
        cities.length > MAX_SUGGESTIONS
          ? `${displayedCities.length} of ${cities.length}`
          : cities.length;
      onStatusChange(`${inputValue} (${count} suggestions)`);
    } else {
      onStatusChange('typing...');
    }
  }, [
    inputValue,
    cities,
    isValidCity,
    isSuggestionVisible,
    onStatusChange,
    displayedCities.length,
  ]);

  // Show suggestions when input length >= 2 and it's not an exact match
  useEffect(() => {
    const hasExactMatch = cities.some(
      (city) => city.toLocaleLowerCase() === inputValue.toLocaleLowerCase(),
    );
    setIsSuggestionVisible(
      inputValue.length >= 2 && cities.length > 0 && !hasExactMatch,
    );
  }, [inputValue, cities]);

  // Reset selected index when cities list changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [cities]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onCityChange?.(e.target.value);
  };

  const handleCitySelect = (city: string) => {
    setInputValue(city);
    setIsSuggestionVisible(false);
    onCityChange?.(city);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isSuggestionVisible) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < cities.length - 1 ? prev + 1 : prev,
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < cities.length) {
          handleCitySelect(cities[selectedIndex]);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsSuggestionVisible(false);
        break;

      default:
        break;
    }
  };

  return (
    <div className="city-field-container">
      <label htmlFor="city-input">{label}</label>
      <div className="input-container">
        <input
          id="city-input"
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={isValidCity ? 'valid' : ''}
        />

        {isSuggestionVisible && (
          <ul
            ref={suggestionListRef}
            className="suggestions-list"
            role="listbox"
          >
            {displayedCities.map((city, index) => (
              <li
                key={city}
                role="option"
                aria-selected={selectedIndex === index}
                className={selectedIndex === index ? 'selected' : ''}
                onClick={() => handleCitySelect(city)}
              >
                {city}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
