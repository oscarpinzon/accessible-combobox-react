import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Combobox } from './Combobox';

describe('Combobox Accessibility', () => {
  it('should have no accessibility violations in default state', async () => {
    const { container } = render(
      <Combobox
        id="test"
        label="Test Label"
        value=""
        options={[{ value: 'test', label: 'Test' }]}
        onChange={() => {}}
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations with suggestions open', async () => {
    const { container } = render(
      <Combobox
        id="test"
        label="Test Label"
        value="te"
        options={[
          { value: 'test1', label: 'Test 1' },
          { value: 'test2', label: 'Test 2' },
        ]}
        onChange={() => {}}
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations in error state', async () => {
    const { container } = render(
      <Combobox
        id="test"
        label="Test Label"
        value="xyz"
        options={[]}
        onChange={() => {}}
        errorText="No results found"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations in loading state', async () => {
    const { container } = render(
      <Combobox
        id="test"
        label="Test Label"
        value="te"
        options={[]}
        onChange={() => {}}
        isLoading={true}
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations in disabled state', async () => {
    const { container } = render(
      <Combobox
        id="test"
        label="Test Label"
        value="test"
        options={[{ value: 'test', label: 'Test' }]}
        onChange={() => {}}
        disabled={true}
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations in valid state', async () => {
    const { container } = render(
      <Combobox
        id="test"
        label="Test Label"
        value="test"
        options={[{ value: 'test', label: 'Test' }]}
        onChange={() => {}}
        isValid={(v) => v === 'test'}
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
