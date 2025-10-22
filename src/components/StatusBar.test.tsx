import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusBar } from './StatusBar';

describe('StatusBar', () => {
  it('renders with empty status', () => {
    render(<StatusBar status="empty" />);

    expect(screen.getByTestId('status-bar')).toBeInTheDocument();
    expect(screen.getByText('status: empty')).toBeInTheDocument();
  });

  it('renders with typing status', () => {
    render(<StatusBar status="typing..." />);

    expect(screen.getByText('status: typing...')).toBeInTheDocument();
  });

  it('renders with valid status', () => {
    render(<StatusBar status="valid" />);

    expect(screen.getByText('status: valid')).toBeInTheDocument();
  });

  it('renders with suggestion count status', () => {
    render(<StatusBar status="van (3 suggestions)" />);

    expect(screen.getByText('status: van (3 suggestions)')).toBeInTheDocument();
  });

  it('updates when status prop changes', () => {
    const { rerender } = render(<StatusBar status="empty" />);

    expect(screen.getByText('status: empty')).toBeInTheDocument();

    rerender(<StatusBar status="typing..." />);

    expect(screen.queryByText('status: empty')).not.toBeInTheDocument();
    expect(screen.getByText('status: typing...')).toBeInTheDocument();
  });

  it('has correct CSS class', () => {
    render(<StatusBar status="test" />);

    const statusBar = screen.getByTestId('status-bar');
    expect(statusBar).toHaveClass('status-bar');
  });

  it('renders with no suggestions status', () => {
    render(<StatusBar status="no suggestions" />);

    expect(screen.getByText('status: no suggestions')).toBeInTheDocument();
  });

  it('renders with special characters in status', () => {
    render(<StatusBar status="test & special <chars>" />);

    expect(
      screen.getByText('status: test & special <chars>'),
    ).toBeInTheDocument();
  });

  it('renders with empty string status', () => {
    render(<StatusBar status="" />);

    expect(screen.getByTestId('status-bar')).toBeInTheDocument();
    expect(screen.getByText('status:')).toBeInTheDocument();
  });

  it('renders with numeric status', () => {
    render(<StatusBar status="123" />);

    expect(screen.getByText('status: 123')).toBeInTheDocument();
  });

  it('contains a span element for status text', () => {
    render(<StatusBar status="test" />);

    const span = screen.getByText('status: test');
    expect(span.tagName).toBe('SPAN');
  });

  it('renders with long status text', () => {
    const longStatus =
      'This is a very long status message that might wrap to multiple lines';
    render(<StatusBar status={longStatus} />);

    expect(screen.getByText(`status: ${longStatus}`)).toBeInTheDocument();
  });
});
