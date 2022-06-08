import { useRef, useState } from 'react';

// PrimeFaces
import { Toast } from 'primereact/toast';
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import 'primeflex/primeflex.css';
import PrimeFrench from './assets/primefaces-fr';
import { addLocale, locale } from 'primereact/api';

// Leaflet
import 'leaflet/dist/leaflet.css';

// Application
import SearchCriteria from './components/SearchCriteria';
import DisplaySearchResults from './components/DisplaySearchResults'
import RnaService from './services/RnaService'

import './App.css';

function App() {
  addLocale('fr', PrimeFrench);
  locale('fr');
  const toastRef = useRef();
  const [results, setResults] = useState();  // undefined pour ne pas afficher le tableau avant la première requete
  const [loading, setLoading] = useState(false);  // Affichage un sablier pendant le chargement des données

  const doSearch = (criteria) => {
    if(!results)
      setResults([]); // Permet l'affichage du tableau et du sablier dès le lancement de la première recherche
    setLoading(true);
    RnaService(criteria)
    .then(res => {
      setLoading(false);
      setResults(res);
    })
    .catch(err => {
      let msg = null, message = null, codeRetourHttp = err.status ? parseInt(err.status) : 999;
      setLoading(false);
      console.log(err);
      if(codeRetourHttp === 999){
        msg = "Erreur"
        message = err;
      }else{
        switch(codeRetourHttp) {
          // Aucune association trouvée
          case 404:
            setResults([]);
            break;
          case 500:
            msg = "Erreur interne du serveur";
            message = "Une erreur est survenue sur le serveur du Registre National des Associations";
            break;
          case 429:
            msg = "Quota de requêtes dépassé";
            message = "Le serveur RNA a reçu trop de sollicitations issues du même lieu.";
            break;
          default:
            msg = "Erreur réseau";
            message = "Le serveur du RNA ne répond pas ou n'est pas joignable";
        }
      }
      if(msg)
        toastRef.current.show({severity: 'error', summary: msg, detail: message, sticky:true});
    });
  }

  return (
    <div className="App">
      <Toast ref={toastRef} />
      <h1>Registre National des Associations</h1>
      <SearchCriteria onSubmit={c => doSearch(c)} />
      <DisplaySearchResults results={results} loading={loading}/>
    </div>
  );
}

export default App;
