import React, { useState } from 'react';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

export default function SearchCriteria (props) {
    const [critere, setCritere] = useState('');
    // Lance une recherche si le champ est rempli
    const recherche = (event) => {
        event.preventDefault();
        let cr = critere.trim();
        if(cr.length == 0)
            return;
        props.onSubmit(cr);
    }
    return (
        <form onSubmit={e => recherche(e)}>
            <div className="grid">
                <div className="col-12 md:col-4">
                    <label htmlFor="crit" className="col-12 md:col-4">Rechercher une association</label>
                </div>
                <div className="p-inputgroup md:col-6">
                    <InputText id="crit" value={critere} onChange={e => setCritere(e.target.value)} className="p-inputtext-sm"/>
                    <Button icon="pi pi-search" onClick={e => recherche(e)} />
                </div>
            </div>
        </form>
    );
}

