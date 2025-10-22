import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCities } from '../hooks/useCities';
import { CityField } from './CityField';

vi.mock('../hooks/useCities');

const mockUseCities = vi.mocked(useCities);

describe('CityField', () => {
  const mockOnCityChange = vi.fn();
  const mockOnStatusChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCities.mockReturnValue({
      cities: [],
      loading: false,
      error: null,
    });
  });

  describe('Rendering', () => {
    it('renders with label', () => {
      render(
        <CityField
          label="City"
          onCityChange={mockOnCityChange}
          onStatusChange={mockOnStatusChange}
        />,
      );

      expect(screen.getByLabelText('City')).toBeInTheDocument();
    });

    it('renders input field', () => {
      render(<CityField label="City" onStatusChange={mockOnStatusChange} />);

      const input = screen.getByLabelText('City');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('renders with correct input id', () => {
      render(<CityField label="City" onStatusChange={mockOnStatusChange} />);

      const input = screen.getByLabelText('City');
      expect(input).toHaveAttribute('id', 'city-input');
    });
  });

  describe('Suggestions Display', () => {
    it('does not show suggestions when input is empty', () => {
      render(<CityField label="City" onStatusChange={mockOnStatusChange} />);

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('does not show suggestions when input is less than 2 characters', async () => {
      render(<CityField label="City" onStatusChange={mockOnStatusChange} />);

      const input = screen.getByLabelText('City');
      await userEvent.type(input, 'v');

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('shows suggestions when input is 2+ characters', async () => {
      mockUseCities.mockReturnValue({
        cities: ['Vancouver', 'North Vancouver'],
        loading: false,
        error: null,
      });

      render(<CityField label="City" onStatusChange={mockOnStatusChange} />);

      const input = screen.getByLabelText('City');
      await userEvent.type(input, 'van');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
        expect(screen.getByText('Vancouver')).toBeInTheDocument();
        expect(screen.getByText('North Vancouver')).toBeInTheDocument();
      });
    });

    it('hides suggestions when input exactly matches a city', async () => {
      mockUseCities.mockReturnValue({
        cities: ['Vancouver'],
        loading: false,
        error: null,
      });

      render(<CityField label="City" onStatusChange={mockOnStatusChange} />);

      const input = screen.getByLabelText('City');
      await userEvent.type(input, 'Vancouver');

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('limits displayed suggestions to MAX_SUGGESTIONS', async () => {
      const manyCities = Array.from({ length: 20 }, (_, i) => `City ${i}`);
      mockUseCities.mockReturnValue({
        cities: manyCities,
        loading: false,
        error: null,
      });

      render(<CityField label="City" onStatusChange={mockOnStatusChange} />);

      const input = screen.getByLabelText('City');
      await userEvent.type(input, 'ci');

      await waitFor(() => {
        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(10);
      });
    });

    it('shows suggestions case-insensitively', async () => {
      mockUseCities.mockReturnValue({
        cities: ['Vancouver'],
        loading: false,
        error: null,
      });

      render(<CityField label="City" onStatusChange={mockOnStatusChange} />);

      const input = screen.getByLabelText('City');
      await userEvent.type(input, 'VAN');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
        expect(screen.getByText('Vancouver')).toBeInTheDocument();
      });
    });
  });

  describe('City Selection', () => {
    it('selects city on click', async () => {
      mockUseCities.mockReturnValue({
        cities: ['Vancouver'],
        loading: false,
        error: null,
      });

      render(
        <CityField
          label="City"
          onCityChange={mockOnCityChange}
          onStatusChange={mockOnStatusChange}
        />,
      );

      const input = screen.getByLabelText('City') as HTMLInputElement;
      await userEvent.type(input, 'van');

      await waitFor(() => {
        expect(screen.getByText('Vancouver')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Vancouver'));

      expect(input.value).toBe('Vancouver');
      expect(mockOnCityChange).toHaveBeenCalledWith('Vancouver');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('calls onCityChange when typing', async () => {
      render(
        <CityField
          label="City"
          onCityChange={mockOnCityChange}
          onStatusChange={mockOnStatusChange}
        />,
      );

      const input = screen.getByLabelText('City');
      await userEvent.type(input, 'van');

      expect(mockOnCityChange).toHaveBeenCalledWith('v');
      expect(mockOnCityChange).toHaveBeenCalledWith('va');
      expect(mockOnCityChange).toHaveBeenCalledWith('van');
    });

    it('refocuses input after city selection', async () => {
      mockUseCities.mockReturnValue({
        cities: ['Vancouver'],
        loading: false,
        error: null,
      });

      render(<CityField label="City" onStatusChange={mockOnStatusChange} />);

      const input = screen.getByLabelText('City');
      await userEvent.type(input, 'van');

      await waitFor(() => {
        expect(screen.getByText('Vancouver')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Vancouver'));

      expect(input).toHaveFocus();
    });
  });

  describe('Keyboard Navigation', () => {
    beforeEach(() => {
      mockUseCities.mockReturnValue({
        cities: ['Vancouver', 'Victoria', 'Vernon'],
        loading: false,
        error: null,
      });
    });

    it('navigates down with ArrowDown', async () => {
      render(<CityField label="City" onStatusChange={mockOnStatusChange} />);

      const input = screen.getByLabelText('City');
      await userEvent.type(input, 've');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      fireEvent.keyDown(input, { key: 'ArrowDown' });

      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveClass('selected');
      expect(options[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('navigates up with ArrowUp', async () => {
      render(<CityField label="City" onStatusChange={mockOnStatusChange} />);

      const input = screen.getByLabelText('City');
      await userEvent.type(input, 've');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowUp' });

      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveClass('selected');
    });

    it('selects city with Enter key', async () => {
      render(
        <CityField
          label="City"
          onCityChange={mockOnCityChange}
          onStatusChange={mockOnStatusChange}
        />,
      );

      const input = screen.getByLabelText('City') as HTMLInputElement;
      await userEvent.type(input, 've');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(input.value).toBe('Vancouver');
      expect(mockOnCityChange).toHaveBeenCalledWith('Vancouver');
    });

    it('closes suggestions with Escape key', async () => {
      render(<CityField label="City" onStatusChange={mockOnStatusChange} />);

      const input = screen.getByLabelText('City');
      await userEvent.type(input, 'van');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      fireEvent.keyDown(input, { key: 'Escape' });

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('does not navigate beyond last item', async () => {
      render(<CityField label="City" onStatusChange={mockOnStatusChange} />);

      const input = screen.getByLabelText('City');
      await userEvent.type(input, 've');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowDown' });

      const options = screen.getAllByRole('option');
      expect(options[2]).toHaveClass('selected');
    });

    it('does not navigate above first item', async () => {
      render(<CityField label="City" onStatusChange={mockOnStatusChange} />);

      const input = screen.getByLabelText('City');
      await userEvent.type(input, 've');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      fireEvent.keyDown(input, { key: 'ArrowUp' });

      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveClass('selected');
    });

    it('ignores keyboard navigation when suggestions are hidden', async () => {
      render(<CityField label="City" onStatusChange={mockOnStatusChange} />);

      const input = screen.getByLabelText('City');
      fireEvent.keyDown(input, { key: 'ArrowDown' });

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('does not select on Enter when no item is selected', async () => {
      render(<CityField label="City" onStatusChange={mockOnStatusChange} />);

      const input = screen.getByLabelText('City') as HTMLInputElement;
      await userEvent.type(input, 've');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      fireEvent.keyDown(input, { key: 'Enter' });

      expect(input.value).toBe('ve');
    });
  });

  describe('Status Updates', () => {
    it('sets status to "empty" when input is empty', () => {
      render(<CityField label="City" onStatusChange={mockOnStatusChange} />);

      expect(mockOnStatusChange).toHaveBeenCalledWith('empty');
    });

    it('sets status to "typing..." when input has text but no suggestions', async () => {
      mockUseCities.mockReturnValue({
        cities: [],
        loading: false,
        error: null,
      });

      render(<CityField label="City" onStatusChange={mockOnStatusChange} />);

      const input = screen.getByLabelText('City');
      await userEvent.type(input, 'xyz');

      await waitFor(() => {
        expect(mockOnStatusChange).toHaveBeenCalledWith('typing...');
      });
    });

    it('sets status with suggestion count when showing suggestions', async () => {
      mockUseCities.mockReturnValue({
        cities: ['Toronto', 'Metro Toronto'],
        loading: false,
        error: null,
      });

      render(<CityField label="City" onStatusChange={mockOnStatusChange} />);

      const input = screen.getByLabelText('City');
      await userEvent.type(input, 'toro');

      await waitFor(() => {
        expect(mockOnStatusChange).toHaveBeenCalledWith('toro (2 suggestions)');
      });
    });

    it('sets status to "valid" when input matches a city', async () => {
      mockUseCities.mockReturnValue({
        cities: ['Vancouver'],
        loading: false,
        error: null,
      });

      render(<CityField label="City" onStatusChange={mockOnStatusChange} />);

      const input = screen.getByLabelText('City');
      await userEvent.type(input, 'Vancouver');

      await waitFor(() => {
        expect(mockOnStatusChange).toHaveBeenCalledWith('valid');
      });
    });

    it('shows "X of Y suggestions" when exceeding MAX_SUGGESTIONS', async () => {
      const manyCities = Array.from({ length: 15 }, (_, i) => `City ${i}`);
      mockUseCities.mockReturnValue({
        cities: manyCities,
        loading: false,
        error: null,
      });

      render(<CityField label="City" onStatusChange={mockOnStatusChange} />);

      const input = screen.getByLabelText('City');
      await userEvent.type(input, 'ci');

      await waitFor(() => {
        expect(mockOnStatusChange).toHaveBeenCalledWith(
          'ci (10 of 15 suggestions)',
        );
      });
    });
  });

  describe('Styling', () => {
    it('applies valid class when input matches a city', async () => {
      mockUseCities.mockReturnValue({
        cities: ['Vancouver'],
        loading: false,
        error: null,
      });

      render(<CityField label="City" onStatusChange={mockOnStatusChange} />);

      const input = screen.getByLabelText('City');
      await userEvent.type(input, 'Vancouver');

      await waitFor(() => {
        expect(input).toHaveClass('valid');
      });
    });

    it('does not apply valid class for non-matching input', async () => {
      mockUseCities.mockReturnValue({
        cities: ['Vancouver'],
        loading: false,
        error: null,
      });

      render(<CityField label="City" onStatusChange={mockOnStatusChange} />);

      const input = screen.getByLabelText('City');
      await userEvent.type(input, 'van');

      expect(input).not.toHaveClass('valid');
    });
  });

  describe('Optional Props', () => {
    it('works without onCityChange prop', async () => {
      mockUseCities.mockReturnValue({
        cities: ['Vancouver'],
        loading: false,
        error: null,
      });

      render(<CityField label="City" onStatusChange={mockOnStatusChange} />);

      const input = screen.getByLabelText('City');
      await userEvent.type(input, 'van');

      expect(input).toHaveValue('van');
    });
  });
});
