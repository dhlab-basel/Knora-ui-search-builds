import { Component, Inject, Input, ViewChild } from '@angular/core';
import { CardinalityOccurrence, Properties, PropertyWithValue, ResourceClass } from '@knora/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpecifyPropertyValueComponent } from './specify-property-value/specify-property-value.component';
import { OntologyInformation } from '@knora/core';
// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
var resolvedPromise = Promise.resolve(null);
var SelectPropertyComponent = /** @class */ (function () {
    function SelectPropertyComponent(fb) {
        this.fb = fb;
    }
    Object.defineProperty(SelectPropertyComponent.prototype, "properties", {
        get: function () {
            return this._properties;
        },
        // setter method for properties when being updated by parent component
        set: function (value) {
            this.propertySelected = undefined; // reset selected property (overwriting any previous selection)
            this._properties = value;
            this.updatePropertiesArray();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectPropertyComponent.prototype, "activeResourceClass", {
        // setter method for selected resource class
        set: function (value) {
            this._activeResourceClass = value;
        },
        enumerable: true,
        configurable: true
    });
    SelectPropertyComponent.prototype.ngOnInit = function () {
        var _this = this;
        // build a form for the property selection
        this.form = this.fb.group({
            property: [null, Validators.required],
            isSortCriterion: [false, Validators.required]
        });
        // update the selected property
        this.form.valueChanges.subscribe(function (data) {
            var propIri = data.property;
            _this.propertySelected = _this._properties[propIri];
        });
        resolvedPromise.then(function () {
            _this.propIndex = 'property' + _this.index;
            // add form to the parent form group
            _this.formGroup.addControl(_this.propIndex, _this.form);
        });
    };
    SelectPropertyComponent.prototype.ngOnDestroy = function () {
        var _this = this;
        // remove form from the parent form group
        resolvedPromise.then(function () {
            _this.formGroup.removeControl(_this.propIndex);
        });
    };
    /**
     * Indicates if property can be used as a sort criterion.
     * Property has to have cardinality or max cardinality 1 for the chosen resource class.
     *
     * We cannot sort by properties whose cardinality is greater than 1.
     * Return boolean
     */
    SelectPropertyComponent.prototype.sortCriterion = function () {
        var _this = this;
        // check if a resource class is selected and if the property's cardinality is 1 for the selected resource class
        if (this._activeResourceClass !== undefined && this.propertySelected !== undefined && !this.propertySelected.isLinkProperty) {
            var cardinalities = this._activeResourceClass.cardinalities.filter(function (card) {
                // cardinality 1 or max occurrence 1
                return card.property === _this.propertySelected.id
                    && card.value === 1
                    && (card.occurrence === CardinalityOccurrence.card || card.occurrence === CardinalityOccurrence.maxCard);
            });
            return cardinalities.length === 1;
        }
        else {
            return false;
        }
    };
    /**
     * Updates the properties array that is accessed by the template.
     */
    SelectPropertyComponent.prototype.updatePropertiesArray = function () {
        // represent the properties as an array to be accessed by the template
        var propsArray = [];
        for (var propIri in this._properties) {
            if (this._properties.hasOwnProperty(propIri)) {
                var prop = this._properties[propIri];
                // only list editable props that are not link value props
                if (prop.isEditable && !prop.isLinkValueProperty) {
                    propsArray.push(this._properties[propIri]);
                }
            }
        }
        // sort properties by label (ascending)
        propsArray.sort(OntologyInformation.sortFunc);
        this.propertiesAsArray = propsArray;
    };
    /**
     * Returns the selected property with the specified value.
     */
    SelectPropertyComponent.prototype.getPropertySelectedWithValue = function () {
        var propVal = this.specifyPropertyValue.getComparisonOperatorAndValueLiteralForProperty();
        var isSortCriterion = false;
        // only non linking properties can be used for sorting
        if (!this.propertySelected.isLinkProperty) {
            isSortCriterion = this.form.value.isSortCriterion;
        }
        return new PropertyWithValue(this.propertySelected, propVal, isSortCriterion);
    };
    SelectPropertyComponent.decorators = [
        { type: Component, args: [{
                    selector: 'kui-select-property',
                    template: "<mat-form-field class=\"search-property-field\" *ngIf=\"propertiesAsArray?.length > 0\">\n  <mat-select placeholder=\"Properties\" [formControl]=\"form.controls['property']\">\n    <mat-option *ngFor=\"let prop of propertiesAsArray\" [value]=\"prop.id\">{{ prop.label }}</mat-option>\n  </mat-select>\n</mat-form-field>\n\n<kui-specify-property-value #specifyPropertyValue [formGroup]=\"form\" *ngIf=\"propertySelected !== undefined\" [property]=\"propertySelected\"></kui-specify-property-value>\n\n<mat-checkbox matTooltip=\"Sort criterion\" *ngIf=\"propertySelected !== undefined && sortCriterion()\" [formControl]=\"form.controls['isSortCriterion']\"></mat-checkbox>",
                    styles: [".search-property-field{margin-right:8px}"]
                },] },
    ];
    SelectPropertyComponent.ctorParameters = function () { return [
        { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
    ]; };
    SelectPropertyComponent.propDecorators = {
        formGroup: [{ type: Input }],
        index: [{ type: Input }],
        properties: [{ type: Input }],
        activeResourceClass: [{ type: Input }],
        specifyPropertyValue: [{ type: ViewChild, args: ['specifyPropertyValue',] }]
    };
    return SelectPropertyComponent;
}());
export { SelectPropertyComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LXByb3BlcnR5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Brbm9yYS9zZWFyY2gvIiwic291cmNlcyI6WyJsaWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zZWxlY3QtcHJvcGVydHkuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBcUIsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3ZGLE9BQU8sRUFFSCxxQkFBcUIsRUFFckIsVUFBVSxFQUVWLGlCQUFpQixFQUNqQixhQUFhLEVBQ2hCLE1BQU0sYUFBYSxDQUFDO0FBQ3JCLE9BQU8sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3BFLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLDJEQUEyRCxDQUFDO0FBQzFHLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUdsRCx3SEFBd0g7QUFDeEgsSUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUU5QztJQTBESSxpQ0FBeUMsRUFBZTtRQUFmLE9BQUUsR0FBRixFQUFFLENBQWE7SUFFeEQsQ0FBQztJQXRDRCxzQkFDSSwrQ0FBVTthQU1kO1lBQ0csT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQzNCLENBQUM7UUFWRCxzRUFBc0U7YUFDdEUsVUFDZSxLQUFpQjtZQUM1QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDLENBQUMsK0RBQStEO1lBQ2xHLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQ2pDLENBQUM7OztPQUFBO0lBU0Qsc0JBQ0ksd0RBQW1CO1FBRnZCLDRDQUE0QzthQUM1QyxVQUN3QixLQUFvQjtZQUN4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SSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTlDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxVQUFVLENBQUM7SUFDeEMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsOERBQTRCLEdBQTVCO1FBRUksSUFBTSxPQUFPLEdBQStCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQywrQ0FBK0MsRUFBRSxDQUFDO1FBRXhILElBQUksZUFBZSxHQUFHLEtBQUssQ0FBQztRQUU1QixzREFBc0Q7UUFDdEQsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUU7WUFDdkMsZUFBZSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQztTQUNyRDtRQUVELE9BQU8sSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBRWxGLENBQUM7O2dCQW5LSixTQUFTLFNBQUM7b0JBQ1AsUUFBUSxFQUFFLHFCQUFxQjtvQkFDL0IsUUFBUSxFQUFFLGdxQkFRdUo7b0JBQ2pLLE1BQU0sRUFBRSxDQUFDLDBDQUEwQyxDQUFDO2lCQUN2RDs7O2dCQXBCUSxXQUFXLHVCQWtFSCxNQUFNLFNBQUMsV0FBVzs7OzRCQTFDOUIsS0FBSzt3QkFHTCxLQUFLOzZCQUdMLEtBQUs7c0NBY0wsS0FBSzt1Q0FNTCxTQUFTLFNBQUMsc0JBQXNCOztJQTRIckMsOEJBQUM7Q0FBQSxBQXRLRCxJQXNLQztTQXpKWSx1QkFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEluamVjdCwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gICAgQ2FyZGluYWxpdHksXG4gICAgQ2FyZGluYWxpdHlPY2N1cnJlbmNlLFxuICAgIENvbXBhcmlzb25PcGVyYXRvckFuZFZhbHVlLFxuICAgIFByb3BlcnRpZXMsXG4gICAgUHJvcGVydHksXG4gICAgUHJvcGVydHlXaXRoVmFsdWUsXG4gICAgUmVzb3VyY2VDbGFzc1xufSBmcm9tICdAa25vcmEvY29yZSc7XG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgU3BlY2lmeVByb3BlcnR5VmFsdWVDb21wb25lbnQgfSBmcm9tICcuL3NwZWNpZnktcHJvcGVydHktdmFsdWUvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT250b2xvZ3lJbmZvcm1hdGlvbiB9IGZyb20gJ0Brbm9yYS9jb3JlJztcblxuXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NTY2MTAxMC9keW5hbWljLW5lc3RlZC1yZWFjdGl2ZS1mb3JtLWV4cHJlc3Npb25jaGFuZ2VkYWZ0ZXJpdGhhc2JlZW5jaGVja2VkZXJyb3JcbmNvbnN0IHJlc29sdmVkUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShudWxsKTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdrdWktc2VsZWN0LXByb3BlcnR5JyxcbiAgICB0ZW1wbGF0ZTogYDxtYXQtZm9ybS1maWVsZCBjbGFzcz1cInNlYXJjaC1wcm9wZXJ0eS1maWVsZFwiICpuZ0lmPVwicHJvcGVydGllc0FzQXJyYXk/Lmxlbmd0aCA+IDBcIj5cbiAgPG1hdC1zZWxlY3QgcGxhY2Vob2xkZXI9XCJQcm9wZXJ0aWVzXCIgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ3Byb3BlcnR5J11cIj5cbiAgICA8bWF0LW9wdGlvbiAqbmdGb3I9XCJsZXQgcHJvcCBvZiBwcm9wZXJ0aWVzQXNBcnJheVwiIFt2YWx1ZV09XCJwcm9wLmlkXCI+e3sgcHJvcC5sYWJlbCB9fTwvbWF0LW9wdGlvbj5cbiAgPC9tYXQtc2VsZWN0PlxuPC9tYXQtZm9ybS1maWVsZD5cblxuPGt1aS1zcGVjaWZ5LXByb3BlcnR5LXZhbHVlICNzcGVjaWZ5UHJvcGVydHlWYWx1ZSBbZm9ybUdyb3VwXT1cImZvcm1cIiAqbmdJZj1cInByb3BlcnR5U2VsZWN0ZWQgIT09IHVuZGVmaW5lZFwiIFtwcm9wZXJ0eV09XCJwcm9wZXJ0eVNlbGVjdGVkXCI+PC9rdWktc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZT5cblxuPG1hdC1jaGVja2JveCBtYXRUb29sdGlwPVwiU29ydCBjcml0ZXJpb25cIiAqbmdJZj1cInByb3BlcnR5U2VsZWN0ZWQgIT09IHVuZGVmaW5lZCAmJiBzb3J0Q3JpdGVyaW9uKClcIiBbZm9ybUNvbnRyb2xdPVwiZm9ybS5jb250cm9sc1snaXNTb3J0Q3JpdGVyaW9uJ11cIj48L21hdC1jaGVja2JveD5gLFxuICAgIHN0eWxlczogW2Auc2VhcmNoLXByb3BlcnR5LWZpZWxke21hcmdpbi1yaWdodDo4cHh9YF1cbn0pXG5leHBvcnQgY2xhc3MgU2VsZWN0UHJvcGVydHlDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG5cbiAgICAvLyBwYXJlbnQgRm9ybUdyb3VwXG4gICAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgICAvLyBpbmRleCBvZiB0aGUgZ2l2ZW4gcHJvcGVydHkgKHVuaXF1ZSlcbiAgICBASW5wdXQoKSBpbmRleDogbnVtYmVyO1xuXG4gICAgLy8gc2V0dGVyIG1ldGhvZCBmb3IgcHJvcGVydGllcyB3aGVuIGJlaW5nIHVwZGF0ZWQgYnkgcGFyZW50IGNvbXBvbmVudFxuICAgIEBJbnB1dCgpXG4gICAgc2V0IHByb3BlcnRpZXModmFsdWU6IFByb3BlcnRpZXMpIHtcbiAgICAgICAgdGhpcy5wcm9wZXJ0eVNlbGVjdGVkID0gdW5kZWZpbmVkOyAvLyByZXNldCBzZWxlY3RlZCBwcm9wZXJ0eSAob3ZlcndyaXRpbmcgYW55IHByZXZpb3VzIHNlbGVjdGlvbilcbiAgICAgICAgdGhpcy5fcHJvcGVydGllcyA9IHZhbHVlO1xuICAgICAgICB0aGlzLnVwZGF0ZVByb3BlcnRpZXNBcnJheSgpO1xuICAgIH1cblxuICAgIGdldCBwcm9wZXJ0aWVzKCkge1xuICAgICAgIHJldHVybiB0aGlzLl9wcm9wZXJ0aWVzO1xuICAgIH1cblxuICAgIF9hY3RpdmVSZXNvdXJjZUNsYXNzOiBSZXNvdXJjZUNsYXNzO1xuXG4gICAgLy8gc2V0dGVyIG1ldGhvZCBmb3Igc2VsZWN0ZWQgcmVzb3VyY2UgY2xhc3NcbiAgICBASW5wdXQoKVxuICAgIHNldCBhY3RpdmVSZXNvdXJjZUNsYXNzKHZhbHVlOiBSZXNvdXJjZUNsYXNzKSB7XG4gICAgICAgIHRoaXMuX2FjdGl2ZVJlc291cmNlQ2xhc3MgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICAvLyByZWZlcmVuY2UgdG8gY2hpbGQgY29tcG9uZW50OiBjb21iaW5hdGlvbiBvZiBjb21wYXJpc29uIG9wZXJhdG9yIGFuZCB2YWx1ZSBmb3IgY2hvc2VuIHByb3BlcnR5XG4gICAgQFZpZXdDaGlsZCgnc3BlY2lmeVByb3BlcnR5VmFsdWUnKSBzcGVjaWZ5UHJvcGVydHlWYWx1ZTogU3BlY2lmeVByb3BlcnR5VmFsdWVDb21wb25lbnQ7XG5cbiAgICAvLyBwcm9wZXJ0aWVzIHRoYXQgY2FuIGJlIHNlbGVjdGVkIGZyb21cbiAgICBwcml2YXRlIF9wcm9wZXJ0aWVzOiBQcm9wZXJ0aWVzO1xuXG4gICAgLy8gcHJvcGVydGllcyBhcyBhbiBBcnJheSBzdHJ1Y3R1cmUgKGJhc2VkIG9uIHRoaXMucHJvcGVydGllcylcbiAgICBwcm9wZXJ0aWVzQXNBcnJheTogQXJyYXk8UHJvcGVydHk+O1xuXG4gICAgLy8gcmVwcmVzZW50cyB0aGUgY3VycmVudGx5IHNlbGVjdGVkIHByb3BlcnR5XG4gICAgcHJvcGVydHlTZWxlY3RlZDogUHJvcGVydHk7XG5cbiAgICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgICAvLyB1bmlxdWUgbmFtZSBmb3IgdGhpcyBwcm9wZXJ0eSB0byBiZSB1c2VkIGluIHRoZSBwYXJlbnQgRm9ybUdyb3VwXG4gICAgcHJvcEluZGV4OiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlcikge1xuXG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG5cbiAgICAgICAgLy8gYnVpbGQgYSBmb3JtIGZvciB0aGUgcHJvcGVydHkgc2VsZWN0aW9uXG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgICAgICAgcHJvcGVydHk6IFtudWxsLCBWYWxpZGF0b3JzLnJlcXVpcmVkXSxcbiAgICAgICAgICAgIGlzU29ydENyaXRlcmlvbjogW2ZhbHNlLCBWYWxpZGF0b3JzLnJlcXVpcmVkXVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyB1cGRhdGUgdGhlIHNlbGVjdGVkIHByb3BlcnR5XG4gICAgICAgIHRoaXMuZm9ybS52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwcm9wSXJpID0gZGF0YS5wcm9wZXJ0eTtcbiAgICAgICAgICAgIHRoaXMucHJvcGVydHlTZWxlY3RlZCA9IHRoaXMuX3Byb3BlcnRpZXNbcHJvcElyaV07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucHJvcEluZGV4ID0gJ3Byb3BlcnR5JyArIHRoaXMuaW5kZXg7XG5cbiAgICAgICAgICAgIC8vIGFkZCBmb3JtIHRvIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAuYWRkQ29udHJvbCh0aGlzLnByb3BJbmRleCwgdGhpcy5mb3JtKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcblxuICAgICAgICAvLyByZW1vdmUgZm9ybSBmcm9tIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5yZW1vdmVDb250cm9sKHRoaXMucHJvcEluZGV4KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5kaWNhdGVzIGlmIHByb3BlcnR5IGNhbiBiZSB1c2VkIGFzIGEgc29ydCBjcml0ZXJpb24uXG4gICAgICogUHJvcGVydHkgaGFzIHRvIGhhdmUgY2FyZGluYWxpdHkgb3IgbWF4IGNhcmRpbmFsaXR5IDEgZm9yIHRoZSBjaG9zZW4gcmVzb3VyY2UgY2xhc3MuXG4gICAgICpcbiAgICAgKiBXZSBjYW5ub3Qgc29ydCBieSBwcm9wZXJ0aWVzIHdob3NlIGNhcmRpbmFsaXR5IGlzIGdyZWF0ZXIgdGhhbiAxLlxuICAgICAqIFJldHVybiBib29sZWFuXG4gICAgICovXG4gICAgc29ydENyaXRlcmlvbigpIHtcblxuICAgICAgICAvLyBjaGVjayBpZiBhIHJlc291cmNlIGNsYXNzIGlzIHNlbGVjdGVkIGFuZCBpZiB0aGUgcHJvcGVydHkncyBjYXJkaW5hbGl0eSBpcyAxIGZvciB0aGUgc2VsZWN0ZWQgcmVzb3VyY2UgY2xhc3NcbiAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZVJlc291cmNlQ2xhc3MgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnByb3BlcnR5U2VsZWN0ZWQgIT09IHVuZGVmaW5lZCAmJiAhdGhpcy5wcm9wZXJ0eVNlbGVjdGVkLmlzTGlua1Byb3BlcnR5KSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGNhcmRpbmFsaXRpZXM6IENhcmRpbmFsaXR5W10gPSB0aGlzLl9hY3RpdmVSZXNvdXJjZUNsYXNzLmNhcmRpbmFsaXRpZXMuZmlsdGVyKFxuICAgICAgICAgICAgICAgIChjYXJkOiBDYXJkaW5hbGl0eSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBjYXJkaW5hbGl0eSAxIG9yIG1heCBvY2N1cnJlbmNlIDFcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhcmQucHJvcGVydHkgPT09IHRoaXMucHJvcGVydHlTZWxlY3RlZC5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgY2FyZC52YWx1ZSA9PT0gMVxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgKGNhcmQub2NjdXJyZW5jZSA9PT0gQ2FyZGluYWxpdHlPY2N1cnJlbmNlLmNhcmQgfHwgY2FyZC5vY2N1cnJlbmNlID09PSBDYXJkaW5hbGl0eU9jY3VycmVuY2UubWF4Q2FyZClcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHJldHVybiBjYXJkaW5hbGl0aWVzLmxlbmd0aCA9PT0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgcHJvcGVydGllcyBhcnJheSB0aGF0IGlzIGFjY2Vzc2VkIGJ5IHRoZSB0ZW1wbGF0ZS5cbiAgICAgKi9cbiAgICBwcml2YXRlIHVwZGF0ZVByb3BlcnRpZXNBcnJheSgpIHtcblxuICAgICAgICAvLyByZXByZXNlbnQgdGhlIHByb3BlcnRpZXMgYXMgYW4gYXJyYXkgdG8gYmUgYWNjZXNzZWQgYnkgdGhlIHRlbXBsYXRlXG4gICAgICAgIGNvbnN0IHByb3BzQXJyYXkgPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IHByb3BJcmkgaW4gdGhpcy5fcHJvcGVydGllcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3Byb3BlcnRpZXMuaGFzT3duUHJvcGVydHkocHJvcElyaSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9wID0gdGhpcy5fcHJvcGVydGllc1twcm9wSXJpXTtcblxuICAgICAgICAgICAgICAgIC8vIG9ubHkgbGlzdCBlZGl0YWJsZSBwcm9wcyB0aGF0IGFyZSBub3QgbGluayB2YWx1ZSBwcm9wc1xuICAgICAgICAgICAgICAgIGlmIChwcm9wLmlzRWRpdGFibGUgJiYgIXByb3AuaXNMaW5rVmFsdWVQcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wc0FycmF5LnB1c2godGhpcy5fcHJvcGVydGllc1twcm9wSXJpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gc29ydCBwcm9wZXJ0aWVzIGJ5IGxhYmVsIChhc2NlbmRpbmcpXG4gICAgICAgIHByb3BzQXJyYXkuc29ydChPbnRvbG9neUluZm9ybWF0aW9uLnNvcnRGdW5jKTtcblxuICAgICAgICB0aGlzLnByb3BlcnRpZXNBc0FycmF5ID0gcHJvcHNBcnJheTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBzZWxlY3RlZCBwcm9wZXJ0eSB3aXRoIHRoZSBzcGVjaWZpZWQgdmFsdWUuXG4gICAgICovXG4gICAgZ2V0UHJvcGVydHlTZWxlY3RlZFdpdGhWYWx1ZSgpOiBQcm9wZXJ0eVdpdGhWYWx1ZSB7XG5cbiAgICAgICAgY29uc3QgcHJvcFZhbDogQ29tcGFyaXNvbk9wZXJhdG9yQW5kVmFsdWUgPSB0aGlzLnNwZWNpZnlQcm9wZXJ0eVZhbHVlLmdldENvbXBhcmlzb25PcGVyYXRvckFuZFZhbHVlTGl0ZXJhbEZvclByb3BlcnR5KCk7XG5cbiAgICAgICAgbGV0IGlzU29ydENyaXRlcmlvbiA9IGZhbHNlO1xuXG4gICAgICAgIC8vIG9ubHkgbm9uIGxpbmtpbmcgcHJvcGVydGllcyBjYW4gYmUgdXNlZCBmb3Igc29ydGluZ1xuICAgICAgICBpZiAoIXRoaXMucHJvcGVydHlTZWxlY3RlZC5pc0xpbmtQcm9wZXJ0eSkge1xuICAgICAgICAgICAgaXNTb3J0Q3JpdGVyaW9uID0gdGhpcy5mb3JtLnZhbHVlLmlzU29ydENyaXRlcmlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvcGVydHlXaXRoVmFsdWUodGhpcy5wcm9wZXJ0eVNlbGVjdGVkLCBwcm9wVmFsLCBpc1NvcnRDcml0ZXJpb24pO1xuXG4gICAgfVxuXG5cbn1cbiJdfQ==