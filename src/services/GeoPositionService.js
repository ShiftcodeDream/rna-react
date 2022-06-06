import { toJsonOutput } from '../utils/rest'

export default function GeoPositionService(adresse, ville, codePostal=null){
    // Dans le cas de plusieurs lignes d'adresse (si adresse est un tableau, sa méthode join est définie)
    if(adresse.join)
        adresse = adresse.join(", ");
    let demande = "https://api-adresse.data.gouv.fr/search/?q=" + adresse + ", " + ville + "&limit=1&autocomplete=0";
    if(codePostal)
        demande += "&postcode=" + codePostal;
    return fetch(encodeURI(demande))
    .then(toJsonOutput);
}
