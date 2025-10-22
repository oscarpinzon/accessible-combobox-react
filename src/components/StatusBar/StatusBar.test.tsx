import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusBar } from './StatusBar';

describe('StatusBar', () => {
  it('displays the provided status message', () => {
    render(<StatusBar status="3 suggestions available" />);
    expect(
      screen.getByText('status: 3 suggestions available'),
    ).toBeInTheDocument();
  });

  it('updates when status changes', () => {
    const { rerender } = render(<StatusBar status="typing..." />);
    expect(screen.getByText('status: typing...')).toBeInTheDocument();

    rerender(<StatusBar status="valid" />);
    expect(screen.getByText('status: valid')).toBeInTheDocument();
  });

  it('handles empty status', () => {
    render(<StatusBar status="" />);
    expect(screen.getByTestId('status-bar')).toBeInTheDocument();
  });
});
