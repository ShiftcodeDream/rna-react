import './App.css';

import { Toast } from 'primereact/toast';

import "primereact/resources/themes/lara-light-teal/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import 'primeflex/primeflex.css';
import { useRef, useState } from 'react';

import SearchCriteria from './components/SearchCriteria';

function App() {
  const toastRef = useRef();
  const [searchByName, setSearchByName] = useState('');

  const doSearch = (criteria) => {
    setSearchByName(criteria);
    console.log("On recherche " + criteria);
  }

  return (
    <div className="App">
      <Toast ref={toastRef} />
      <h1>Registre National des Associations</h1>
      <SearchCriteria onSubmit={c => doSearch(c)} />
    </div>
  );
}

export default App;
