import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Combobox } from './Combobox';

const meta = {
  title: 'Components/Combobox',
  component: Combobox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A fully accessible combobox component with keyboard navigation, screen reader support, and zero axe-core violations.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
    onSelect: { action: 'selected' },
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'demo-combobox',
    label: 'Choose a fruit',
    value: '',
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'orange', label: 'Orange' },
      { value: 'mango', label: 'Mango' },
      { value: 'strawberry', label: 'Strawberry' },
    ],
    onChange: () => {},
    placeholder: 'Type to search...',
    helperText: 'Start typing to filter options',
    minCharsForSuggestions: 0,
  },
};

export const WithValue: Story = {
  args: {
    ...Default.args,
    value: 'banana',
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    value: 'invalid',
    errorText: 'Please select a valid option from the list',
  },
};

export const Valid: Story = {
  args: {
    ...Default.args,
    value: 'apple',
    isValid: () => true,
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const ManyOptions: Story = {
  args: {
    ...Default.args,
    label: 'Choose a country',
    options: [
      { value: 'us', label: 'United States' },
      { value: 'ca', label: 'Canada' },
      { value: 'mx', label: 'Mexico' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'fr', label: 'France' },
      { value: 'de', label: 'Germany' },
      { value: 'es', label: 'Spain' },
      { value: 'it', label: 'Italy' },
      { value: 'jp', label: 'Japan' },
      { value: 'cn', label: 'China' },
      { value: 'in', label: 'India' },
      { value: 'br', label: 'Brazil' },
    ],
    maxDisplayed: 5,
  },
};

export const Interactive: Story = {
  args: {
    ...Default.args,
    minCharsForSuggestions: 2,
  },
  render: () => {
    const [value, setValue] = useState('');
    const [selectedValue, setSelectedValue] = useState('');

    const options = [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'orange', label: 'Orange' },
      { value: 'mango', label: 'Mango' },
      { value: 'strawberry', label: 'Strawberry' },
      { value: 'grape', label: 'Grape' },
      { value: 'watermelon', label: 'Watermelon' },
    ];

    return (
      <div style={{ width: '300px' }}>
        <Combobox
          id="interactive-demo"
          label="Interactive Combobox"
          value={value}
          options={options}
          onChange={setValue}
          onSelect={setSelectedValue}
          placeholder="Type to search fruits..."
          helperText="Start typing to filter options"
        />
        {selectedValue && (
          <div
            style={{
              marginTop: '1rem',
              padding: '0.5rem',
              background: '#f0f0f0',
              borderRadius: '4px',
            }}
          >
            <strong>Selected:</strong> {selectedValue}
          </div>
        )}
      </div>
    );
  },
};
