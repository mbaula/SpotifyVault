import React from 'react';
import { MantineProvider} from '@mantine/core';
import Auth from './Components/Auth';

const App: React.FC = () => {
  return (
    <MantineProvider>
      <Auth />
    </MantineProvider>
  );
};

export default App;
