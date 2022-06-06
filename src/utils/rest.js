// Convertit en JSON la réponse d'un fetch
export const toJsonOutput = (reponse) => {
    let contentType = reponse.headers.get("content-type");
    if(reponse.ok && contentType && contentType.indexOf("application/json") !== -1){
        return reponse.json();
    }else{
        return Promise.reject(reponse);
    }
}
