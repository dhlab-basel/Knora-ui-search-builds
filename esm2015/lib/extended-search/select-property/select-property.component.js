import { Component, Inject, Input, ViewChild } from '@angular/core';
import { CardinalityOccurrence, Properties, PropertyWithValue, ResourceClass } from '@knora/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpecifyPropertyValueComponent } from './specify-property-value/specify-property-value.component';
import { OntologyInformation } from '@knora/core';
// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
const resolvedPromise = Promise.resolve(null);
export class SelectPropertyComponent {
    constructor(fb) {
        this.fb = fb;
    }
    // setter method for properties when being updated by parent component
    set properties(value) {
        this.propertySelected = undefined; // reset selected property (overwriting any previous selection)
        this._properties = value;
        this.updatePropertiesArray();
    }
    get properties() {
        return this._properties;
    }
    // setter method for selected resource class
    set activeResourceClass(value) {
        this._activeResourceClass = value;
    }
    ngOnInit() {
        // build a form for the property selection
        this.form = this.fb.group({
            property: [null, Validators.required],
            isSortCriterion: [false, Validators.required]
        });
        // update the selected property
        this.form.valueChanges.subscribe((data) => {
            const propIri = data.property;
            this.propertySelected = this._properties[propIri];
        });
        resolvedPromise.then(() => {
            this.propIndex = 'property' + this.index;
            // add form to the parent form group
            this.formGroup.addControl(this.propIndex, this.form);
        });
    }
    ngOnDestroy() {
        // remove form from the parent form group
        resolvedPromise.then(() => {
            this.formGroup.removeControl(this.propIndex);
        });
    }
    /**
     * Indicates if property can be used as a sort criterion.
     * Property has to have cardinality or max cardinality 1 for the chosen resource class.
     *
     * We cannot sort by properties whose cardinality is greater than 1.
     * Return boolean
     */
    sortCriterion() {
        // check if a resource class is selected and if the property's cardinality is 1 for the selected resource class
        if (this._activeResourceClass !== undefined && this.propertySelected !== undefined && !this.propertySelected.isLinkProperty) {
            const cardinalities = this._activeResourceClass.cardinalities.filter((card) => {
                // cardinality 1 or max occurrence 1
                return card.property === this.propertySelected.id
                    && card.value === 1
                    && (card.occurrence === CardinalityOccurrence.card || card.occurrence === CardinalityOccurrence.maxCard);
            });
            return cardinalities.length === 1;
        }
        else {
            return false;
        }
    }
    /**
     * Updates the properties array that is accessed by the template.
     */
    updatePropertiesArray() {
        // represent the properties as an array to be accessed by the template
        const propsArray = [];
        for (const propIri in this._properties) {
            if (this._properties.hasOwnProperty(propIri)) {
                const prop = this._properties[propIri];
                // only list editable props that are not link value props
                if (prop.isEditable && !prop.isLinkValueProperty) {
                    propsArray.push(this._properties[propIri]);
                }
            }
        }
        // sort properties by label (ascending)
        propsArray.sort(OntologyInformation.sortFunc);
        this.propertiesAsArray = propsArray;
    }
    /**
     * Returns the selected property with the specified value.
     */
    getPropertySelectedWithValue() {
        const propVal = this.specifyPropertyValue.getComparisonOperatorAndValueLiteralForProperty();
        let isSortCriterion = false;
        // only non linking properties can be used for sorting
        if (!this.propertySelected.isLinkProperty) {
            isSortCriterion = this.form.value.isSortCriterion;
        }
        return new PropertyWithValue(this.propertySelected, propVal, isSortCriterion);
    }
}
SelectPropertyComponent.decorators = [
    { type: Component, args: [{
                selector: 'kui-select-property',
                template: `<mat-form-field class="search-property-field" *ngIf="propertiesAsArray?.length > 0">
  <mat-select placeholder="Properties" [formControl]="form.controls['property']">
    <mat-option *ngFor="let prop of propertiesAsArray" [value]="prop.id">{{ prop.label }}</mat-option>
  </mat-select>
</mat-form-field>

<kui-specify-property-value #specifyPropertyValue [formGroup]="form" *ngIf="propertySelected !== undefined" [property]="propertySelected"></kui-specify-property-value>

<mat-checkbox matTooltip="Sort criterion" *ngIf="propertySelected !== undefined && sortCriterion()" [formControl]="form.controls['isSortCriterion']"></mat-checkbox>`,
                styles: [`.search-property-field{margin-right:8px}`]
            },] },
];
/** @nocollapse */
SelectPropertyComponent.ctorParameters = () => [
    { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
];
SelectPropertyComponent.propDecorators = {
    formGroup: [{ type: Input }],
    index: [{ type: Input }],
    properties: [{ type: Input }],
    activeResourceClass: [{ type: Input }],
    specifyPropertyValue: [{ type: ViewChild, args: ['specifyPropertyValue',] }]
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LXByb3BlcnR5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Brbm9yYS9zZWFyY2gvIiwic291cmNlcyI6WyJsaWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zZWxlY3QtcHJvcGVydHkuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBcUIsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3ZGLE9BQU8sRUFFSCxxQkFBcUIsRUFFckIsVUFBVSxFQUVWLGlCQUFpQixFQUNqQixhQUFhLEVBQ2hCLE1BQU0sYUFBYSxDQUFDO0FBQ3JCLE9BQU8sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3BFLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLDJEQUEyRCxDQUFDO0FBQzFHLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUdsRCx3SEFBd0g7QUFDeEgsTUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQWU5QyxNQUFNO0lBNkNGLFlBQXlDLEVBQWU7UUFBZixPQUFFLEdBQUYsRUFBRSxDQUFhO0lBRXhELENBQUM7SUF2Q0Qsc0VBQXNFO0lBQ3RFLElBQ0ksVUFBVSxDQUFDLEtBQWlCO1FBQzVCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLENBQUMsQ0FBQywrREFBK0Q7UUFDbEcsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDekIsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7SUFDakMsQ0FBQztJQUVELElBQUksVUFBVTtRQUNYLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMzQixDQUFDO0lBSUQsNENBQTRDO0lBQzVDLElBQ0ksbUJBQW1CLENBQUMsS0FBb0I7UUFDeEMsSUFBSSxD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UUFFOUMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLFVBQVUsQ0FBQztJQUN4QyxDQUFDO0lBRUQ7O09BRUc7SUFDSCw0QkFBNEI7UUFFeEIsTUFBTSxPQUFPLEdBQStCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQywrQ0FBK0MsRUFBRSxDQUFDO1FBRXhILElBQUksZUFBZSxHQUFHLEtBQUssQ0FBQztRQUU1QixzREFBc0Q7UUFDdEQsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUU7WUFDdkMsZUFBZSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQztTQUNyRDtRQUVELE9BQU8sSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBRWxGLENBQUM7OztZQW5LSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLHFCQUFxQjtnQkFDL0IsUUFBUSxFQUFFOzs7Ozs7OztxS0FRdUo7Z0JBQ2pLLE1BQU0sRUFBRSxDQUFDLDBDQUEwQyxDQUFDO2FBQ3ZEOzs7O1lBcEJRLFdBQVcsdUJBa0VILE1BQU0sU0FBQyxXQUFXOzs7d0JBMUM5QixLQUFLO29CQUdMLEtBQUs7eUJBR0wsS0FBSztrQ0FjTCxLQUFLO21DQU1MLFNBQVMsU0FBQyxzQkFBc0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEluamVjdCwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gICAgQ2FyZGluYWxpdHksXG4gICAgQ2FyZGluYWxpdHlPY2N1cnJlbmNlLFxuICAgIENvbXBhcmlzb25PcGVyYXRvckFuZFZhbHVlLFxuICAgIFByb3BlcnRpZXMsXG4gICAgUHJvcGVydHksXG4gICAgUHJvcGVydHlXaXRoVmFsdWUsXG4gICAgUmVzb3VyY2VDbGFzc1xufSBmcm9tICdAa25vcmEvY29yZSc7XG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgU3BlY2lmeVByb3BlcnR5VmFsdWVDb21wb25lbnQgfSBmcm9tICcuL3NwZWNpZnktcHJvcGVydHktdmFsdWUvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT250b2xvZ3lJbmZvcm1hdGlvbiB9IGZyb20gJ0Brbm9yYS9jb3JlJztcblxuXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NTY2MTAxMC9keW5hbWljLW5lc3RlZC1yZWFjdGl2ZS1mb3JtLWV4cHJlc3Npb25jaGFuZ2VkYWZ0ZXJpdGhhc2JlZW5jaGVja2VkZXJyb3JcbmNvbnN0IHJlc29sdmVkUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShudWxsKTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdrdWktc2VsZWN0LXByb3BlcnR5JyxcbiAgICB0ZW1wbGF0ZTogYDxtYXQtZm9ybS1maWVsZCBjbGFzcz1cInNlYXJjaC1wcm9wZXJ0eS1maWVsZFwiICpuZ0lmPVwicHJvcGVydGllc0FzQXJyYXk/Lmxlbmd0aCA+IDBcIj5cbiAgPG1hdC1zZWxlY3QgcGxhY2Vob2xkZXI9XCJQcm9wZXJ0aWVzXCIgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ3Byb3BlcnR5J11cIj5cbiAgICA8bWF0LW9wdGlvbiAqbmdGb3I9XCJsZXQgcHJvcCBvZiBwcm9wZXJ0aWVzQXNBcnJheVwiIFt2YWx1ZV09XCJwcm9wLmlkXCI+e3sgcHJvcC5sYWJlbCB9fTwvbWF0LW9wdGlvbj5cbiAgPC9tYXQtc2VsZWN0PlxuPC9tYXQtZm9ybS1maWVsZD5cblxuPGt1aS1zcGVjaWZ5LXByb3BlcnR5LXZhbHVlICNzcGVjaWZ5UHJvcGVydHlWYWx1ZSBbZm9ybUdyb3VwXT1cImZvcm1cIiAqbmdJZj1cInByb3BlcnR5U2VsZWN0ZWQgIT09IHVuZGVmaW5lZFwiIFtwcm9wZXJ0eV09XCJwcm9wZXJ0eVNlbGVjdGVkXCI+PC9rdWktc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZT5cblxuPG1hdC1jaGVja2JveCBtYXRUb29sdGlwPVwiU29ydCBjcml0ZXJpb25cIiAqbmdJZj1cInByb3BlcnR5U2VsZWN0ZWQgIT09IHVuZGVmaW5lZCAmJiBzb3J0Q3JpdGVyaW9uKClcIiBbZm9ybUNvbnRyb2xdPVwiZm9ybS5jb250cm9sc1snaXNTb3J0Q3JpdGVyaW9uJ11cIj48L21hdC1jaGVja2JveD5gLFxuICAgIHN0eWxlczogW2Auc2VhcmNoLXByb3BlcnR5LWZpZWxke21hcmdpbi1yaWdodDo4cHh9YF1cbn0pXG5leHBvcnQgY2xhc3MgU2VsZWN0UHJvcGVydHlDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG5cbiAgICAvLyBwYXJlbnQgRm9ybUdyb3VwXG4gICAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgICAvLyBpbmRleCBvZiB0aGUgZ2l2ZW4gcHJvcGVydHkgKHVuaXF1ZSlcbiAgICBASW5wdXQoKSBpbmRleDogbnVtYmVyO1xuXG4gICAgLy8gc2V0dGVyIG1ldGhvZCBmb3IgcHJvcGVydGllcyB3aGVuIGJlaW5nIHVwZGF0ZWQgYnkgcGFyZW50IGNvbXBvbmVudFxuICAgIEBJbnB1dCgpXG4gICAgc2V0IHByb3BlcnRpZXModmFsdWU6IFByb3BlcnRpZXMpIHtcbiAgICAgICAgdGhpcy5wcm9wZXJ0eVNlbGVjdGVkID0gdW5kZWZpbmVkOyAvLyByZXNldCBzZWxlY3RlZCBwcm9wZXJ0eSAob3ZlcndyaXRpbmcgYW55IHByZXZpb3VzIHNlbGVjdGlvbilcbiAgICAgICAgdGhpcy5fcHJvcGVydGllcyA9IHZhbHVlO1xuICAgICAgICB0aGlzLnVwZGF0ZVByb3BlcnRpZXNBcnJheSgpO1xuICAgIH1cblxuICAgIGdldCBwcm9wZXJ0aWVzKCkge1xuICAgICAgIHJldHVybiB0aGlzLl9wcm9wZXJ0aWVzO1xuICAgIH1cblxuICAgIF9hY3RpdmVSZXNvdXJjZUNsYXNzOiBSZXNvdXJjZUNsYXNzO1xuXG4gICAgLy8gc2V0dGVyIG1ldGhvZCBmb3Igc2VsZWN0ZWQgcmVzb3VyY2UgY2xhc3NcbiAgICBASW5wdXQoKVxuICAgIHNldCBhY3RpdmVSZXNvdXJjZUNsYXNzKHZhbHVlOiBSZXNvdXJjZUNsYXNzKSB7XG4gICAgICAgIHRoaXMuX2FjdGl2ZVJlc291cmNlQ2xhc3MgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICAvLyByZWZlcmVuY2UgdG8gY2hpbGQgY29tcG9uZW50OiBjb21iaW5hdGlvbiBvZiBjb21wYXJpc29uIG9wZXJhdG9yIGFuZCB2YWx1ZSBmb3IgY2hvc2VuIHByb3BlcnR5XG4gICAgQFZpZXdDaGlsZCgnc3BlY2lmeVByb3BlcnR5VmFsdWUnKSBzcGVjaWZ5UHJvcGVydHlWYWx1ZTogU3BlY2lmeVByb3BlcnR5VmFsdWVDb21wb25lbnQ7XG5cbiAgICAvLyBwcm9wZXJ0aWVzIHRoYXQgY2FuIGJlIHNlbGVjdGVkIGZyb21cbiAgICBwcml2YXRlIF9wcm9wZXJ0aWVzOiBQcm9wZXJ0aWVzO1xuXG4gICAgLy8gcHJvcGVydGllcyBhcyBhbiBBcnJheSBzdHJ1Y3R1cmUgKGJhc2VkIG9uIHRoaXMucHJvcGVydGllcylcbiAgICBwcm9wZXJ0aWVzQXNBcnJheTogQXJyYXk8UHJvcGVydHk+O1xuXG4gICAgLy8gcmVwcmVzZW50cyB0aGUgY3VycmVudGx5IHNlbGVjdGVkIHByb3BlcnR5XG4gICAgcHJvcGVydHlTZWxlY3RlZDogUHJvcGVydHk7XG5cbiAgICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgICAvLyB1bmlxdWUgbmFtZSBmb3IgdGhpcyBwcm9wZXJ0eSB0byBiZSB1c2VkIGluIHRoZSBwYXJlbnQgRm9ybUdyb3VwXG4gICAgcHJvcEluZGV4OiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlcikge1xuXG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG5cbiAgICAgICAgLy8gYnVpbGQgYSBmb3JtIGZvciB0aGUgcHJvcGVydHkgc2VsZWN0aW9uXG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgICAgICAgcHJvcGVydHk6IFtudWxsLCBWYWxpZGF0b3JzLnJlcXVpcmVkXSxcbiAgICAgICAgICAgIGlzU29ydENyaXRlcmlvbjogW2ZhbHNlLCBWYWxpZGF0b3JzLnJlcXVpcmVkXVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyB1cGRhdGUgdGhlIHNlbGVjdGVkIHByb3BlcnR5XG4gICAgICAgIHRoaXMuZm9ybS52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwcm9wSXJpID0gZGF0YS5wcm9wZXJ0eTtcbiAgICAgICAgICAgIHRoaXMucHJvcGVydHlTZWxlY3RlZCA9IHRoaXMuX3Byb3BlcnRpZXNbcHJvcElyaV07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucHJvcEluZGV4ID0gJ3Byb3BlcnR5JyArIHRoaXMuaW5kZXg7XG5cbiAgICAgICAgICAgIC8vIGFkZCBmb3JtIHRvIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAuYWRkQ29udHJvbCh0aGlzLnByb3BJbmRleCwgdGhpcy5mb3JtKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcblxuICAgICAgICAvLyByZW1vdmUgZm9ybSBmcm9tIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5yZW1vdmVDb250cm9sKHRoaXMucHJvcEluZGV4KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5kaWNhdGVzIGlmIHByb3BlcnR5IGNhbiBiZSB1c2VkIGFzIGEgc29ydCBjcml0ZXJpb24uXG4gICAgICogUHJvcGVydHkgaGFzIHRvIGhhdmUgY2FyZGluYWxpdHkgb3IgbWF4IGNhcmRpbmFsaXR5IDEgZm9yIHRoZSBjaG9zZW4gcmVzb3VyY2UgY2xhc3MuXG4gICAgICpcbiAgICAgKiBXZSBjYW5ub3Qgc29ydCBieSBwcm9wZXJ0aWVzIHdob3NlIGNhcmRpbmFsaXR5IGlzIGdyZWF0ZXIgdGhhbiAxLlxuICAgICAqIFJldHVybiBib29sZWFuXG4gICAgICovXG4gICAgc29ydENyaXRlcmlvbigpIHtcblxuICAgICAgICAvLyBjaGVjayBpZiBhIHJlc291cmNlIGNsYXNzIGlzIHNlbGVjdGVkIGFuZCBpZiB0aGUgcHJvcGVydHkncyBjYXJkaW5hbGl0eSBpcyAxIGZvciB0aGUgc2VsZWN0ZWQgcmVzb3VyY2UgY2xhc3NcbiAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZVJlc291cmNlQ2xhc3MgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnByb3BlcnR5U2VsZWN0ZWQgIT09IHVuZGVmaW5lZCAmJiAhdGhpcy5wcm9wZXJ0eVNlbGVjdGVkLmlzTGlua1Byb3BlcnR5KSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGNhcmRpbmFsaXRpZXM6IENhcmRpbmFsaXR5W10gPSB0aGlzLl9hY3RpdmVSZXNvdXJjZUNsYXNzLmNhcmRpbmFsaXRpZXMuZmlsdGVyKFxuICAgICAgICAgICAgICAgIChjYXJkOiBDYXJkaW5hbGl0eSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBjYXJkaW5hbGl0eSAxIG9yIG1heCBvY2N1cnJlbmNlIDFcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhcmQucHJvcGVydHkgPT09IHRoaXMucHJvcGVydHlTZWxlY3RlZC5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgY2FyZC52YWx1ZSA9PT0gMVxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgKGNhcmQub2NjdXJyZW5jZSA9PT0gQ2FyZGluYWxpdHlPY2N1cnJlbmNlLmNhcmQgfHwgY2FyZC5vY2N1cnJlbmNlID09PSBDYXJkaW5hbGl0eU9jY3VycmVuY2UubWF4Q2FyZClcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHJldHVybiBjYXJkaW5hbGl0aWVzLmxlbmd0aCA9PT0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgcHJvcGVydGllcyBhcnJheSB0aGF0IGlzIGFjY2Vzc2VkIGJ5IHRoZSB0ZW1wbGF0ZS5cbiAgICAgKi9cbiAgICBwcml2YXRlIHVwZGF0ZVByb3BlcnRpZXNBcnJheSgpIHtcblxuICAgICAgICAvLyByZXByZXNlbnQgdGhlIHByb3BlcnRpZXMgYXMgYW4gYXJyYXkgdG8gYmUgYWNjZXNzZWQgYnkgdGhlIHRlbXBsYXRlXG4gICAgICAgIGNvbnN0IHByb3BzQXJyYXkgPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IHByb3BJcmkgaW4gdGhpcy5fcHJvcGVydGllcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3Byb3BlcnRpZXMuaGFzT3duUHJvcGVydHkocHJvcElyaSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9wID0gdGhpcy5fcHJvcGVydGllc1twcm9wSXJpXTtcblxuICAgICAgICAgICAgICAgIC8vIG9ubHkgbGlzdCBlZGl0YWJsZSBwcm9wcyB0aGF0IGFyZSBub3QgbGluayB2YWx1ZSBwcm9wc1xuICAgICAgICAgICAgICAgIGlmIChwcm9wLmlzRWRpdGFibGUgJiYgIXByb3AuaXNMaW5rVmFsdWVQcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wc0FycmF5LnB1c2godGhpcy5fcHJvcGVydGllc1twcm9wSXJpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gc29ydCBwcm9wZXJ0aWVzIGJ5IGxhYmVsIChhc2NlbmRpbmcpXG4gICAgICAgIHByb3BzQXJyYXkuc29ydChPbnRvbG9neUluZm9ybWF0aW9uLnNvcnRGdW5jKTtcblxuICAgICAgICB0aGlzLnByb3BlcnRpZXNBc0FycmF5ID0gcHJvcHNBcnJheTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBzZWxlY3RlZCBwcm9wZXJ0eSB3aXRoIHRoZSBzcGVjaWZpZWQgdmFsdWUuXG4gICAgICovXG4gICAgZ2V0UHJvcGVydHlTZWxlY3RlZFdpdGhWYWx1ZSgpOiBQcm9wZXJ0eVdpdGhWYWx1ZSB7XG5cbiAgICAgICAgY29uc3QgcHJvcFZhbDogQ29tcGFyaXNvbk9wZXJhdG9yQW5kVmFsdWUgPSB0aGlzLnNwZWNpZnlQcm9wZXJ0eVZhbHVlLmdldENvbXBhcmlzb25PcGVyYXRvckFuZFZhbHVlTGl0ZXJhbEZvclByb3BlcnR5KCk7XG5cbiAgICAgICAgbGV0IGlzU29ydENyaXRlcmlvbiA9IGZhbHNlO1xuXG4gICAgICAgIC8vIG9ubHkgbm9uIGxpbmtpbmcgcHJvcGVydGllcyBjYW4gYmUgdXNlZCBmb3Igc29ydGluZ1xuICAgICAgICBpZiAoIXRoaXMucHJvcGVydHlTZWxlY3RlZC5pc0xpbmtQcm9wZXJ0eSkge1xuICAgICAgICAgICAgaXNTb3J0Q3JpdGVyaW9uID0gdGhpcy5mb3JtLnZhbHVlLmlzU29ydENyaXRlcmlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvcGVydHlXaXRoVmFsdWUodGhpcy5wcm9wZXJ0eVNlbGVjdGVkLCBwcm9wVmFsLCBpc1NvcnRDcml0ZXJpb24pO1xuXG4gICAgfVxuXG5cbn1cbiJdfQ==