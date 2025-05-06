// Import global styles
import './App.css';

// Import React hooks (useState is not used here, so it could be removed if unnecessary)
import { useState } from 'react';

// Import the BusStop component from the assets folder
import BusStop from './assets/BusStop';

// This is the main component that renders the BusStop UI
function App() {
  return (
    <>
      {/* Render the BusStop component */}
      <BusStop />
    </>
  );
}

// Export the component so it can be used in index.js or elsewhere
export default App;
