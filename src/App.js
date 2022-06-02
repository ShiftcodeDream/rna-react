import './App.css';

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';

import "primereact/resources/themes/lara-light-teal/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import 'primeflex/primeflex.css';
import { useRef, useState } from 'react';

function App() {
  const [texte, setTexte] = useState('');
  const toastRef = useRef();

  const sayHello = () => {
    if(texte)
      toastRef.current.show({severity: 'info', summary: 'Salut', detail: texte});
    else
      toastRef.current.show({severity: 'error', summary: 'Erreur', detail: 'texte manquant'});
  }
  return (
    <div className="App">
      <Toast ref={toastRef} />
      <InputText value={texte} onChange={(e) => setTexte(e.target.value)} />
      <Button icon="pi pi-check" label="Hello !" onClick={sayHello} />
    </div>
  );
}

export default App;
