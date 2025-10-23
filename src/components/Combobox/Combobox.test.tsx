import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Combobox } from './Combobox';
import type { ComboboxOption } from './types';

describe('Combobox', () => {
  const mockOptions: ComboboxOption[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'apricot', label: 'Apricot' },
    { value: 'banana', label: 'Banana' },
  ];

  const mockOnChange = vi.fn();
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders with label', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value=""
          options={[]}
          onChange={mockOnChange}
        />,
      );

      expect(screen.getByLabelText('Fruit')).toBeInTheDocument();
    });

    it('renders input with placeholder', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value=""
          options={[]}
          onChange={mockOnChange}
          placeholder="Select a fruit"
        />,
      );

      expect(screen.getByPlaceholderText('Select a fruit')).toBeInTheDocument();
    });

    it('displays current value', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value="apple"
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByLabelText('Fruit') as HTMLInputElement;
      expect(input.value).toBe('apple');
    });
  });

  describe('ARIA Attributes', () => {
    it('has role="combobox"', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value=""
          options={[]}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole('combobox');
      expect(input).toBeInTheDocument();
    });

    it('has aria-autocomplete="list"', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value=""
          options={[]}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-autocomplete', 'list');
    });

    it('sets aria-expanded to false when closed', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value=""
          options={[]}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });

    it('sets aria-expanded to true when open', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value="app"
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-expanded', 'true');
    });

    it('has aria-controls pointing to listbox when expanded', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value="app"
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole('combobox');
      const listbox = screen.getByRole('listbox');

      expect(input).toHaveAttribute('aria-controls', 'test-listbox');
      expect(listbox).toHaveAttribute('id', 'test-listbox');
    });

    it('does not have aria-controls when collapsed', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value=""
          options={[]}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole('combobox');
      expect(input).not.toHaveAttribute('aria-controls');
    });

    it('input is labeled by label element', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value=""
          options={[]}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-labelledby', 'test-label');
    });

    it('listbox is labeled by the same label', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value="ap"
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      const listbox = screen.getByRole('listbox');
      expect(listbox).toHaveAttribute('aria-labelledby', 'test-label');
    });

    it('each option has unique ID', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value="ap"
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveAttribute('id', 'test-option-0');
      expect(options[1]).toHaveAttribute('id', 'test-option-1');
      expect(options[2]).toHaveAttribute('id', 'test-option-2');
    });

    it('options have aria-selected attribute', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value="ap"
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveAttribute('aria-selected');
    });

    it('sets aria-activedescendant when option is highlighted', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value="ap"
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole('combobox');

      expect(input).not.toHaveAttribute('aria-activedescendant');

      fireEvent.keyDown(input, { key: 'ArrowDown' });

      expect(input).toHaveAttribute('aria-activedescendant', 'test-option-0');
    });

    it('updates aria-activedescendant when navigating', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value="ap"
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole('combobox');

      fireEvent.keyDown(input, { key: 'ArrowDown' });
      expect(input).toHaveAttribute('aria-activedescendant', 'test-option-0');

      fireEvent.keyDown(input, { key: 'ArrowDown' });
      expect(input).toHaveAttribute('aria-activedescendant', 'test-option-1');

      fireEvent.keyDown(input, { key: 'ArrowUp' });
      expect(input).toHaveAttribute('aria-activedescendant', 'test-option-0');
    });

    it('removes aria-activedescendant when listbox closes', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value="ap"
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole('combobox');

      fireEvent.keyDown(input, { key: 'ArrowDown' });
      expect(input).toHaveAttribute('aria-activedescendant', 'test-option-0');

      fireEvent.keyDown(input, { key: 'Escape' });
      expect(input).not.toHaveAttribute('aria-activedescendant');
    });

    it('aria-activedescendant matches selected option ID', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value="ap"
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole('combobox');
      fireEvent.keyDown(input, { key: 'ArrowDown' });

      const activeId = input.getAttribute('aria-activedescendant');
      const activeOption = screen.getAllByRole('option')[0];

      expect(activeId).toBe(activeOption.id);
    });
  });

  describe('Suggestions Display', () => {
    it('does not show listbox when input is empty', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value=""
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('does not show listbox when below minCharsForSuggestions', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value="a"
          options={mockOptions}
          onChange={mockOnChange}
          minCharsForSuggestions={2}
        />,
      );

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('shows listbox when meeting minCharsForSuggestions', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value="ap"
          options={mockOptions}
          onChange={mockOnChange}
          minCharsForSuggestions={2}
        />,
      );

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('displays all options', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value="ap"
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('Apricot')).toBeInTheDocument();
      expect(screen.getByText('Banana')).toBeInTheDocument();
    });

    it('limits displayed options to maxDisplayed', () => {
      const manyOptions = Array.from({ length: 20 }, (_, i) => ({
        value: `option-${i}`,
        label: `Option ${i}`,
      }));

      render(
        <Combobox
          id="test"
          label="Fruit"
          value="opt"
          options={manyOptions}
          onChange={mockOnChange}
          maxDisplayed={5}
        />,
      );

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(5);
    });

    it('hides listbox when value exactly matches an option', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value="apple"
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('hides listbox when no options available', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value="xyz"
          options={[]}
          onChange={mockOnChange}
        />,
      );

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('calls onChange when typing', async () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value=""
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole('combobox');
      await userEvent.type(input, 'app');

      expect(mockOnChange).toHaveBeenCalledTimes(3);
      expect(mockOnChange).toHaveBeenNthCalledWith(1, 'a');
      expect(mockOnChange).toHaveBeenNthCalledWith(2, 'p');
      expect(mockOnChange).toHaveBeenNthCalledWith(3, 'p');
    });

    it('selects option on click', async () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value="ap"
          options={mockOptions}
          onChange={mockOnChange}
          onSelect={mockOnSelect}
        />,
      );

      fireEvent.click(screen.getByText('Apple'));

      expect(mockOnChange).toHaveBeenCalledWith('apple');
      expect(mockOnSelect).toHaveBeenCalledWith('apple');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('refocuses input after selection', async () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value="ap"
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole('combobox');
      fireEvent.click(screen.getByText('Apple'));

      expect(input).toHaveFocus();
    });
  });

  describe('Keyboard Navigation', () => {
    it('navigates down with ArrowDown', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value="ap"
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole('combobox');
      fireEvent.keyDown(input, { key: 'ArrowDown' });

      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('navigates up with ArrowUp', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value="ap"
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole('combobox');
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowUp' });

      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('does not navigate below first item', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value="ap"
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole('combobox');
      fireEvent.keyDown(input, { key: 'ArrowUp' });

      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('does not navigate beyond last item', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value="ap"
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole('combobox');
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowDown' });

      const options = screen.getAllByRole('option');
      expect(options[2]).toHaveAttribute('aria-selected', 'true');
    });

    it('selects option with Enter key', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value="ap"
          options={mockOptions}
          onChange={mockOnChange}
          onSelect={mockOnSelect}
        />,
      );

      const input = screen.getByRole('combobox');
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(mockOnChange).toHaveBeenCalledWith('apple');
      expect(mockOnSelect).toHaveBeenCalledWith('apple');
    });

    it('does not select when no item is highlighted', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value="a"
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole('combobox');
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(mockOnChange).not.toHaveBeenCalledWith('apple');
    });

    it('closes listbox with Escape key', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value="ap"
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole('combobox');
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      fireEvent.keyDown(input, { key: 'Escape' });

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('ignores keyboard navigation when listbox is closed', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value=""
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole('combobox');
      fireEvent.keyDown(input, { key: 'ArrowDown' });

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('Validation Styling', () => {
    it('applies valid class when isValid returns true', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value="apple"
          options={mockOptions}
          onChange={mockOnChange}
          isValid={(val) => val === 'apple'}
        />,
      );

      const input = screen.getByRole('combobox');
      expect(input.className).toMatch(/inputValid/);
    });

    it('does not apply valid class when isValid returns false', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value="xyz"
          options={mockOptions}
          onChange={mockOnChange}
          isValid={(val) => val === 'apple'}
        />,
      );

      const input = screen.getByRole('combobox');
      expect(input.className).not.toMatch(/inputValid/);
    });

    it('does not apply valid class when isValid is not provided', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value="apple"
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole('combobox');
      expect(input.className).not.toMatch(/inputValid/);
    });
  });

  describe('Custom className', () => {
    it('applies custom className to input', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value=""
          options={mockOptions}
          onChange={mockOnChange}
          className="custom-class"
        />,
      );

      const input = screen.getByRole('combobox');
      expect(input.className).toContain('custom-class');
    });
  });

  describe('Focus Management', () => {
    it('maintains focus on input after option selection', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value="ap"
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole('combobox');

      fireEvent.click(screen.getByText('Apple'));

      expect(input).toHaveFocus();
    });

    it('maintains focus on input after keyboard selection', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value="ap"
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole('combobox');
      input.focus();

      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(input).toHaveFocus();
    });

    it('scrolls highlighted option into view', () => {
      const manyOptions = Array.from({ length: 20 }, (_, i) => ({
        value: `option-${i}`,
        label: `Option ${i}`,
      }));

      render(
        <Combobox
          id="test"
          label="Items"
          value="opt"
          options={manyOptions}
          onChange={mockOnChange}
          maxDisplayed={20}
        />,
      );

      const input = screen.getByRole('combobox');
      const options = screen.getAllByRole('option');

      options.forEach((option) => {
        option.scrollIntoView = vi.fn();
      });

      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowDown' });

      expect(options[4].scrollIntoView).toHaveBeenCalledWith({
        block: 'nearest',
        behavior: 'smooth',
      });
    });

    it('does not scroll when listbox is closed', () => {
      render(
        <Combobox
          id="test"
          label="Fruit"
          value=""
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole('combobox');

      // Try to navigate when closed
      fireEvent.keyDown(input, { key: 'ArrowDown' });

      // No options rendered, so no scrolling
      expect(screen.queryByRole('option')).not.toBeInTheDocument();
    });

    it('handles scrolling for first and last options', () => {
      const threeOptions = [
        { value: 'Apple', label: 'Apple' },
        { value: 'Appricot', label: 'Appricot' },
        { value: 'App', label: 'App' },
      ];

      render(
        <Combobox
          id="test"
          label="Items"
          value="ap"
          options={threeOptions}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole('combobox');
      const options = screen.getAllByRole('option');

      options.forEach((option) => {
        option.scrollIntoView = vi.fn();
      });

      // Navigate to first
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      expect(options[0].scrollIntoView).toHaveBeenCalled();

      // Navigate to last
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      expect(options[2].scrollIntoView).toHaveBeenCalled();
    });
  });
});
