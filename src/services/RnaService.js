import { TypeVoies, libelleGroupement, libelleNature, libellePosition, activiteSociale } from './DonneesStatiques'
import { noNull } from '../utils/formatage'
import { toJsonOutput } from '../utils/rest'
import MOCK from '../MockupData/CAMINO'

function RnaServiceMockup(critere){
    console.log("### MOCKUP ###");
    return new Promise((ok) => {ok(MOCK)})
    .then(rep => rep.association.filter(removeDuplicateById).map(enrichissement));
}

// function RnaServiceBasic(criteria){
//     return fetch("https://entreprise.data.gouv.fr/api/rna/v1/full_text/" + criteria + "?per_page=100")
//     .then(toJsonOutput)
//     .then(donnees => donnees.association.map(enrichissement));
// }

// Cette classe "loader" permet de charger toutes les réponses de l'API RNA,
// même sur un grand nombre de résultats (sur plusieurs pages)
// La classe fait en sorte de ne jamais faire plus de 5 appels à la seconde
// afin de rester en dessous du quota de 7 appels à la seconde imposé par l'API.
class MultiRequestRnaService {
    constructor(critere){
        // this.url = "http://localhost/dev/multirequest.php?page=";
        this.url = "https://entreprise.data.gouv.fr/api/rna/v1/full_text/" + critere + "?per_page=100&page=";
        this.ctrPage = 1;
        this.maxPages = 0;
        this.donnees = [];
        this.requests = [];
        this.addTime = 0;
    }
    temporise (temps) {
        return new Promise(ok => setTimeout(ok, temps))
    }
    request(){
        return new Promise((OkCallback, KoCallback) => {
            KoCallback = KoCallback || function(){};
            fetch(this.url + this.ctrPage)
            .then(toJsonOutput)
            .then(d => {
                this.maxPages = parseInt(d.total_pages);
                this.donnees = d.association;
                if(parseInt(d.total_results) > 10000){
                    KoCallback("Le résultat comporte plus de 10.000 associations. Veuillez préciser votre recherche.");
                    return;
                }
                while(this.ctrPage < this.maxPages){
                    this.ctrPage++;
                    // Ajoute 1 seconde de décallage supplémentaire toutes les 5 requetes
                    if((this.ctrPage % 5) === 0)
                        this.addTime += 1000;
                    // "fige" la valeur du compteur de pages en la clonant afin que sa valeur soit évaluée
                    // maintenant plutôt que lors de l'appel de la fonction, où this.ctrPage vaudra this.maxPages
                    let valeurPageActuelle = 0 + this.ctrPage;
                    this.requests.push(
                        this.temporise(this.addTime)
                        .then(()=>fetch(this.url + valeurPageActuelle))
                        .then(toJsonOutput)
                        .catch(pb=>KoCallback(pb))
                    )
                }
                Promise.all(this.requests)
                .then((reponses) => {
                    reponses.forEach(j => {
                        this.donnees = this.donnees.concat(j.association)
                    })
                })
                .then(()=>OkCallback(this.donnees.filter(removeDuplicateById).map(enrichissement)))
                .catch((err)=>KoCallback(err));
            })
            .catch((err)=>KoCallback(err));
        }); // API CAll 1
    } // methode "request"
} // classe

function RnaService(critere){
    let serv = new MultiRequestRnaService(critere);
    return serv.request();
}

function removeDuplicateById(valeur, index, tableau){
    return tableau.findIndex(v=>(valeur.id_association===v.id_association))===index;
}

let activiteSocialeCourt = [];
Object.keys(activiteSociale).forEach(k => {let x = activiteSociale[k]; x = x.length>47? x.substring(0,47) + '...' : x; activiteSocialeCourt[k] = x});

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
    d.objet_social1 = noNull(d.objet_social1.replace(/^0+/,""));
    d.objet_social2 = noNull(d.objet_social2.replace(/^0+/,""));
    d.activite_sociale = noNull(activiteSociale[d.objet_social1]);
    d.activite_sociale_court = noNull(activiteSocialeCourt[d.objet_social1]);

    return d;
}

export default RnaServiceMockup;
