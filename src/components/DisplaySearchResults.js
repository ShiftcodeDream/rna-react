import React, { useState } from 'react';

import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { ListBox } from 'primereact/listbox';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { DeptRegion } from '../services/DonneesStatiques';
import { TabView, TabPanel } from 'primereact/tabview';

import DisplayAssociation from './DisplayAssociation';

export default function DisplaySearchResults (props) {
    const [page, setPage] = useState(0);
    const [selectedAssociation, setSelectedAssociation ] = useState(null);

    if(props.results === undefined)
        return null;

    const filters = {
        'departement': { value: null, matchMode: FilterMatchMode.IN}
    }
    
    const titleTooltip = (rowData) => {
        if(rowData.titre_court != rowData.titre)
            return <Button label={rowData.titre_court} className="p-button-plain p-button-text" onClick={()=>setSelectedAssociation(rowData)} tooltip={rowData.titre} tooltipOptions={{position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }} />
        else
            return <Button label={rowData.titre_court} className="p-button-plain p-button-text" onClick={()=>setSelectedAssociation(rowData)} />
    }

    const listeDepartements = DeptRegion.map(r => { return {num: "" + r.num_dep, libelle: r.num_dep + " - " + r.dep_name}});
    const listeRegions = [];
    DeptRegion.forEach(d => {
        let r = listeRegions.find(x => x.nom == d.region_name);
        if(r == null){
            listeRegions.push({
                nom: d.region_name,
                depts : ["" + d.num_dep]
            });
        } else {
            r.depts.push("" + d.num_dep);
        }
    });
    // Formulaire personnalisé pour le filtre sur les départements
    const deptFilterTemplate = (options) => {
        return (
            <TabView>
                <TabPanel header="Par région">
                    <ListBox
                        value={listeRegions}
                        options={listeRegions}
                        optionValue="depts"
                        optionLabel="nom"
                        onChange={(e) => options.filterApplyCallback(e.value)}
                        className="p-column-filter"
                    />
                </TabPanel>
                <TabPanel header="Par département">
                    <ListBox
                        value={listeDepartements}
                        options={listeDepartements}
                        optionValue="num"
                        optionLabel="libelle"
                        onChange={(e) => options.filterApplyCallback([e.value])}
                        className="p-column-filter"
                    />
                </TabPanel>
            </TabView>
        );
    }
    // Sur fermeture du détail d'une association
    const handleCloseAssociationDetails = () => {
        setSelectedAssociation(null);
    }
    //  
    return (
        <span>
            <DataTable value={props.results} dataKey="id" size="small"
            emptyMessage="Aucune association non correspond aux critères"
            paginator rows={10} first={page} onPage={(e) => setPage(e.first)}
            sortField="titre_court" filterDisplay="menu" filters={filters}
            selectionMode="single" selection={selectedAssociation}
            onSelectionChange={e => setSelectedAssociation(e.value)}>
                <Column field="titre_court" header="Nom" body={titleTooltip} sortable />
                <Column field="departement" header="Dept." sortable filter
                filterElement={deptFilterTemplate} showFilterMatchModes={false}/>
                <Column field="adresse_libelle_commune" header="Commune" sortable />
                <Column field="adresse_rue_complete" header="Adresse" sortable />
            </DataTable>
            <DisplayAssociation association={selectedAssociation} onClose={handleCloseAssociationDetails}></DisplayAssociation>
        </span>
    );
}
