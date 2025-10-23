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

  const listboxId = `${id}-listbox`;
  const labelId = `${id}-label`;

  const displayedOptions = options.slice(0, maxDisplayed);

  const hasExactMatch = options.some(
    (option) => option.value.toLowerCase() === value.toLowerCase(),
  );

  const activeDescendantId =
    selectedIndex >= 0 && selectedIndex < displayedOptions.length
      ? `${id}-option-${selectedIndex}`
      : undefined;

  useEffect(() => {
    setIsSuggestionVisible(
      value.length >= minCharsForSuggestions &&
        options.length > 0 &&
        !hasExactMatch,
    );
  }, [value, options, hasExactMatch, minCharsForSuggestions]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [options]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleOptionSelect = (option: ComboboxOption) => {
    onChange(option.value);
    setIsSuggestionVisible(false);
    setSelectedIndex(-1);
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
        setSelectedIndex(-1);
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
      <label id={labelId} htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles.wrapper}>
        <input
          id={id}
          ref={inputRef}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isSuggestionVisible}
          aria-controls={isSuggestionVisible ? listboxId : undefined}
          aria-activedescendant={activeDescendantId}
          aria-labelledby={labelId}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={inputClassName}
        />

        {isSuggestionVisible && (
          <ul
            id={listboxId}
            ref={suggestionListRef}
            className={styles.listbox}
            role="listbox"
            aria-labelledby={labelId}
          >
            {displayedOptions.map((option, index) => (
              <li
                key={option.value}
                id={`${id}-option-${index}`}
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
