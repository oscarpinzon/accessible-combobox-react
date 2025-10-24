import { useCities } from '@/hooks/useCities';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { CityField } from './CityField';

// Mock the useCities hook
vi.mock('@/hooks/useCities');
const mockUseCities = vi.mocked(useCities);

describe('CityField Accessibility', () => {
  it('should have no accessibility violations with cities loaded', async () => {
    mockUseCities.mockReturnValue({
      cities: ['Vancouver', 'Victoria', 'Vernon'],
      loading: false,
      error: null,
    });

    const { container } = render(
      <CityField
        label="Canadian Cities"
        onCityChange={vi.fn()}
        onStatusChange={vi.fn()}
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations in loading state', async () => {
    mockUseCities.mockReturnValue({
      cities: [],
      loading: true,
      error: null,
    });

    const { container } = render(
      <CityField
        label="Canadian Cities"
        onCityChange={vi.fn()}
        onStatusChange={vi.fn()}
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations in error state', async () => {
    mockUseCities.mockReturnValue({
      cities: [],
      loading: false,
      error: new Error('Network error'),
    });

    const { container } = render(
      <CityField
        label="Canadian Cities"
        onCityChange={vi.fn()}
        onStatusChange={vi.fn()}
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations with no results', async () => {
    mockUseCities.mockReturnValue({
      cities: [],
      loading: false,
      error: null,
    });

    const { container } = render(
      <CityField
        label="Canadian Cities"
        onCityChange={vi.fn()}
        onStatusChange={vi.fn()}
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
