import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { StatusBar } from './StatusBar';

describe('StatusBar Accessibility', () => {
  it('should have no accessibility violations with empty status', async () => {
    const { container } = render(<StatusBar status="" />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations with suggestion count', async () => {
    const { container } = render(
      <StatusBar status="va (5 suggestions available)" />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations with loading status', async () => {
    const { container } = render(<StatusBar status="loading cities..." />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations with error status', async () => {
    const { container } = render(
      <StatusBar status="error: failed to load cities" />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations with selected city', async () => {
    const { container } = render(
      <StatusBar status="selected: Vancouver, British Columbia" />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations with validation message', async () => {
    const { container } = render(<StatusBar status="valid city selected" />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
