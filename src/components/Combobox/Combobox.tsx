import React, { type KeyboardEvent, useEffect, useRef, useState } from 'react';
import styles from './Combobox.module.css';
import type { ComboboxOption, ComboboxProps } from './types';

export const Combobox: React.FC<ComboboxProps> = ({
  id,
  label,
  value,
  options,
  onChange,
  onSelect,
  placeholder,
  maxDisplayed = 10,
  className = '',
  isValid,
  minCharsForSuggestions = 2,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isSuggestionVisible, setIsSuggestionVisible] =
    useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionListRef = useRef<HTMLUListElement>(null);

  // Limit displayed suggestions
  const displayedOptions = options.slice(0, maxDisplayed);

  // Check if current value is an exact match
  const hasExactMatch = options.some(
    (option) => option.value.toLowerCase() === value.toLowerCase(),
  );

  // Show suggestions when criteria met
  useEffect(() => {
    setIsSuggestionVisible(
      value.length >= minCharsForSuggestions &&
        options.length > 0 &&
        !hasExactMatch,
    );
  }, [value, options, hasExactMatch, minCharsForSuggestions]);

  // Reset selected index when options list changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [options]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleOptionSelect = (option: ComboboxOption) => {
    onChange(option.value);
    setIsSuggestionVisible(false);
    onSelect?.(option.value);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isSuggestionVisible) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < displayedOptions.length - 1 ? prev + 1 : prev,
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < displayedOptions.length) {
          handleOptionSelect(displayedOptions[selectedIndex]);
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

  const inputClassName = [
    styles.input,
    isValid && isValid(value) ? styles.inputValid : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.container}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles.wrapper}>
        <input
          id={id}
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={inputClassName}
        />

        {isSuggestionVisible && (
          <ul ref={suggestionListRef} className={styles.listbox} role="listbox">
            {displayedOptions.map((option, index) => (
              <li
                key={option.value}
                role="option"
                aria-selected={selectedIndex === index}
                className={
                  selectedIndex === index
                    ? `${styles.option} ${styles.optionSelected}`
                    : styles.option
                }
                onClick={() => handleOptionSelect(option)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
