import React from 'react';
import { Button, Card, Input } from '../src/components';
import ITDODesignSystemDemo from './itdo-design-system-demo';
import ColorComparisonDemo from './ColorComparisonDemo';
import '../src/styles/global.css';

const ComponentShowcase = () => {
  const [inputValue, setInputValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleButtonClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        ITDO Design System Components
      </h1>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
          Buttons
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="danger">Danger Button</Button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <Button disabled>Disabled</Button>
          <Button loading onClick={handleButtonClick}>
            {loading ? 'Loading...' : 'Click to Load'}
          </Button>
        </div>
        <div style={{ maxWidth: '300px' }}>
          <Button fullWidth>Full Width Button</Button>
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
          Cards
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <Card variant="elevated">
            <h3 style={{ marginBottom: '0.5rem' }}>Elevated Card</h3>
            <p style={{ margin: 0, color: '#737373' }}>
              This is an elevated card with a subtle shadow effect.
            </p>
          </Card>
          <Card variant="outlined">
            <h3 style={{ marginBottom: '0.5rem' }}>Outlined Card</h3>
            <p style={{ margin: 0, color: '#737373' }}>
              This is an outlined card with a border.
            </p>
          </Card>
          <Card variant="filled">
            <h3 style={{ marginBottom: '0.5rem' }}>Filled Card</h3>
            <p style={{ margin: 0, color: '#737373' }}>
              This is a filled card with a background color.
            </p>
          </Card>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <Card variant="elevated" padding="large" onClick={() => alert('Card clicked!')}>
            <h3 style={{ marginBottom: '0.5rem' }}>Clickable Card</h3>
            <p style={{ margin: 0, color: '#737373' }}>
              This card has large padding and is clickable. Try clicking it!
            </p>
          </Card>
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
          Inputs
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <Input
            label="Default Input"
            placeholder="Enter text..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Input
            label="Required Input"
            placeholder="This field is required"
            required
          />
          <Input
            label="Input with Helper Text"
            placeholder="Enter your email"
            type="email"
            helperText="We'll never share your email with anyone else."
          />
          <Input
            label="Input with Error"
            placeholder="Enter password"
            type="password"
            error="Password must be at least 8 characters long"
          />
          <Input
            label="Disabled Input"
            placeholder="This input is disabled"
            disabled
          />
        </div>
        <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <Input size="small" placeholder="Small input" />
          <Input size="medium" placeholder="Medium input" />
          <Input size="large" placeholder="Large input" />
        </div>
        <div style={{ marginTop: '1rem', maxWidth: '400px' }}>
          <Input
            label="Full Width Input"
            placeholder="This input takes full width"
            fullWidth
          />
        </div>
      </section>
    </div>
  );
};

const App = () => {
  const [viewMode, setViewMode] = React.useState<'components' | 'demo' | 'colors'>('components');

  return (
    <div>
      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#f97316', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.25rem' }}>ITDO Design System</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setViewMode('components')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: viewMode === 'components' ? 'white' : 'rgba(255, 255, 255, 0.2)',
              color: viewMode === 'components' ? '#f97316' : 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Components
          </button>
          <button
            onClick={() => setViewMode('demo')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: viewMode === 'demo' ? 'white' : 'rgba(255, 255, 255, 0.2)',
              color: viewMode === 'demo' ? '#f97316' : 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Full Demo
          </button>
          <button
            onClick={() => setViewMode('colors')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: viewMode === 'colors' ? 'white' : 'rgba(255, 255, 255, 0.2)',
              color: viewMode === 'colors' ? '#f97316' : 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Color Comparison
          </button>
        </div>
      </div>
      {viewMode === 'components' && <ComponentShowcase />}
      {viewMode === 'demo' && <ITDODesignSystemDemo />}
      {viewMode === 'colors' && <ColorComparisonDemo />}
    </div>
  );
};

export default App;