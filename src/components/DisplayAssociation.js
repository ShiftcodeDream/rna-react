import React, { useState } from 'react';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { TabView, TabPanel } from 'primereact/tabview';
import { Fieldset } from 'primereact/fieldset';
import { formateAdresse, noNull } from '../utils/formatage'

export default function DisplayAssociation (props) {
    if(props.association == null)
        return null;
    const asso = props.association;
    return (
        <Dialog header={asso.titre} visible={asso !== null}
        closeOnEscape resizable draggable dismissableMask maximizable
        onHide={()=>props.onClose()}>
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

            
        </Dialog>
    );
}
