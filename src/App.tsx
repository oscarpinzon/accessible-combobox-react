import { useState } from 'react';
import './App.css';
import { CityField } from './components/CityField';
import { StatusBar } from './components/StatusBar';

export default function App() {
  const [status, setStatus] = useState<string>('empty');

  const handleCityChange = (city: string) => {
    console.log('Selected city:', city);
  };

  return (
    <div className="app-container">
      <main>
        <h1>Accessible Combobox (React + TS)</h1>

        <CityField
          label="City"
          onCityChange={handleCityChange}
          onStatusChange={setStatus}
        />
      </main>

      <StatusBar status={status} />
    </div>
  );
}
