// N'affiche que les lignes d'adresse possédant des informations
// Fait en sorte que l'adresse soit alignée enbas
export const formateAdresse = (lignes) => {
    let result = lignes.filter(a => (a!==null && a.length>1));
    while(result.length < lignes.length){
        result = ["", ...result];
    }
    return result.map((ligne,index) => (ligne!="" ? ( <p key={index}>{ligne}</p>) : (<p key={index}>&nbsp;</p>)) );
};

export const noNull = (valeur) => {
    return valeur===null ? '' : valeur
};

// Conversion d'une date : YYYY-MM-DD => DD/MM/YYYY
// Fait un contrôle minimal sur l'année :
// ni trop loin dans le passé, ni dans le futur
export const IsoToFrenchDate = (valeur) => {
    let vals = valeur.split('-');
    if(vals.length<3 || isNaN(vals[0]) || parseInt(vals[0]) < 1800 || parseInt(vals[0]) > new Date().getFullYear())
        return '';
    return vals[2] + "/" + vals[1] + "/" + vals[0];
}
