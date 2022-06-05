// N'affiche que les lignes d'adresse possédant des informations
// Fait en sorte que l'adresse soit alignée enbas
export const formateAdresse = (lignes) => {
    let result = lignes.filter(a => (a!==null && a.length>1));
    while(result.length < lignes.length){
        result = ["", ...result];
    }
    return result.map(ligne => (ligne!="" ? ( <p>{ligne}</p>) : (<p>&nbsp;</p>)) );
};

export const noNull = (valeur) => {
    return valeur===null ? '' : valeur
};
