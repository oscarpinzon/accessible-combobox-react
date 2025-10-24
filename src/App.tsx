import { CityField } from '@/components/CityField';
import { Combobox } from '@/components/Combobox';
import { StatusBar } from '@/components/StatusBar';
import { useState } from 'react';
import styles from './App.module.css';

const mockOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'apricot', label: 'Apricot' },
  { value: 'banana', label: 'Banana' },
];

export default function App() {
  const [status, setStatus] = useState<string>('empty');
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('ap');
  const [value3, setValue3] = useState('xyz');

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Accessible Combobox Demo</h1>

      <div className={styles.realExample}>
        <h2 className={styles.sectionTitle}>
          Interactive Demo: Canadian Cities Search
        </h2>
        <p className={styles.description}>
          Try typing a Canadian city name (e.g., "Vancouver", "Toronto"). Use
          arrow keys to navigate suggestions.
          <br />
          <em style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            (Status displayed above to remain visible while suggestions are
            open)
          </em>
        </p>
        <StatusBar status={status} />
        <CityField label="Canadian Cities" onStatusChange={setStatus} />
      </div>

      <hr className={styles.divider} />

      <div className={styles.statesHeader}>
        <h2 className={styles.showcaseTitle}>Component States</h2>
        <p className={styles.description}>
          Examples of different visual and functional states.
        </p>
      </div>

      <div className={styles.statesShowcase}>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Default State</h3>
          <Combobox
            id="default"
            label="Select a fruit"
            value={value1}
            options={mockOptions}
            onChange={setValue1}
            placeholder="Start typing..."
            helperText="Choose your favorite fruit"
          />
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>With Suggestions</h3>
          <Combobox
            id="suggestions"
            label="Select a fruit"
            value={value2}
            options={mockOptions}
            onChange={setValue2}
            placeholder="Start typing..."
            helperText="Try using arrow keys to navigate"
          />
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Error State</h3>
          <Combobox
            id="error"
            label="Select a fruit"
            value={value3}
            options={[]}
            onChange={setValue3}
            placeholder="Start typing..."
            errorText="No fruits found matching your search"
          />
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Valid State</h3>
          <Combobox
            id="valid"
            label="Select a fruit"
            value="apple"
            options={mockOptions}
            onChange={() => {}}
            isValid={(v) => v === 'apple'}
            helperText="Valid selection!"
          />
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Loading State</h3>
          <Combobox
            id="loading"
            label="Select a fruit"
            value="ap"
            options={[]}
            onChange={() => {}}
            isLoading={true}
            helperText="Searching for fruits..."
          />
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Disabled State</h3>
          <Combobox
            id="disabled"
            label="Select a fruit"
            value="apple"
            options={mockOptions}
            onChange={() => {}}
            disabled={true}
            helperText="This field is disabled"
          />
        </section>
      </div>
    </div>
  );
}
