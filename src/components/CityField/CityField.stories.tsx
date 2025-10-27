import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { CityField } from './CityField';

const meta = {
  title: 'App/CityField',
  component: CityField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A specialized combobox for searching Canadian cities. Demonstrates real-world integration with the useCities hook and progressive data fetching.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CityField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Canadian City',
    onStatusChange: () => {},
  },
  render: () => {
    const [city, setCity] = useState('');
    const [status, setStatus] = useState('empty');

    return (
      <div style={{ width: '400px' }}>
        <CityField
          label="Canadian City"
          onCityChange={setCity}
          onStatusChange={setStatus}
        />

        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#f5f5f5',
            borderRadius: '4px',
          }}
        >
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Selected City:</strong> {city || '(none)'}
          </div>
          <div>
            <strong>Status:</strong> {status}
          </div>
        </div>

        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#e3f2fd',
            borderRadius: '4px',
            fontSize: '0.875rem',
          }}
        >
          <strong>Try typing:</strong>
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
            <li>"van" → Vancouver suggestions</li>
            <li>"tor" → Toronto suggestions</li>
            <li>"xyz" → No results error</li>
          </ul>
        </div>
      </div>
    );
  },
};
