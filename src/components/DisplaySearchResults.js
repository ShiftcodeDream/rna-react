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
import { libelleGroupement, libelleNature, libellePosition } from '../services/DonneesStatiques';

export default function DisplaySearchResults (props) {
    const [page, setPage] = useState(0);
    const [selectedAssociation, setSelectedAssociation ] = useState(null);

    if(props.results === undefined)
        return null;

    const filters = {
        'departement': { value: null, matchMode: FilterMatchMode.IN},
        'libelle_groupement': { value: null, matchMode: FilterMatchMode.IN},
        'libelle_nature': { value: null, matchMode: FilterMatchMode.IN},
        'libelle_position': { value: null, matchMode: FilterMatchMode.IN},
        'adresse_libelle_commune': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    }
    
    const titleTooltip = (rowData) => {
        if(rowData.titre_court !== rowData.titre)
            return <Button label={rowData.titre_court} className="p-button-plain p-button-text" onClick={()=>setSelectedAssociation(rowData)} tooltip={rowData.titre} tooltipOptions={{position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }} />
        else
            return <Button label={rowData.titre_court} className="p-button-plain p-button-text" onClick={()=>setSelectedAssociation(rowData)} />
    }

    const listeDepartements = DeptRegion.map(r => { return {num: "" + r.num_dep, libelle: r.num_dep + " - " + r.dep_name}});
    const listeRegions = [];
    DeptRegion.forEach(d => {
        let r = listeRegions.find(x => x.nom === d.region_name);
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
    let GroupementMenuSelect = Object.keys(libelleGroupement).map(k => {return {val: k, lib: libelleGroupement[k]}} );
    const templateFiltreGroupement = (options) => {
        return <ListBox value={options.value} options={GroupementMenuSelect} optionLabel="lib" optionValue="lib" multiple
        onChange={(e) => options.filterCallback(e.value)} className="p-column-filter" />;
    }
    let NatureMenuSelect = Object.keys(libelleNature).map(k => {return {val: k, lib: libelleNature[k]}} );
    const templateFiltreNature = (options) => {
        return <ListBox value={options.value} options={NatureMenuSelect} optionLabel="lib" optionValue="lib" multiple
        onChange={(e) => options.filterCallback(e.value)} className="p-column-filter" />;
    }
    let PositionMenuSelect = Object.keys(libellePosition).map(k => {return {val: k, lib: libellePosition[k]}} );
    const templateFiltrePosition = (options) => {
        return <ListBox value={options.value} options={PositionMenuSelect} optionLabel="lib" optionValue="lib" multiple
        onChange={(e) => options.filterCallback(e.value)} className="p-column-filter" />;
    }
    
    return (
        <span>
            <DataTable value={props.results} dataKey="id" size="small" loading={props.loading}
            emptyMessage="Aucune association non correspond aux critères"
            paginator rows={10} first={page} onPage={(e) => setPage(e.first)}
            sortField="titre_court" filterDisplay="menu" filters={filters}
            selectionMode="single" selection={selectedAssociation}
            onSelectionChange={e => setSelectedAssociation(e.value)}>
                <Column field="titre_court" header="Nom" body={titleTooltip} sortable />
                <Column field="departement" header="Dept." sortable filter
                    filterElement={deptFilterTemplate} showFilterMatchModes={false}/>
                <Column field="adresse_libelle_commune" header="Commune" sortable
                    filter filterPlaceholder="Filtrage par nom"/>
                <Column field="libelle_groupement" header="Grouppement" sortable
                    filter filterField="libelle_groupement" filterElement={templateFiltreGroupement} showFilterMatchModes={false}/>
                <Column field="libelle_nature" header="Nature" sortable 
                    filter filterField="libelle_nature" filterElement={templateFiltreNature} showFilterMatchModes={false}/>
                <Column field="libelle_position" header="Position" sortable
                    filter filterField="libelle_position" filterElement={templateFiltrePosition} showFilterMatchModes={false}/>
            </DataTable>
            <DisplayAssociation association={selectedAssociation} onClose={handleCloseAssociationDetails}></DisplayAssociation>
        </span>
    );
}
