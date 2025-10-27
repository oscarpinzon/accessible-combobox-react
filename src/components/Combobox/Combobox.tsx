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
  helperText,
  errorText,
  isLoading = false,
  disabled = false,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isSuggestionVisible, setIsSuggestionVisible] =
    useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionListRef = useRef<HTMLUListElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  const listboxId = `${id}-listbox`;
  const labelId = `${id}-label`;
  const helperId = helperText ? `${id}-helper` : undefined;
  const errorId = errorText ? `${id}-error` : undefined;

  const displayedOptions = options.slice(0, maxDisplayed);

  const hasExactMatch = options.some(
    (option) => option.value.toLowerCase() === value.toLowerCase(),
  );

  const activeDescendantId =
    selectedIndex >= 0 && selectedIndex < displayedOptions.length
      ? `${id}-option-${selectedIndex}`
      : undefined;

  const ariaDescribedBy =
    [helperId, errorId].filter(Boolean).join(' ') || undefined;

  useEffect(() => {
    setIsSuggestionVisible(
      value.length >= minCharsForSuggestions &&
        options.length > 0 &&
        !hasExactMatch &&
        !isLoading &&
        !disabled &&
        !errorText,
    );
  }, [
    value,
    options,
    hasExactMatch,
    minCharsForSuggestions,
    isLoading,
    disabled,
    errorText,
  ]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [options]);

  useEffect(() => {
    if (selectedIndex >= 0 && selectedIndex < displayedOptions.length) {
      const selectedOption = optionRefs.current[selectedIndex];
      if (selectedOption) {
        selectedOption.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }
  }, [selectedIndex, displayedOptions.length]);

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

  const handleOptionTouchEnd = (
    option: ComboboxOption,
    e: React.TouchEvent,
  ) => {
    e.preventDefault();
    handleOptionSelect(option);
  };

  const hasError = Boolean(errorText);
  const showLoadingIndicator =
    isLoading && value.length >= minCharsForSuggestions;

  const inputClassName = [
    styles.input,
    isValid && isValid(value) ? styles.inputValid : '',
    hasError ? styles.inputError : '',
    disabled ? styles.inputDisabled : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.container}>
      <label id={labelId} htmlFor={id} className={styles.label}>
        {label}
        {isLoading && (
          <span className={styles.loadingIndicator} aria-hidden="true">
            (loading...)
          </span>
        )}
      </label>

      {helperText && (
        <div id={helperId} className={styles.helperText}>
          {helperText}
        </div>
      )}

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
          aria-describedby={ariaDescribedBy}
          aria-invalid={hasError}
          aria-busy={isLoading}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={inputClassName}
          disabled={disabled}
        />

        {showLoadingIndicator && (
          <div className={styles.loadingSpinner} aria-hidden="true">
            <span className={styles.spinner} />
          </div>
        )}

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
                ref={(el) => {
                  optionRefs.current[index] = el;
                }}
                role="option"
                aria-selected={selectedIndex === index}
                className={
                  selectedIndex === index
                    ? `${styles.option} ${styles.optionSelected}`
                    : styles.option
                }
                onClick={() => handleOptionSelect(option)}
                onTouchEnd={(e) => handleOptionTouchEnd(option, e)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {errorText && (
        <div
          id={errorId}
          className={styles.errorText}
          role="alert"
          aria-live="assertive"
        >
          {errorText}
        </div>
      )}
    </div>
  );
};
