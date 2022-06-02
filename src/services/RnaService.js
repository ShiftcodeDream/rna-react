import CLT from '../MockupData/CLT'

export default function RnaServiceMockup(critere){
    console.log("### MOCKUP CLT ###");
    return new Promise((ok) => {ok(CLT)})
    .then(rep => rep.association.map(enrichissement));
}

function RnaService(criteria){
    return fetch("https://entreprise.data.gouv.fr/api/rna/v1/full_text/" + criteria + "?per_page=100")
    .then(rep => {
        if(rep.ok){
            return rep.json().association.map(enrichissement);
        }
        else
            return Promise.reject(rep);
    });
}

const TypeVoies = {
    AIRE:"Aire", ALL:"Allée", AV:"Avenue", BASE:"Base", BD:"Boulevard", CAMI:"Cami", CAR:"Carrefour", CHE:"Chemin", CHEM:"Cheminement", CHS:"Chaussée", CITE:"Cité", CLOS:"Clos", COIN:"Coin", COR:"Corniche", COTE:"Cote", COUR:"Cour", CRS:"Cours", DOM:"Domaine", DSC:"Descente", ECA:"Ecart", ESP:"Esplanade", FG:"Faubourg", GARE:"Gare", GR:"Grande Rue", HAM:"Hameau", HLE:"Halle", ILOT:"Ilôt", IMP:"Impasse", LD:"Lieu dit", LOT:"Lotissement", MAR:"Marché", MTE:"Montée", PARC:"Parc", PAS:"Passage", PL:"Place", PLAN:"Plan", PLN:"Plaine", PLT:"Plateau", PONT:"Pont", PORT:"Port", PRO:"Promenade", PRV:"Parvis", QUA:"Quartier", QUAI:"Quai", RES:"Résidence", RLE:"Ruelle", ROC:"Rocade", RPT:"Rond Point", RTE:"Route", RUE:"Rue", SEN:"Sente - Sentier", SQ:"Square", TOUR:"Tour", TPL:"Terre-plein", TRA:"Traverse", VLA:"Villa", VLGE:"Village", VOIE:"Voie", ZA:"Zone artisanale", ZAC:"Zone d'aménagement concerté", ZAD:"Zone d'aménagement différé", ZI:"Zone industrielle", ZONE:"Zone" 
}
// Retraite une donnée de type association
function enrichissement(d){
    // Ajoute un titre court
    console.log(d.titre_court);
    if(d.titre_court === null || d.titre_court.trim().length == 0){
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
        }
    }
    // Génère la ligne d'adresse
    let rue = '';
    if(d.adresse_numero_voie)
        rue = d.adresse_numero_voie;
    let typeVoie = TypeVoies[d.adresse_type_voie];
    if(typeVoie != undefined)
        rue += ' ' + typeVoie.toLowerCase();
    if(d.adresse_libelle_voie)
        rue += ' ' + d.adresse_libelle_voie;
    d.adresse_rue_complete = rue;

    return d;
}