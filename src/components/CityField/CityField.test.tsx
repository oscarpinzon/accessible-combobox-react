import { useCities } from '@/hooks/useCities';
import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CityField } from './CityField';

vi.mock('@/hooks/useCities');

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

  describe('Integration with useCities hook', () => {
    it('passes cities to Combobox as options', async () => {
      mockUseCities.mockReturnValue({
        cities: ['Vancouver', 'Victoria'],
        loading: false,
        error: null,
      });

      render(<CityField label="City" onStatusChange={mockOnStatusChange} />);

      const input = screen.getByLabelText('City');
      await userEvent.type(input, 'van');

      await waitFor(() => {
        expect(screen.getByText('Vancouver')).toBeInTheDocument();
        expect(screen.getByText('Victoria')).toBeInTheDocument();
      });
    });

    it('calls useCities with current input value', async () => {
      render(<CityField label="City" onStatusChange={mockOnStatusChange} />);

      const input = screen.getByLabelText('City');
      await userEvent.type(input, 'tor');

      expect(mockUseCities).toHaveBeenCalledWith('tor');
    });
  });

  describe('City selection', () => {
    it('calls onCityChange when city is selected', async () => {
      mockUseCities.mockReturnValue({
        cities: ['Toronto'],
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

      const input = screen.getByLabelText('City');
      await userEvent.type(input, 'tor');

      await waitFor(() => {
        expect(screen.getByText('Toronto')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Toronto'));

      expect(mockOnCityChange).toHaveBeenCalledWith('Toronto');
    });

    it('works without onCityChange callback', async () => {
      mockUseCities.mockReturnValue({
        cities: ['Toronto'],
        loading: false,
        error: null,
      });

      render(<CityField label="City" onStatusChange={mockOnStatusChange} />);

      const input = screen.getByLabelText('City') as HTMLInputElement;
      await userEvent.type(input, 'tor');

      await waitFor(() => {
        expect(screen.getByText('Toronto')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Toronto'));

      expect(input.value).toBe('Toronto');
    });
  });

  describe('Status updates', () => {
    it('sets status to "empty" initially', () => {
      render(<CityField label="City" onStatusChange={mockOnStatusChange} />);

      expect(mockOnStatusChange).toHaveBeenCalledWith('empty');
    });

    it('sets status to "typing..." when input has text but no matches', async () => {
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

    it('sets status with suggestion count', async () => {
      mockUseCities.mockReturnValue({
        cities: ['Toronto', 'Torrance'],
        loading: false,
        error: null,
      });

      render(<CityField label="City" onStatusChange={mockOnStatusChange} />);

      const input = screen.getByLabelText('City');
      await userEvent.type(input, 'tor');

      await waitFor(() => {
        expect(mockOnStatusChange).toHaveBeenCalledWith('tor (2 suggestions)');
      });
    });

    it('shows "X of Y" when exceeding MAX_SUGGESTIONS', async () => {
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

    it('sets status to "valid" when exact match found', async () => {
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
  });

  describe('Validation styling', () => {
    it('applies valid styling when city matches', async () => {
      mockUseCities.mockReturnValue({
        cities: ['Vancouver'],
        loading: false,
        error: null,
      });

      render(<CityField label="City" onStatusChange={mockOnStatusChange} />);

      const input = screen.getByLabelText('City');
      await userEvent.type(input, 'Vancouver');

      await waitFor(() => {
        expect(input.className).toMatch(/inputValid/);
      });
    });
  });

  describe('Combobox configuration', () => {
    it('limits displayed options to 10', async () => {
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

    it('requires 2 characters before showing suggestions', async () => {
      mockUseCities.mockReturnValue({
        cities: ['Vancouver'],
        loading: false,
        error: null,
      });

      render(<CityField label="City" onStatusChange={mockOnStatusChange} />);

      const input = screen.getByLabelText('City');
      await userEvent.type(input, 'v');

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

      await userEvent.type(input, 'a');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });
  });
});
