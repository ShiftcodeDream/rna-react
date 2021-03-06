import React, { useState, useRef } from 'react';

import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { ListBox } from 'primereact/listbox';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { DeptRegion } from '../services/DonneesStatiques';
import { TabView, TabPanel } from 'primereact/tabview';
import { Dialog } from 'primereact/dialog';

import DisplayAssociation from './DisplayAssociation';
import { libelleGroupement, libelleNature, libellePosition, activiteSociale } from '../services/DonneesStatiques';

export default function DisplaySearchResults (props) {
    const [selectedAssociation, setSelectedAssociation ] = useState(null);
    const [displayAbout, setDisplayAbout] = useState(false);
    const dt = useRef(null);  // Datatable

    if(props.results === undefined)
        return null;

    const filters = {
        'departement': { value: null, matchMode: FilterMatchMode.IN},
        'libelle_groupement': { value: null, matchMode: FilterMatchMode.IN},
        'libelle_nature': { value: null, matchMode: FilterMatchMode.IN},
        'libelle_position': { value: null, matchMode: FilterMatchMode.IN},
        'objet_social1': { value: null, matchMode: FilterMatchMode.IN},
        'adresse_libelle_commune': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'titre': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    }
    
    const titleTooltip = (rowData) => {
        if(rowData.titre_court !== rowData.titre)
            return <Button label={rowData.titre_court} className="p-button-plain p-button-text" onClick={()=>setSelectedAssociation(rowData)} tooltip={rowData.titre} tooltipOptions={{position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }} />
        else
            return <Button label={rowData.titre_court} className="p-button-plain p-button-text" onClick={()=>setSelectedAssociation(rowData)} />
    }
    const activiteTooltip = (rowData) => {
        if(rowData.activite_sociale !== rowData.activite_sociale_court)
            return <Button label={rowData.activite_sociale_court} className="p-button-plain p-button-text" onClick={()=>setSelectedAssociation(rowData)} tooltip={rowData.activite_sociale} tooltipOptions={{position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }} />
        else
            return <Button label={rowData.activite_sociale_court} className="p-button-plain p-button-text" onClick={()=>setSelectedAssociation(rowData)} />
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
    // Formulaire personnalis?? pour le filtre sur les d??partements
    const deptFilterTemplate = (options) => {
        return (
            <TabView>
                <TabPanel header="Par r??gion">
                    <ListBox
                        value={listeRegions}
                        options={listeRegions}
                        optionValue="depts"
                        optionLabel="nom"
                        onChange={(e) => options.filterApplyCallback(e.value)}
                        className="p-column-filter"
                    />
                </TabPanel>
                <TabPanel header="Par d??partement">
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
    // Sur fermeture du d??tail d'une association
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
    let ActiviteMenuSelect = Object.keys(activiteSociale).map(k => {return {val: k, lib: activiteSociale[k]}} ).sort((a,b)=>a.lib.localeCompare(b.lib));
    const templateFiltreActivite = (options) => {
        return <ListBox value={options.value} options={ActiviteMenuSelect} optionLabel="lib" optionValue="val" multiple
        onChange={(e) => options.filterCallback(e.value)} className="p-column-filter" />;
    }
    const tableHeader = () => {
        return <div style={{textAlign:'right'}}>
            <Button type="button" icon="pi pi-envelope" iconPos="left" label="Exporter en CSV" onClick={exportCsv}></Button>
            <Button type="button" label="?" onClick={()=>setDisplayAbout(true)} style={{marginLeft:'6px'}}></Button>
        </div>;
    }
    const exportCsv = () => {
        dt.current.exportCSV();
    }
    // Certaines colonnes (adresses) ne sont pas visibles, elles ne servent que pour l'exportation CSV
    return (
        <span>
            <DataTable value={props.results} dataKey="id" size="small" loading={props.loading} ref={dt} header={tableHeader}
            emptyMessage="Aucune association non correspond aux crit??res"
            paginator paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate="R??sultats {first} ?? {last} sur {totalRecords} associations" rows={10} rowsPerPageOptions={[10,20,50,100]}
            sortField="titre_court" filterDisplay="menu" filters={filters}
            selectionMode="single" selection={selectedAssociation}
            onSelectionChange={e => setSelectedAssociation(e.value)}>
                <Column field="titre_court" header="Nom" body={titleTooltip} sortable
                    filter filterField="titre" filterPlaceholder="Filtrage par nom"
                    exportable exportField="titre"/>
                <Column field="departement" header="Dept." sortable filter
                    filterElement={deptFilterTemplate} showFilterMatchModes={false}
                    exportable={false} />

                <Column field="adresse_rue_complete" header="adresse 1" hidden exportable />
                <Column field="adresse_distribution" header="adresse 2" hidden exportable />
                <Column field="adresse_code_postal" header="Code postal" hidden exportable />
                <Column field="adresse_libelle_commune" header="Commune" sortable
                    filter filterPlaceholder="Filtrage par nom"/>

                <Column field="adresse_gestion_nom" header="Nom gestion" hidden exportable />
                <Column field="adresse_gestion_libelle_voie" header="Adresse 1 gestion" hidden exportable />
                <Column field="adresse_gestion_distribution" header="Adresse 2 gestion" hidden exportable />
                <Column field="adresse_gestion_code_postal" header="Code postal gestion" hidden exportable />
                <Column field="adresse_gestion_acheminement" header="Commune gestion" hidden exportable />
                <Column field="adresse_gestion_pays" header="Pays gestion" hidden exportable />

                <Column field="objet_social1" header="Activit??" body={activiteTooltip} sortable
                    filter filterField="objet_social1" filterElement={templateFiltreActivite} showFilterMatchModes={false}
                    exportable={false}/>
                <Column field="libelle_groupement" header="Grouppement" sortable
                    filter filterField="libelle_groupement" filterElement={templateFiltreGroupement} showFilterMatchModes={false}
                    exportable={false}/>
                <Column field="libelle_nature" header="Nature" sortable 
                    filter filterField="libelle_nature" filterElement={templateFiltreNature} showFilterMatchModes={false}
                    exportable={false}/>
                <Column field="libelle_position" header="Statut" sortable
                    filter filterField="libelle_position" filterElement={templateFiltrePosition} showFilterMatchModes={false}
                    exportable={false}/>
            </DataTable>
            <DisplayAssociation association={selectedAssociation} onClose={handleCloseAssociationDetails} toastRef={props.toastRef}></DisplayAssociation>

            <Dialog visible={displayAbout} onHide={()=>setDisplayAbout(false)} dismissableMask closeOnEscape header="Registre National des Associations&nbsp;&nbsp;&nbsp;">
                <p>D??velopp?? par Matthias Delamare</p>
                <p>Web : <a href="http://mdelamare.free.fr" target="_blank">http://mdelamare.free.fr</a></p>
                <p>E-mail : <a href="mailto:matt.delam@gmail.com">matt (at) gmail.com</a></p>
            </Dialog>
        </span>
    );
}
