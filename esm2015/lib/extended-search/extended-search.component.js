import { Component, EventEmitter, Inject, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { GravsearchGenerationService, OntologyCacheService, ReadResourcesSequence } from '@knora/core';
import { SelectResourceClassComponent } from './select-resource-class/select-resource-class.component';
export class ExtendedSearchComponent {
    constructor(fb, _route, _router, _cacheService, _gravSearchService) {
        this.fb = fb;
        this._route = _route;
        this._router = _router;
        this._cacheService = _cacheService;
        this._gravSearchService = _gravSearchService;
        // trigger toggle for extended search form
        this.toggleExtendedSearchForm = new EventEmitter();
        // all available ontologies
        this.ontologies = [];
        // properties specified by the user
        this.activeProperties = [];
        // resource classes for the selected ontology
        this.resourceClasses = [];
        this.result = new ReadResourcesSequence([], 0);
        // form validation status
        this.formValid = false;
    }
    ngOnInit() {
        // parent form is empty, it gets passed to the child components
        this.form = this.fb.group({});
        // if form status changes, re-run validation
        this.form.statusChanges.subscribe((data) => {
            this.formValid = this.validateForm();
            // console.log(this.form);
        });
        // initialize ontologies to be used for the ontologies selection in the search form
        this.initializeOntologies();
    }
    /**
     * Add a property to the search form.
     * @returns void
     */
    addProperty() {
        this.activeProperties.push(true);
    }
    /**
     * Remove the last property from the search form.
     * @returns void
     */
    removeProperty() {
        this.activeProperties.splice(-1, 1);
    }
    /**
     * Gets all available ontologies for the search form.
     * @returns void
     */
    initializeOntologies() {
        this._cacheService.getOntologiesMetadata().subscribe((ontologies) => {
            this.ontologies = ontologies;
        });
    }
    /**
     * Once an ontology has been selected, gets its classes and properties.
     * The classes and properties will be made available to the user for selection.
     *
     * @param ontologyIri Iri of the ontology chosen by the user.
     * @returns void
     */
    getResourceClassesAndPropertiesForOntology(ontologyIri) {
        // reset active resource class definition
        this.activeResourceClass = undefined;
        // reset specified properties
        this.activeProperties = [];
        this.activeOntology = ontologyIri;
        this._cacheService.getEntityDefinitionsForOntologies([ontologyIri]).subscribe((ontoInfo) => {
            this.resourceClasses = ontoInfo.getResourceClassesAsArray(true);
            this.properties = ontoInfo.getProperties();
        });
    }
    /**
     * Once a resource class has been selected, gets its properties.
     * The properties will be made available to the user for selection.
     *
     * @param resourceClassIri
     * @returns void
     */
    getPropertiesForResourceClass(resourceClassIri) {
        // reset specified properties
        this.activeProperties = [];
        // if the client undoes the selection of a resource class, use the active ontology as a fallback
        if (resourceClassIri === null) {
            this.getResourceClassesAndPropertiesForOntology(this.activeOntology);
        }
        else {
            this._cacheService.getResourceClassDefinitions([resourceClassIri]).subscribe((ontoInfo) => {
                this.properties = ontoInfo.getProperties();
                this.activeResourceClass = ontoInfo.getResourceClasses()[resourceClassIri];
            });
        }
    }
    /**
     * Validates form and returns its status (boolean).
     */
    validateForm() {
        // check that either a resource class is selected or at least one property is specified
        return this.form.valid &&
            (this.propertyComponents.length > 0 || (this.resourceClassComponent !== undefined && this.resourceClassComponent.getResourceClassSelected() !== false));
    }
    /**
     * Resets the form (selected resource class and specified properties) preserving the active ontology.
     */
    resetForm() {
        if (this.activeOntology !== undefined) {
            this.getResourceClassesAndPropertiesForOntology(this.activeOntology);
        }
    }
    /**
     * Creates a GravSearch query with the given form values and calls the extended search route.
     */
    submit() {
        if (!this.formValid)
            return; // check that from is valid
        const resClassOption = this.resourceClassComponent.getResourceClassSelected();
        let resClass;
        if (resClassOption !== false) {
            resClass = resClassOption;
        }
        const properties = this.propertyComponents.map((propComp) => {
            return propComp.getPropertySelectedWithValue();
        });
        const gravsearch = this._gravSearchService.createGravsearchQuery(properties, resClass, 0);
        this._router.navigate([this.route + '/extended/', gravsearch], { relativeTo: this._route });
        // toggle extended search form
        this.toggleExtendedSearchForm.emit(true);
    }
}
ExtendedSearchComponent.decorators = [
    { type: Component, args: [{
                selector: 'kui-extended-search',
                template: `<form [formGroup]="form" (ngSubmit)="submit()">

  <div>
    <kui-select-ontology *ngIf="ontologies.length > 0" [formGroup]="form" [ontologies]="ontologies" (ontologySelected)="getResourceClassesAndPropertiesForOntology($event)"></kui-select-ontology>
  </div>

  <div class="select-resource-class" *ngIf="resourceClasses?.length > 0">
    <kui-select-resource-class #resourceClass [formGroup]="form" [resourceClasses]="resourceClasses" (resourceClassSelectedEvent)="getPropertiesForResourceClass($event)"></kui-select-resource-class>
  </div>

  <div class="select-property" *ngIf="properties !== undefined">
    <div *ngFor="let prop of activeProperties; let i = index">

      <kui-select-property #property [activeResourceClass]="activeResourceClass" [formGroup]="form" [index]="i" [properties]="properties"></kui-select-property>

    </div>
  </div>


  <div>
    <button mat-mini-fab class="property-buttons add-property-button" color="primary" type="button" (click)="addProperty()" [disabled]="activeOntology === undefined || activeProperties.length >= 4">
      <mat-icon aria-label="add a property">add</mat-icon>
    </button>

    <button mat-mini-fab class="property-buttons remove-property-button" color="primary" type="button" (click)="removeProperty()" [disabled]="activeProperties.length == 0">
      <mat-icon aria-label="remove property">remove</mat-icon>
    </button>
  </div>

  <!--  <div>
    <button mat-icon-button type="button" (click)="resetForm()" [disabled]="this.activeOntology === undefined">
      <mat-icon aria-label="reset query form">clear</mat-icon>
    </button>

    <button mat-icon-button type="submit" [disabled]="!formValid">
      <mat-icon aria-label="submit query">send</mat-icon>
    </button>
  </div> -->

  <button class="extended-buttons extended-search-button" mat-stroked-button color="primary" type="submit" [disabled]="!formValid">
    Search
  </button>
  <button class="extended-buttons reset" mat-stroked-button type="button" (click)="resetForm()" [disabled]="this.activeOntology === undefined">
    Reset
  </button>


</form>
`,
                styles: [`.add-property-button{margin-right:5px}.extended-buttons{margin-top:25px}.extended-search-button{margin-right:5px}.property-buttons{margin-top:25px}.select-property{margin-left:22px}.select-resource-class{margin-left:12px}`]
            },] },
];
/** @nocollapse */
ExtendedSearchComponent.ctorParameters = () => [
    { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] },
    { type: ActivatedRoute },
    { type: Router },
    { type: OntologyCacheService },
    { type: GravsearchGenerationService }
];
ExtendedSearchComponent.propDecorators = {
    route: [{ type: Input }],
    toggleExtendedSearchForm: [{ type: Output }],
    resourceClassComponent: [{ type: ViewChild, args: ['resourceClass',] }],
    propertyComponents: [{ type: ViewChildren, args: ['property',] }]
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5kZWQtc2VhcmNoLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Brbm9yYS9zZWFyY2gvIiwic291cmNlcyI6WyJsaWIvZXh0ZW5kZWQtc2VhcmNoL2V4dGVuZGVkLXNlYXJjaC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0gsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsV0FBVyxFQUFhLE1BQU0sZ0JBQWdCLENBQUM7QUFDeEQsT0FBTyxFQUNILDJCQUEyQixFQUMzQixvQkFBb0IsRUFLcEIscUJBQXFCLEVBRXhCLE1BQU0sYUFBYSxDQUFDO0FBRXJCLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLHlEQUF5RCxDQUFDO0FBd0R2RyxNQUFNO0lBMENGLFlBQXlDLEVBQWUsRUFDNUMsTUFBc0IsRUFDdEIsT0FBZSxFQUNmLGFBQW1DLEVBQ25DLGtCQUErQztRQUpsQixPQUFFLEdBQUYsRUFBRSxDQUFhO1FBQzVDLFdBQU0sR0FBTixNQUFNLENBQWdCO1FBQ3RCLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDZixrQkFBYSxHQUFiLGFBQWEsQ0FBc0I7UUFDbkMsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUE2QjtRQXZDM0QsMENBQTBDO1FBQ2hDLDZCQUF3QixHQUFHLElBQUksWUFBWSxFQUFXLENBQUM7UUFFakUsMkJBQTJCO1FBQzNCLGVBQVUsR0FBNEIsRUFBRSxDQUFDO1FBS3pDLG1DQUFtQztRQUNuQyxxQkFBZ0IsR0FBYyxFQUFFLENBQUM7UUFFakMsNkNBQTZDO1FBQzdDLG9CQUFlLEdBQXlCLEVBQUUsQ0FBQztRQVEzQyxXQUFNLEdBQTBCLElB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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBZ0RiO2dCQUNHLE1BQU0sRUFBRSxDQUFDLCtOQUErTixDQUFDO2FBQzVPOzs7O1lBbkVRLFdBQVcsdUJBOEdILE1BQU0sU0FBQyxXQUFXO1lBL0cxQixjQUFjO1lBQUUsTUFBTTtZQUkzQixvQkFBb0I7WUFEcEIsMkJBQTJCOzs7b0JBdUUxQixLQUFLO3VDQUdMLE1BQU07cUNBdUJOLFNBQVMsU0FBQyxlQUFlO2lDQUd6QixZQUFZLFNBQUMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbmplY3QsIElucHV0LCBPbkluaXQsIE91dHB1dCwgUXVlcnlMaXN0LCBWaWV3Q2hpbGQsIFZpZXdDaGlsZHJlbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgICBHcmF2c2VhcmNoR2VuZXJhdGlvblNlcnZpY2UsXG4gICAgT250b2xvZ3lDYWNoZVNlcnZpY2UsXG4gICAgT250b2xvZ3lJbmZvcm1hdGlvbixcbiAgICBPbnRvbG9neU1ldGFkYXRhLFxuICAgIFByb3BlcnRpZXMsXG4gICAgUHJvcGVydHlXaXRoVmFsdWUsXG4gICAgUmVhZFJlc291cmNlc1NlcXVlbmNlLFxuICAgIFJlc291cmNlQ2xhc3Ncbn0gZnJvbSAnQGtub3JhL2NvcmUnO1xuaW1wb3J0IHsgU2VsZWN0UHJvcGVydHlDb21wb25lbnQgfSBmcm9tICcuL3NlbGVjdC1wcm9wZXJ0eS9zZWxlY3QtcHJvcGVydHkuY29tcG9uZW50JztcbmltcG9ydCB7IFNlbGVjdFJlc291cmNlQ2xhc3NDb21wb25lbnQgfSBmcm9tICcuL3NlbGVjdC1yZXNvdXJjZS1jbGFzcy9zZWxlY3QtcmVzb3VyY2UtY2xhc3MuY29tcG9uZW50JztcblxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2t1aS1leHRlbmRlZC1zZWFyY2gnLFxuICAgIHRlbXBsYXRlOiBgPGZvcm0gW2Zvcm1Hcm91cF09XCJmb3JtXCIgKG5nU3VibWl0KT1cInN1Ym1pdCgpXCI+XG5cbiAgPGRpdj5cbiAgICA8a3VpLXNlbGVjdC1vbnRvbG9neSAqbmdJZj1cIm9udG9sb2dpZXMubGVuZ3RoID4gMFwiIFtmb3JtR3JvdXBdPVwiZm9ybVwiIFtvbnRvbG9naWVzXT1cIm9udG9sb2dpZXNcIiAob250b2xvZ3lTZWxlY3RlZCk9XCJnZXRSZXNvdXJjZUNsYXNzZXNBbmRQcm9wZXJ0aWVzRm9yT250b2xvZ3koJGV2ZW50KVwiPjwva3VpLXNlbGVjdC1vbnRvbG9neT5cbiAgPC9kaXY+XG5cbiAgPGRpdiBjbGFzcz1cInNlbGVjdC1yZXNvdXJjZS1jbGFzc1wiICpuZ0lmPVwicmVzb3VyY2VDbGFzc2VzPy5sZW5ndGggPiAwXCI+XG4gICAgPGt1aS1zZWxlY3QtcmVzb3VyY2UtY2xhc3MgI3Jlc291cmNlQ2xhc3MgW2Zvcm1Hcm91cF09XCJmb3JtXCIgW3Jlc291cmNlQ2xhc3Nlc109XCJyZXNvdXJjZUNsYXNzZXNcIiAocmVzb3VyY2VDbGFzc1NlbGVjdGVkRXZlbnQpPVwiZ2V0UHJvcGVydGllc0ZvclJlc291cmNlQ2xhc3MoJGV2ZW50KVwiPjwva3VpLXNlbGVjdC1yZXNvdXJjZS1jbGFzcz5cbiAgPC9kaXY+XG5cbiAgPGRpdiBjbGFzcz1cInNlbGVjdC1wcm9wZXJ0eVwiICpuZ0lmPVwicHJvcGVydGllcyAhPT0gdW5kZWZpbmVkXCI+XG4gICAgPGRpdiAqbmdGb3I9XCJsZXQgcHJvcCBvZiBhY3RpdmVQcm9wZXJ0aWVzOyBsZXQgaSA9IGluZGV4XCI+XG5cbiAgICAgIDxrdWktc2VsZWN0LXByb3BlcnR5ICNwcm9wZXJ0eSBbYWN0aXZlUmVzb3VyY2VDbGFzc109XCJhY3RpdmVSZXNvdXJjZUNsYXNzXCIgW2Zvcm1Hcm91cF09XCJmb3JtXCIgW2luZGV4XT1cImlcIiBbcHJvcGVydGllc109XCJwcm9wZXJ0aWVzXCI+PC9rdWktc2VsZWN0LXByb3BlcnR5PlxuXG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuXG5cbiAgPGRpdj5cbiAgICA8YnV0dG9uIG1hdC1taW5pLWZhYiBjbGFzcz1cInByb3BlcnR5LWJ1dHRvbnMgYWRkLXByb3BlcnR5LWJ1dHRvblwiIGNvbG9yPVwicHJpbWFyeVwiIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwiYWRkUHJvcGVydHkoKVwiIFtkaXNhYmxlZF09XCJhY3RpdmVPbnRvbG9neSA9PT0gdW5kZWZpbmVkIHx8IGFjdGl2ZVByb3BlcnRpZXMubGVuZ3RoID49IDRcIj5cbiAgICAgIDxtYXQtaWNvbiBhcmlhLWxhYmVsPVwiYWRkIGEgcHJvcGVydHlcIj5hZGQ8L21hdC1pY29uPlxuICAgIDwvYnV0dG9uPlxuXG4gICAgPGJ1dHRvbiBtYXQtbWluaS1mYWIgY2xhc3M9XCJwcm9wZXJ0eS1idXR0b25zIHJlbW92ZS1wcm9wZXJ0eS1idXR0b25cIiBjb2xvcj1cInByaW1hcnlcIiB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cInJlbW92ZVByb3BlcnR5KClcIiBbZGlzYWJsZWRdPVwiYWN0aXZlUHJvcGVydGllcy5sZW5ndGggPT0gMFwiPlxuICAgICAgPG1hdC1pY29uIGFyaWEtbGFiZWw9XCJyZW1vdmUgcHJvcGVydHlcIj5yZW1vdmU8L21hdC1pY29uPlxuICAgIDwvYnV0dG9uPlxuICA8L2Rpdj5cblxuICA8IS0tICA8ZGl2PlxuICAgIDxidXR0b24gbWF0LWljb24tYnV0dG9uIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwicmVzZXRGb3JtKClcIiBbZGlzYWJsZWRdPVwidGhpcy5hY3RpdmVPbnRvbG9neSA9PT0gdW5kZWZpbmVkXCI+XG4gICAgICA8bWF0LWljb24gYXJpYS1sYWJlbD1cInJlc2V0IHF1ZXJ5IGZvcm1cIj5jbGVhcjwvbWF0LWljb24+XG4gICAgPC9idXR0b24+XG5cbiAgICA8YnV0dG9uIG1hdC1pY29uLWJ1dHRvbiB0eXBlPVwic3VibWl0XCIgW2Rpc2FibGVkXT1cIiFmb3JtVmFsaWRcIj5cbiAgICAgIDxtYXQtaWNvbiBhcmlhLWxhYmVsPVwic3VibWl0IHF1ZXJ5XCI+c2VuZDwvbWF0LWljb24+XG4gICAgPC9idXR0b24+XG4gIDwvZGl2PiAtLT5cblxuICA8YnV0dG9uIGNsYXNzPVwiZXh0ZW5kZWQtYnV0dG9ucyBleHRlbmRlZC1zZWFyY2gtYnV0dG9uXCIgbWF0LXN0cm9rZWQtYnV0dG9uIGNvbG9yPVwicHJpbWFyeVwiIHR5cGU9XCJzdWJtaXRcIiBbZGlzYWJsZWRdPVwiIWZvcm1WYWxpZFwiPlxuICAgIFNlYXJjaFxuICA8L2J1dHRvbj5cbiAgPGJ1dHRvbiBjbGFzcz1cImV4dGVuZGVkLWJ1dHRvbnMgcmVzZXRcIiBtYXQtc3Ryb2tlZC1idXR0b24gdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJyZXNldEZvcm0oKVwiIFtkaXNhYmxlZF09XCJ0aGlzLmFjdGl2ZU9udG9sb2d5ID09PSB1bmRlZmluZWRcIj5cbiAgICBSZXNldFxuICA8L2J1dHRvbj5cblxuXG48L2Zvcm0+XG5gLFxuICAgIHN0eWxlczogW2AuYWRkLXByb3BlcnR5LWJ1dHRvbnttYXJnaW4tcmlnaHQ6NXB4fS5leHRlbmRlZC1idXR0b25ze21hcmdpbi10b3A6MjVweH0uZXh0ZW5kZWQtc2VhcmNoLWJ1dHRvbnttYXJnaW4tcmlnaHQ6NXB4fS5wcm9wZXJ0eS1idXR0b25ze21hcmdpbi10b3A6MjVweH0uc2VsZWN0LXByb3BlcnR5e21hcmdpbi1sZWZ0OjIycHh9LnNlbGVjdC1yZXNvdXJjZS1jbGFzc3ttYXJnaW4tbGVmdDoxMnB4fWBdXG59KVxuZXhwb3J0IGNsYXNzIEV4dGVuZGVkU2VhcmNoQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSByb3V0ZSAtIFJvdXRlIGFmdGVyIHNlYXJjaFxuICAgICAqL1xuICAgIEBJbnB1dCgpIHJvdXRlO1xuXG4gICAgLy8gdHJpZ2dlciB0b2dnbGUgZm9yIGV4dGVuZGVkIHNlYXJjaCBmb3JtXG4gICAgQE91dHB1dCgpIHRvZ2dsZUV4dGVuZGVkU2VhcmNoRm9ybSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICAgIC8vIGFsbCBhdmFpbGFibGUgb250b2xvZ2llc1xuICAgIG9udG9sb2dpZXM6IEFycmF5PE9udG9sb2d5TWV0YWRhdGE+ID0gW107XG5cbiAgICAvLyBvbnRvbG9neSBjaG9zZW4gYnkgdGhlIHVzZXJcbiAgICBhY3RpdmVPbnRvbG9neTogc3RyaW5nO1xuXG4gICAgLy8gcHJvcGVydGllcyBzcGVjaWZpZWQgYnkgdGhlIHVzZXJcbiAgICBhY3RpdmVQcm9wZXJ0aWVzOiBib29sZWFuW10gPSBbXTtcblxuICAgIC8vIHJlc291cmNlIGNsYXNzZXMgZm9yIHRoZSBzZWxlY3RlZCBvbnRvbG9neVxuICAgIHJlc291cmNlQ2xhc3NlczogQXJyYXk8UmVzb3VyY2VDbGFzcz4gPSBbXTtcblxuICAgIC8vIGRlZmluaXRpb24gb2YgdGhlIHNlbGVjdGVkIHJlc291cmNlIGNsYXNzLCBpZiBzZXQuXG4gICAgYWN0aXZlUmVzb3VyY2VDbGFzczogUmVzb3VyY2VDbGFzcztcblxuICAgIC8vIHByb3BlcnRpZXMgZm9yIHRoZSBzZWxlY3RlZCBvbnRvbG9neSBvciBzZWxlY3RlZCByZXNvdXJjZSBjbGFzc1xuICAgIHByb3BlcnRpZXM6IFByb3BlcnRpZXM7XG5cbiAgICByZXN1bHQ6IFJlYWRSZXNvdXJjZXNTZXF1ZW5jZSA9IG5ldyBSZWFkUmVzb3VyY2VzU2VxdWVuY2UoW10sIDApO1xuXG4gICAgLy8gcmVmZXJlbmNlIHRvIHRoZSBjb21wb25lbnQgdGhhdCBjb250cm9scyB0aGUgcmVzb3VyY2UgY2xhc3Mgc2VsZWN0aW9uXG4gICAgQFZpZXdDaGlsZCgncmVzb3VyY2VDbGFzcycpIHJlc291cmNlQ2xhc3NDb21wb25lbnQ6IFNlbGVjdFJlc291cmNlQ2xhc3NDb21wb25lbnQ7XG5cbiAgICAvLyByZWZlcmVuY2UgdG8gdGhlIGNvbXBvbmVudCBjb250cm9sbGluZyB0aGUgcHJvcGVydHkgc2VsZWN0aW9uXG4gICAgQFZpZXdDaGlsZHJlbigncHJvcGVydHknKSBwcm9wZXJ0eUNvbXBvbmVudHM6IFF1ZXJ5TGlzdDxTZWxlY3RQcm9wZXJ0eUNvbXBvbmVudD47XG5cbiAgICAvLyBGb3JtR3JvdXAgKHVzZWQgYXMgcGFyZW50IGZvciBjaGlsZCBjb21wb25lbnRzKVxuICAgIGZvcm06IEZvcm1Hcm91cDtcblxuICAgIC8vIGZvcm0gdmFsaWRhdGlvbiBzdGF0dXNcbiAgICBmb3JtVmFsaWQgPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRm9ybUJ1aWxkZXIpIHByaXZhdGUgZmI6IEZvcm1CdWlsZGVyLFxuICAgICAgICBwcml2YXRlIF9yb3V0ZTogQWN0aXZhdGVkUm91dGUsXG4gICAgICAgIHByaXZhdGUgX3JvdXRlcjogUm91dGVyLFxuICAgICAgICBwcml2YXRlIF9jYWNoZVNlcnZpY2U6IE9udG9sb2d5Q2FjaGVTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIF9ncmF2U2VhcmNoU2VydmljZTogR3JhdnNlYXJjaEdlbmVyYXRpb25TZXJ2aWNlKSB7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG5cbiAgICAgICAgLy8gcGFyZW50IGZvcm0gaXMgZW1wdHksIGl0IGdldHMgcGFzc2VkIHRvIHRoZSBjaGlsZCBjb21wb25lbnRzXG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe30pO1xuXG4gICAgICAgIC8vIGlmIGZvcm0gc3RhdHVzIGNoYW5nZXMsIHJlLXJ1biB2YWxpZGF0aW9uXG4gICAgICAgIHRoaXMuZm9ybS5zdGF0dXNDaGFuZ2VzLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mb3JtVmFsaWQgPSB0aGlzLnZhbGlkYXRlRm9ybSgpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5mb3JtKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gaW5pdGlhbGl6ZSBvbnRvbG9naWVzIHRvIGJlIHVzZWQgZm9yIHRoZSBvbnRvbG9naWVzIHNlbGVjdGlvbiBpbiB0aGUgc2VhcmNoIGZvcm1cbiAgICAgICAgdGhpcy5pbml0aWFsaXplT250b2xvZ2llcygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBhIHByb3BlcnR5IHRvIHRoZSBzZWFyY2ggZm9ybS5cbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgYWRkUHJvcGVydHkoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYWN0aXZlUHJvcGVydGllcy5wdXNoKHRydWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSB0aGUgbGFzdCBwcm9wZXJ0eSBmcm9tIHRoZSBzZWFyY2ggZm9ybS5cbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgcmVtb3ZlUHJvcGVydHkoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYWN0aXZlUHJvcGVydGllcy5zcGxpY2UoLTEsIDEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYWxsIGF2YWlsYWJsZSBvbnRvbG9naWVzIGZvciB0aGUgc2VhcmNoIGZvcm0uXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIGluaXRpYWxpemVPbnRvbG9naWVzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9jYWNoZVNlcnZpY2UuZ2V0T250b2xvZ2llc01ldGFkYXRhKCkuc3Vic2NyaWJlKFxuICAgICAgICAgICAgKG9udG9sb2dpZXM6IEFycmF5PE9udG9sb2d5TWV0YWRhdGE+KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbnRvbG9naWVzID0gb250b2xvZ2llcztcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9uY2UgYW4gb250b2xvZ3kgaGFzIGJlZW4gc2VsZWN0ZWQsIGdldHMgaXRzIGNsYXNzZXMgYW5kIHByb3BlcnRpZXMuXG4gICAgICogVGhlIGNsYXNzZXMgYW5kIHByb3BlcnRpZXMgd2lsbCBiZSBtYWRlIGF2YWlsYWJsZSB0byB0aGUgdXNlciBmb3Igc2VsZWN0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIG9udG9sb2d5SXJpIElyaSBvZiB0aGUgb250b2xvZ3kgY2hvc2VuIGJ5IHRoZSB1c2VyLlxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBnZXRSZXNvdXJjZUNsYXNzZXNBbmRQcm9wZXJ0aWVzRm9yT250b2xvZ3kob250b2xvZ3lJcmk6IHN0cmluZyk6IHZvaWQge1xuXG4gICAgICAgIC8vIHJlc2V0IGFjdGl2ZSByZXNvdXJjZSBjbGFzcyBkZWZpbml0aW9uXG4gICAgICAgIHRoaXMuYWN0aXZlUmVzb3VyY2VDbGFzcyA9IHVuZGVmaW5lZDtcblxuICAgICAgICAvLyByZXNldCBzcGVjaWZpZWQgcHJvcGVydGllc1xuICAgICAgICB0aGlzLmFjdGl2ZVByb3BlcnRpZXMgPSBbXTtcblxuICAgICAgICB0aGlzLmFjdGl2ZU9udG9sb2d5ID0gb250b2xvZ3lJcmk7XG5cbiAgICAgICAgdGhpcy5fY2FjaGVTZXJ2aWNlLmdldEVudGl0eURlZmluaXRpb25zRm9yT250b2xvZ2llcyhbb250b2xvZ3lJcmldKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAob250b0luZm86IE9udG9sb2d5SW5mb3JtYXRpb24pID0+IHtcblxuICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VDbGFzc2VzID0gb250b0luZm8uZ2V0UmVzb3VyY2VDbGFzc2VzQXNBcnJheSh0cnVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBvbnRvSW5mby5nZXRQcm9wZXJ0aWVzKCk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9uY2UgYSByZXNvdXJjZSBjbGFzcyBoYXMgYmVlbiBzZWxlY3RlZCwgZ2V0cyBpdHMgcHJvcGVydGllcy5cbiAgICAgKiBUaGUgcHJvcGVydGllcyB3aWxsIGJlIG1hZGUgYXZhaWxhYmxlIHRvIHRoZSB1c2VyIGZvciBzZWxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcmVzb3VyY2VDbGFzc0lyaVxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBnZXRQcm9wZXJ0aWVzRm9yUmVzb3VyY2VDbGFzcyhyZXNvdXJjZUNsYXNzSXJpOiBzdHJpbmcpOiB2b2lkIHtcblxuICAgICAgICAvLyByZXNldCBzcGVjaWZpZWQgcHJvcGVydGllc1xuICAgICAgICB0aGlzLmFjdGl2ZVByb3BlcnRpZXMgPSBbXTtcblxuICAgICAgICAvLyBpZiB0aGUgY2xpZW50IHVuZG9lcyB0aGUgc2VsZWN0aW9uIG9mIGEgcmVzb3VyY2UgY2xhc3MsIHVzZSB0aGUgYWN0aXZlIG9udG9sb2d5IGFzIGEgZmFsbGJhY2tcbiAgICAgICAgaWYgKHJlc291cmNlQ2xhc3NJcmkgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0UmVzb3VyY2VDbGFzc2VzQW5kUHJvcGVydGllc0Zvck9udG9sb2d5KHRoaXMuYWN0aXZlT250b2xvZ3kpO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICB0aGlzLl9jYWNoZVNlcnZpY2UuZ2V0UmVzb3VyY2VDbGFzc0RlZmluaXRpb25zKFtyZXNvdXJjZUNsYXNzSXJpXSkuc3Vic2NyaWJlKFxuICAgICAgICAgICAgICAgIChvbnRvSW5mbzogT250b2xvZ3lJbmZvcm1hdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBvbnRvSW5mby5nZXRQcm9wZXJ0aWVzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hY3RpdmVSZXNvdXJjZUNsYXNzID0gb250b0luZm8uZ2V0UmVzb3VyY2VDbGFzc2VzKClbcmVzb3VyY2VDbGFzc0lyaV07XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFZhbGlkYXRlcyBmb3JtIGFuZCByZXR1cm5zIGl0cyBzdGF0dXMgKGJvb2xlYW4pLlxuICAgICAqL1xuICAgIHByaXZhdGUgdmFsaWRhdGVGb3JtKCkge1xuXG4gICAgICAgIC8vIGNoZWNrIHRoYXQgZWl0aGVyIGEgcmVzb3VyY2UgY2xhc3MgaXMgc2VsZWN0ZWQgb3IgYXQgbGVhc3Qgb25lIHByb3BlcnR5IGlzIHNwZWNpZmllZFxuICAgICAgICByZXR1cm4gdGhpcy5mb3JtLnZhbGlkICYmXG4gICAgICAgICAgICAodGhpcy5wcm9wZXJ0eUNvbXBvbmVudHMubGVuZ3RoID4gMCB8fCAodGhpcy5yZXNvdXJjZUNsYXNzQ29tcG9uZW50ICE9PSB1bmRlZmluZWQgJiYgdGhpcy5yZXNvdXJjZUNsYXNzQ29tcG9uZW50LmdldFJlc291cmNlQ2xhc3NTZWxlY3RlZCgpICE9PSBmYWxzZSkpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzZXRzIHRoZSBmb3JtIChzZWxlY3RlZCByZXNvdXJjZSBjbGFzcyBhbmQgc3BlY2lmaWVkIHByb3BlcnRpZXMpIHByZXNlcnZpbmcgdGhlIGFjdGl2ZSBvbnRvbG9neS5cbiAgICAgKi9cbiAgICByZXNldEZvcm0oKSB7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZU9udG9sb2d5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0UmVzb3VyY2VDbGFzc2VzQW5kUHJvcGVydGllc0Zvck9udG9sb2d5KHRoaXMuYWN0aXZlT250b2xvZ3kpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgR3JhdlNlYXJjaCBxdWVyeSB3aXRoIHRoZSBnaXZlbiBmb3JtIHZhbHVlcyBhbmQgY2FsbHMgdGhlIGV4dGVuZGVkIHNlYXJjaCByb3V0ZS5cbiAgICAgKi9cbiAgICBzdWJtaXQoKSB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmZvcm1WYWxpZCkgcmV0dXJuOyAvLyBjaGVjayB0aGF0IGZyb20gaXMgdmFsaWRcblxuICAgICAgICBjb25zdCByZXNDbGFzc09wdGlvbiA9IHRoaXMucmVzb3VyY2VDbGFzc0NvbXBvbmVudC5nZXRSZXNvdXJjZUNsYXNzU2VsZWN0ZWQoKTtcblxuICAgICAgICBsZXQgcmVzQ2xhc3M7XG5cbiAgICAgICAgaWYgKHJlc0NsYXNzT3B0aW9uICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgcmVzQ2xhc3MgPSByZXNDbGFzc09wdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHByb3BlcnRpZXM6IFByb3BlcnR5V2l0aFZhbHVlW10gPSB0aGlzLnByb3BlcnR5Q29tcG9uZW50cy5tYXAoXG4gICAgICAgICAgICAocHJvcENvbXApID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcENvbXAuZ2V0UHJvcGVydHlTZWxlY3RlZFdpdGhWYWx1ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IGdyYXZzZWFyY2ggPSB0aGlzLl9ncmF2U2VhcmNoU2VydmljZS5jcmVhdGVHcmF2c2VhcmNoUXVlcnkocHJvcGVydGllcywgcmVzQ2xhc3MsIDApO1xuXG4gICAgICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbdGhpcy5yb3V0ZSArICcvZXh0ZW5kZWQvJywgZ3JhdnNlYXJjaF0sIHsgcmVsYXRpdmVUbzogdGhpcy5fcm91dGUgfSk7XG5cbiAgICAgICAgLy8gdG9nZ2xlIGV4dGVuZGVkIHNlYXJjaCBmb3JtXG4gICAgICAgIHRoaXMudG9nZ2xlRXh0ZW5kZWRTZWFyY2hGb3JtLmVtaXQodHJ1ZSk7XG5cbiAgICB9XG5cbn1cbiJdfQ==