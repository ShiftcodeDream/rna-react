import './App.css';

import { Button } from 'primereact/button';

import "primereact/resources/themes/lara-light-teal/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import 'primeflex/primeflex.css';

function App() {
  return (
    <div className="App">
      <Button icon="pi pi-check" label="Hello !"></Button>
    </div>
  );
}

export default App;
