import CLT from '../MockupData/CLT'
import { TypeVoies, libelleGroupement, libelleNature, libellePosition } from './DonneesStatiques'
import { noNull } from '../utils/formatage'
import { toJsonOutput } from '../utils/rest'

function RnaServiceMockup(critere){
    console.log("### MOCKUP CLT ###");
    return new Promise((ok) => {ok(CLT)})
    .then(rep => rep.association.map(enrichissement));
}

export default function RnaService(criteria){
    return fetch("https://entreprise.data.gouv.fr/api/rna/v1/full_text/" + criteria + "?per_page=100")
    .then(toJsonOutput)
    .then(donnees => donnees.association.map(enrichissement));
}

// Retraite une donnée de type association
function enrichissement(d){
    // Ajoute un titre court
    if(d.titre_court === null || d.titre_court.trim().length === 0){
        d.titre_court = d.titre.length > 30 ? d.titre.substring(0,27) + "..." : d.titre;
    }
    // Extrait le département
    if(d.adresse_code_postal){
        switch(d.adresse_code_postal.length){
            case 4:
                d.departement = '0' + d.adresse_code_postal.substring(0,1);
                break;
            case 5:
                d.departement = d.adresse_code_postal.substring(0,2);
                break;
            case 6:
                d.departement = d.adresse_code_postal.substring(0,3);
                break;
            default:
        }
    }
    // Génère la ligne d'adresse
    let rue = '';
    if(d.adresse_numero_voie)
        rue = d.adresse_numero_voie;
    let typeVoie = TypeVoies[d.adresse_type_voie];
    if(typeVoie !== undefined)
        rue += ' ' + typeVoie.toLowerCase();
    if(d.adresse_libelle_voie)
        rue += ' ' + d.adresse_libelle_voie;
    d.adresse_rue_complete = rue;

    // Retrouve les libellés des différents codes
    d.libelle_groupement = noNull(libelleGroupement[d.groupement]);
    d.libelle_nature = noNull(libelleNature[d.nature]);
    d.libelle_position = noNull(libellePosition[d.position_activite]);

    return d;
}
