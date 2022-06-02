import CLT from '../MockupData/CLT'

export default function RnaServiceMockup(critere){
    console.log("### MOCKUP CLT ###");
    return new Promise((ok) => {ok(CLT)});
}

function RnaService(criteria){
    return fetch("https://entreprise.data.gouv.fr/api/rna/v1/full_text/" + criteria + "?per_page=100")
    .then(rep => {
        if(rep.ok)
            return rep.json();
        else
            return Promise.reject(rep);
    });
}

