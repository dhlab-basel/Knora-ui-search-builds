import { EventEmitter, OnInit, QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GravsearchGenerationService, OntologyCacheService, OntologyMetadata, Properties, ReadResourcesSequence, ResourceClass } from '@knora/core';
import { SelectPropertyComponent } from './select-property/select-property.component';
import { SelectResourceClassComponent } from './select-resource-class/select-resource-class.component';
export declare class ExtendedSearchComponent implements OnInit {
    private fb;
    private _route;
    private _router;
    private _cacheService;
    private _gravSearchService;
    /**
     * @param {string} route - Route after search
     */
    route: any;
    toggleExtendedSearchForm: EventEmitter<boolean>;
    ontologies: Array<OntologyMetadata>;
    activeOntology: string;
    activeProperties: boolean[];
    resourceClasses: Array<ResourceClass>;
    activeResourceClass: ResourceClass;
    properties: Properties;
    result: ReadResourcesSequence;
    resourceClassComponent: SelectResourceClassComponent;
    propertyComponents: QueryList<SelectPropertyComponent>;
    form: FormGroup;
    formValid: boolean;
    constructor(fb: FormBuilder, _route: ActivatedRoute, _router: Router, _cacheService: OntologyCacheService, _gravSearchService: GravsearchGenerationService);
    ngOnInit(): void;
    /**
     * Add a property to the search form.
     * @returns void
     */
    addProperty(): void;
    /**
     * Remove the last property from the search form.
     * @returns void
     */
    removeProperty(): void;
    /**
     * Gets all available ontologies for the search form.
     * @returns void
     */
    initializeOntologies(): void;
    /**
     * Once an ontology has been selected, gets its classes and properties.
     * The classes and properties will be made available to the user for selection.
     *
     * @param ontologyIri Iri of the ontology chosen by the user.
     * @returns void
     */
    getResourceClassesAndPropertiesForOntology(ontologyIri: string): void;
    /**
     * Once a resource class has been selected, gets its properties.
     * The properties will be made available to the user for selection.
     *
     * @param resourceClassIri
     * @returns void
     */
    getPropertiesForResourceClass(resourceClassIri: string): void;
    /**
     * Validates form and returns its status (boolean).
     */
    private validateForm;
    /**
     * Resets the form (selected resource class and specified properties) preserving the active ontology.
     */
    resetForm(): void;
    /**
     * Creates a GravSearch query with the given form values and calls the extended search route.
     */
    submit(): void;
}
