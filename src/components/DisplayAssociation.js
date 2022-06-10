import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import LeafletApi from 'leaflet';

import { Dialog } from 'primereact/dialog';
import { TabView, TabPanel } from 'primereact/tabview';
import { Fieldset } from 'primereact/fieldset';
import { Button } from 'primereact/button';

import { formateAdresse, noNull, IsoToFrenchDate } from '../utils/formatage';
import GeoPositionService from '../services/GeoPositionService';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

export default function DisplayAssociation (props) {
    const [geoPos, setGeoPos] = useState(null);
    const [position, setPosition] = useState([0,0]);
    const asso = props.association;

    // Importe et configure l'image par défaut du marqueur Leaflet
    LeafletApi.Marker.prototype.options.icon = LeafletApi.icon({
        iconUrl: icon,
        shadowUrl: iconShadow,
        iconSize: [25,41],
        iconAnchor: [12,41]
    });

    useEffect(() => {
        // Demande une nouvelle géolocalisation si l'association affichée n'est plus la même que précédemment (cf 2eme param de useEffect)
        if(props.association === null) return;
        GeoPositionService(asso.adresse_rue_complete, asso.adresse_libelle_commune, asso.adresse_code_postal)
        .then(geo => {
            // Si on a une réponse valide
            if(geo.features && geo.features.length>0 && geo.features[0].geometry && geo.features[0].geometry.coordinates && geo.features[0].geometry.coordinates.length>1){
                let coords = geo.features[0].geometry.coordinates;
                // Inversion latitude et longitude
                coords = [coords[1], coords[0]];
                setPosition(coords);
                setGeoPos(coords);
            } else {
                setGeoPos(null);
            }
        })
        .catch(err => {
            console.log("erreur API géolocalisation", err);
            setGeoPos(null);
        });
    }, [props.association]);
    const copie = (id) => {
        let fromElement = document.getElementById(id);
        if(!fromElement) return;
        // Sélection
        let range = document.createRange();
        let selection = window.getSelection();
        range.selectNode(fromElement);
        selection.removeAllRanges();
        selection.addRange(range);

        // Copie
        try {
            if(document.execCommand('copy'))
                props.toastRef.current.show({severity: 'info', summary: "Adresse copiée dans le presse-papiers", life: 1000});
        }
        catch(err) { }

        // Déselection
        selection = window.getSelection();
        if (typeof selection.removeRange === 'function') {
            selection.removeRange(range);
        } else if (typeof selection.removeAllRanges === 'function') {
            selection.removeAllRanges();
        }
    }

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
                            <div className="relative top-0 left-0">
                                <Fieldset legend="Adresse" className="adresse">
                                    <Button icon="pi pi-clone" className="p-button-plain p-button-text bouton-copie" onClick={()=>copie('ad1')} />
                                    <div id="ad1">
                                        {formateAdresse(['','',
                                            asso.adresse_rue_complete,
                                            asso.adresse_distribution,
                                            noNull(asso.adresse_code_postal) + ' ' + noNull(asso.adresse_libelle_commune)
                                        ])}
                                    </div>
                                </Fieldset>
                            </div>
                        </div>
                        <div className="col-12 md:col-6">
                            <div className="relative top-0 left-0">
                                <Fieldset legend="Adresse de gestion"  className="adresse">
                                    <Button icon="pi pi-clone" className="p-button-plain p-button-text bouton-copie" onClick={()=>copie('ad2')} />
                                    <div id="ad2">
                                        {formateAdresse([
                                            asso.adresse_gestion_nom,
                                            asso.adresse_gestion_libelle_voie,
                                            asso.adresse_gestion_distribution,
                                            noNull(asso.adresse_gestion_code_postal) + ' ' + noNull(asso.adresse_gestion_acheminement),
                                            asso.adresse_gestion_pays
                                        ])}
                                    </div>
                                </Fieldset>
                            </div>
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
                        {asso.objet_social1!==null && <p>Nomenclature nationale : {asso.objet_social1 + " " + noNull(asso.objet_social2) + " " + noNull(asso.activite_sociale)}</p>}
                    </Fieldset>

                    <Fieldset legend="Dates">
                        {asso.date_creation!==null && <p>Date de création : {IsoToFrenchDate(asso.date_creation)}</p> }
                        {asso.date_publication_creation!==null && <p>Date de publication de création : {IsoToFrenchDate(asso.date_publication_creation)}</p> }
                        {asso.date_derniere_declaration!==null && <p>Date de dernière déclaration : {IsoToFrenchDate(asso.date_derniere_declaration)}</p> }
                        {asso.date_declaration_dissolution!==null && <p>Date de dissolution : {IsoToFrenchDate(asso.date_declaration_dissolution)}</p> }
                    </Fieldset>
                </TabPanel>

                <TabPanel header="Carte" disabled={geoPos===null}>
                    <MapContainer center={position} zoom={13} className="composantCarte">
                        <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={position} />
                    </MapContainer>
                </TabPanel>
            </TabView>
        </Dialog>
    );
}
