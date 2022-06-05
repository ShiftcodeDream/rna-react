import React, { useState, useEffect } from 'react';

import { Dialog } from 'primereact/dialog';
import { TabView, TabPanel } from 'primereact/tabview';
import { Fieldset } from 'primereact/fieldset';

import { formateAdresse, noNull, IsoToFrenchDate } from '../utils/formatage';
import GeoPositionService from '../services/GeoPositionService';

export default function DisplayAssociation (props) {
    const [geoPos, setGeoPos] = useState(null);
    const asso = props.association;

    useEffect(() => {
        // Demande une nouvelle géolocalisation si l'association affichée n'est plus la même que précédemment (cf 2eme param de useEffect)
        if(props.association === null) return;
        GeoPositionService(asso.adresse_rue_complete, asso.adresse_libelle_commune, asso.adresse_code_postal)
        .then(geo => setGeoPos(geo));
    }, [props.association]);

    if(props.association == null)
        return null;
    return (
        <Dialog header={asso.titre} visible={asso !== null} className="AfficheAsso"
        closeOnEscape resizable draggable dismissableMask maximizable
        onHide={()=>props.onClose()}>
            <TabView>
                <TabPanel header="Informations générales">
                    <div className="grid">
                    <div className="col-12 md:col-6">
                            <Fieldset legend="Adresse" className="adresse">
                                {formateAdresse([
                                    asso.titre,
                                    asso.adresse_rue_complete,
                                    asso.adresse_distribution,
                                    noNull(asso.adresse_code_postal) + ' ' + noNull(asso.adresse_libelle_commune)
                                ])}
                            </Fieldset>
                        </div>
                        <div className="col-12 md:col-6">
                            <Fieldset legend="Adresse de gestion"  className="adresse">
                                {formateAdresse([
                                    asso.adresse_gestion_nom,
                                    asso.adresse_gestion_distribution,
                                    noNull(asso.adresse_gestion_code_postal) + ' ' + noNull(asso.adresse_gestion_acheminement),
                                    asso.adresse_gestion_pays
                                ])}
                            </Fieldset>
                        </div>
                    </div>

                    <div className="grid">
                        <div className="col-12">
                            <Fieldset legend="Contacts" toggleable>
                                {asso.telephone!==null && <p>Téléphone : <a href={"tel:" + asso.telephone}>{asso.telephone}</a></p>}
                                {asso.site_web!==null && <p>Site Internet : <a href={asso.site_web} target="_blank">{asso.site_web}</a></p>}
                                {asso.email!==null && <p>e-mail : <a href={"mailto:" + asso.email}>{asso.email}</a></p>}
                            </Fieldset>
                        </div>
                    </div>

                    <div className="grid">
                        <div className="col-12">
                            <Fieldset legend="Description de l'association" toggleable collapsed>
                                <p>{asso.objet}</p>
                            </Fieldset>
                        </div>
                    </div>
                </TabPanel>

                <TabPanel header="Identifiants et dates">
                    <Fieldset legend="Identifiants">
                        {asso.id!==null && <p>Identifiant RNA : {asso.id}</p> }
                        {asso.id_association!==null && <p>Identifiant WALDEC : {asso.id_association}</p> }
                        {asso.siret!==null && <p>SIRET : {asso.siret}</p> }
                        {asso.code_gestion!==null && <p>Code du site gestionnaire de l’association : {asso.code_gestion}</p> }
                        {asso.objet_social1!==null && <p>Code nomenclature nationale : {asso.objet_social1 + " " + noNull(asso.objet_social2)}</p>}
                    </Fieldset>

                    <Fieldset legend="Dates">
                        {asso.date_creation!==null && <p>Date de création : {IsoToFrenchDate(asso.date_creation)}</p> }
                        {asso.date_publication_creation!==null && <p>Date de publication de création : {IsoToFrenchDate(asso.date_publication_creation)}</p> }
                        {asso.date_derniere_declaration!==null && <p>Date de dernière déclaration : {IsoToFrenchDate(asso.date_derniere_declaration)}</p> }
                        {asso.date_declaration_dissolution!==null && <p>Date de dissolution : {IsoToFrenchDate(asso.date_declaration_dissolution)}</p> }
                    </Fieldset>
                </TabPanel>

                <TabPanel header="Carte" disabled={geoPos===null}>
                    <textarea value={JSON.stringify(geoPos)} rows="50" cols="100" readOnly/>
                </TabPanel>
            </TabView>
        </Dialog>
    );
}
