import React, { useState } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';

export default function DisplaySearchResults (props) {
    const [page, setPage] = useState(0);

    if(props.results === undefined)
        return null;

    const titleTooltip = (rowData) => {
        if(rowData.titre_court != rowData.titre)
            return <Button label={rowData.titre_court} className="p-button-secondary p-button-text" tooltip={rowData.titre} tooltipOptions={{position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }} />
        else
            return <Button label={rowData.titre_court} className="p-button-secondary p-button-text"/>
    }

    return (
        <DataTable value={props.results} dataKey="id" size="small" paginator rows={10} first={page} onPage={(e) => setPage(e.first)}>
            <Column field="titre_court" header="Nom" body={titleTooltip} sortable />
            <Column field="departement" header="Dept." sortable />
            <Column field="adresse_libelle_commune" header="Commune" sortable />
            <Column field="adresse_rue_complete" header="Adresse" sortable />
        </DataTable>
    );
}
