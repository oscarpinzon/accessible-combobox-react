import { CityField } from '@/components/CityField';
import { StatusBar } from '@/components/StatusBar';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/hooks/useCities');

import { useCities } from '@/hooks/useCities';

const mockUseCities = vi.mocked(useCities);

// Test component that combines CityField + StatusBar
const CitySearchDemo = () => {
  const [status, setStatus] = useState<string>('empty');

  return (
    <div>
      <StatusBar status={status} />
      <CityField
        label="Canadian Cities"
        onCityChange={() => {}}
        onStatusChange={setStatus}
      />
    </div>
  );
};

describe('City Search Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Complete user flows', () => {
    it('completes full search and selection flow', async () => {
      const user = userEvent.setup();

      // Start with empty
      mockUseCities.mockReturnValue({
        cities: [],
        loading: false,
        error: null,
      });

      render(<CitySearchDemo />);

      // Initial state
      expect(screen.getByText(/empty/i)).toBeInTheDocument();

      const input = screen.getByLabelText('Canadian Cities');

      mockUseCities.mockReturnValue({
        cities: ['Vancouver', 'Victoria'],
        loading: false,
        error: null,
      });

      await user.type(input, 'va');

      // Should show suggestion count
      await waitFor(() => {
        expect(
          screen.getByText(/va \(2 suggestions available\)/i),
        ).toBeInTheDocument();
      });

      // Listbox should be visible
      const listbox = screen.getByRole('listbox');
      expect(listbox).toBeInTheDocument();

      // Options should be visible
      expect(
        screen.getByRole('option', { name: 'Vancouver' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Victoria' }),
      ).toBeInTheDocument();

      // Navigate with arrow key
      await user.keyboard('{ArrowDown}');

      // First option should be selected
      await waitFor(() => {
        expect(
          screen.getByRole('option', { name: 'Vancouver' }),
        ).toHaveAttribute('aria-selected', 'true');
      });

      // Select with Enter
      await user.keyboard('{Enter}');

      // Should show valid status
      await waitFor(() => {
        expect(screen.getByText(/valid/i)).toBeInTheDocument();
      });

      // Listbox should close
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

      // Input should have the selected value
      expect(input).toHaveValue('Vancouver');
    });

    it('handles no results gracefully', async () => {
      const user = userEvent.setup();

      mockUseCities.mockReturnValue({
        cities: [],
        loading: false,
        error: null,
      });

      render(<CitySearchDemo />);

      const input = screen.getByLabelText('Canadian Cities');
      await user.type(input, 'xyz');

      // Should show no results status
      await waitFor(() => {
        expect(screen.getByText(/no results/i)).toBeInTheDocument();
      });

      // Should show error message
      expect(screen.getByRole('alert')).toHaveTextContent(/no cities found/i);

      // Listbox should not appear
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('handles loading state correctly', async () => {
      const user = userEvent.setup();

      // Start with loading
      mockUseCities.mockReturnValue({
        cities: [],
        loading: true,
        error: null,
      });

      render(<CitySearchDemo />);

      const input = screen.getByLabelText(/Canadian Cities/i);
      await user.type(input, 'to');

      // Should show loading status in the StatusBar
      await waitFor(() => {
        const statusBar = screen.getByRole('status');
        expect(statusBar).toHaveTextContent(/loading\.\.\./i);
      });

      // Input should have aria-busy
      expect(input).toHaveAttribute('aria-busy', 'true');

      // No listbox while loading
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('handles network errors', async () => {
      const user = userEvent.setup();

      mockUseCities.mockReturnValue({
        cities: [],
        loading: false,
        error: new Error('Network error'),
      });

      render(<CitySearchDemo />);

      const input = screen.getByLabelText('Canadian Cities');
      await user.type(input, 'va');

      // Should show error status
      await waitFor(() => {
        expect(screen.getByText(/error loading cities/i)).toBeInTheDocument();
      });

      // Should show error message in component
      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toHaveTextContent(/failed to load cities/i);
      });
    });
  });

  describe('Accessibility features', () => {
    it('announces status changes via live region', async () => {
      const user = userEvent.setup();

      mockUseCities.mockReturnValue({
        cities: ['Vancouver', 'Victoria'],
        loading: false,
        error: null,
      });

      render(<CitySearchDemo />);

      const input = screen.getByLabelText('Canadian Cities');

      // Live region should exist with polite
      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');

      // Type to trigger status change
      await user.type(input, 'va');

      // Status should update
      await waitFor(() => {
        expect(liveRegion).toHaveTextContent(/va \(2 suggestions available\)/i);
      });
    });

    it('has proper ARIA attributes throughout interaction', async () => {
      const user = userEvent.setup();

      mockUseCities.mockReturnValue({
        cities: ['Vancouver'],
        loading: false,
        error: null,
      });

      render(<CitySearchDemo />);

      const input = screen.getByLabelText('Canadian Cities');

      // Initial ARIA
      expect(input).toHaveAttribute('role', 'combobox');
      expect(input).toHaveAttribute('aria-autocomplete', 'list');
      expect(input).toHaveAttribute('aria-expanded', 'false');

      // Type to open listbox
      await user.type(input, 'va');

      await waitFor(() => {
        expect(input).toHaveAttribute('aria-expanded', 'true');
      });

      const listbox = screen.getByRole('listbox');
      const listboxId = listbox.getAttribute('id');

      expect(input).toHaveAttribute('aria-controls', listboxId);

      // Navigate to option
      await user.keyboard('{ArrowDown}');

      await waitFor(() => {
        const option = screen.getByRole('option');
        const optionId = option.getAttribute('id');
        expect(input).toHaveAttribute('aria-activedescendant', optionId);
      });
    });
  });
});
