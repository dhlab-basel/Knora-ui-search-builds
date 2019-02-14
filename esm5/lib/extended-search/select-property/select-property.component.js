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
    /** @nocollapse */
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LXByb3BlcnR5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Brbm9yYS9zZWFyY2gvIiwic291cmNlcyI6WyJsaWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zZWxlY3QtcHJvcGVydHkuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBcUIsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3ZGLE9BQU8sRUFFSCxxQkFBcUIsRUFFckIsVUFBVSxFQUVWLGlCQUFpQixFQUNqQixhQUFhLEVBQ2hCLE1BQU0sYUFBYSxDQUFDO0FBQ3JCLE9BQU8sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3BFLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLDJEQUEyRCxDQUFDO0FBQzFHLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUdsRCx3SEFBd0g7QUFDeEgsSUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUU5QztJQTBESSxpQ0FBeUMsRUFBZTtRQUFmLE9BQUUsR0FBRixFQUFFLENBQWE7SUFFeEQsQ0FBQztJQXRDRCxzQkFDSSwrQ0FBVTthQU1kO1lBQ0csT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQzNCLENBQUM7UUFWRCxzRUFBc0U7YUFDdEUsVUFDZSxLQUFpQjtZQUM1QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDLENBQUMsK0RBQStEO1lBQ2xHLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQ2pDLENBQUM7OztPQUFBO0lBU0Qsc0JBQ0ksd0RBQW1CO1FBRnZCLDRDQUE0QzthQUM1QyxVQUN3QixLQUFvQjtZQUN4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SSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTlDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxVQUFVLENBQUM7SUFDeEMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsOERBQTRCLEdBQTVCO1FBRUksSUFBTSxPQUFPLEdBQStCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQywrQ0FBK0MsRUFBRSxDQUFDO1FBRXhILElBQUksZUFBZSxHQUFHLEtBQUssQ0FBQztRQUU1QixzREFBc0Q7UUFDdEQsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUU7WUFDdkMsZUFBZSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQztTQUNyRDtRQUVELE9BQU8sSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBRWxGLENBQUM7O2dCQW5LSixTQUFTLFNBQUM7b0JBQ1AsUUFBUSxFQUFFLHFCQUFxQjtvQkFDL0IsUUFBUSxFQUFFLGdxQkFRdUo7b0JBQ2pLLE1BQU0sRUFBRSxDQUFDLDBDQUEwQyxDQUFDO2lCQUN2RDs7OztnQkFwQlEsV0FBVyx1QkFrRUgsTUFBTSxTQUFDLFdBQVc7Ozs0QkExQzlCLEtBQUs7d0JBR0wsS0FBSzs2QkFHTCxLQUFLO3NDQWNMLEtBQUs7dUNBTUwsU0FBUyxTQUFDLHNCQUFzQjs7SUE0SHJDLDhCQUFDO0NBQUEsQUF0S0QsSUFzS0M7U0F6SlksdUJBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbmplY3QsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICAgIENhcmRpbmFsaXR5LFxuICAgIENhcmRpbmFsaXR5T2NjdXJyZW5jZSxcbiAgICBDb21wYXJpc29uT3BlcmF0b3JBbmRWYWx1ZSxcbiAgICBQcm9wZXJ0aWVzLFxuICAgIFByb3BlcnR5LFxuICAgIFByb3BlcnR5V2l0aFZhbHVlLFxuICAgIFJlc291cmNlQ2xhc3Ncbn0gZnJvbSAnQGtub3JhL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IFNwZWNpZnlQcm9wZXJ0eVZhbHVlQ29tcG9uZW50IH0gZnJvbSAnLi9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL3NwZWNpZnktcHJvcGVydHktdmFsdWUuY29tcG9uZW50JztcbmltcG9ydCB7IE9udG9sb2d5SW5mb3JtYXRpb24gfSBmcm9tICdAa25vcmEvY29yZSc7XG5cblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDU2NjEwMTAvZHluYW1pYy1uZXN0ZWQtcmVhY3RpdmUtZm9ybS1leHByZXNzaW9uY2hhbmdlZGFmdGVyaXRoYXNiZWVuY2hlY2tlZGVycm9yXG5jb25zdCByZXNvbHZlZFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAna3VpLXNlbGVjdC1wcm9wZXJ0eScsXG4gICAgdGVtcGxhdGU6IGA8bWF0LWZvcm0tZmllbGQgY2xhc3M9XCJzZWFyY2gtcHJvcGVydHktZmllbGRcIiAqbmdJZj1cInByb3BlcnRpZXNBc0FycmF5Py5sZW5ndGggPiAwXCI+XG4gIDxtYXQtc2VsZWN0IHBsYWNlaG9sZGVyPVwiUHJvcGVydGllc1wiIFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWydwcm9wZXJ0eSddXCI+XG4gICAgPG1hdC1vcHRpb24gKm5nRm9yPVwibGV0IHByb3Agb2YgcHJvcGVydGllc0FzQXJyYXlcIiBbdmFsdWVdPVwicHJvcC5pZFwiPnt7IHByb3AubGFiZWwgfX08L21hdC1vcHRpb24+XG4gIDwvbWF0LXNlbGVjdD5cbjwvbWF0LWZvcm0tZmllbGQ+XG5cbjxrdWktc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZSAjc3BlY2lmeVByb3BlcnR5VmFsdWUgW2Zvcm1Hcm91cF09XCJmb3JtXCIgKm5nSWY9XCJwcm9wZXJ0eVNlbGVjdGVkICE9PSB1bmRlZmluZWRcIiBbcHJvcGVydHldPVwicHJvcGVydHlTZWxlY3RlZFwiPjwva3VpLXNwZWNpZnktcHJvcGVydHktdmFsdWU+XG5cbjxtYXQtY2hlY2tib3ggbWF0VG9vbHRpcD1cIlNvcnQgY3JpdGVyaW9uXCIgKm5nSWY9XCJwcm9wZXJ0eVNlbGVjdGVkICE9PSB1bmRlZmluZWQgJiYgc29ydENyaXRlcmlvbigpXCIgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ2lzU29ydENyaXRlcmlvbiddXCI+PC9tYXQtY2hlY2tib3g+YCxcbiAgICBzdHlsZXM6IFtgLnNlYXJjaC1wcm9wZXJ0eS1maWVsZHttYXJnaW4tcmlnaHQ6OHB4fWBdXG59KVxuZXhwb3J0IGNsYXNzIFNlbGVjdFByb3BlcnR5Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgLy8gcGFyZW50IEZvcm1Hcm91cFxuICAgIEBJbnB1dCgpIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuXG4gICAgLy8gaW5kZXggb2YgdGhlIGdpdmVuIHByb3BlcnR5ICh1bmlxdWUpXG4gICAgQElucHV0KCkgaW5kZXg6IG51bWJlcjtcblxuICAgIC8vIHNldHRlciBtZXRob2QgZm9yIHByb3BlcnRpZXMgd2hlbiBiZWluZyB1cGRhdGVkIGJ5IHBhcmVudCBjb21wb25lbnRcbiAgICBASW5wdXQoKVxuICAgIHNldCBwcm9wZXJ0aWVzKHZhbHVlOiBQcm9wZXJ0aWVzKSB7XG4gICAgICAgIHRoaXMucHJvcGVydHlTZWxlY3RlZCA9IHVuZGVmaW5lZDsgLy8gcmVzZXQgc2VsZWN0ZWQgcHJvcGVydHkgKG92ZXJ3cml0aW5nIGFueSBwcmV2aW91cyBzZWxlY3Rpb24pXG4gICAgICAgIHRoaXMuX3Byb3BlcnRpZXMgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVQcm9wZXJ0aWVzQXJyYXkoKTtcbiAgICB9XG5cbiAgICBnZXQgcHJvcGVydGllcygpIHtcbiAgICAgICByZXR1cm4gdGhpcy5fcHJvcGVydGllcztcbiAgICB9XG5cbiAgICBfYWN0aXZlUmVzb3VyY2VDbGFzczogUmVzb3VyY2VDbGFzcztcblxuICAgIC8vIHNldHRlciBtZXRob2QgZm9yIHNlbGVjdGVkIHJlc291cmNlIGNsYXNzXG4gICAgQElucHV0KClcbiAgICBzZXQgYWN0aXZlUmVzb3VyY2VDbGFzcyh2YWx1ZTogUmVzb3VyY2VDbGFzcykge1xuICAgICAgICB0aGlzLl9hY3RpdmVSZXNvdXJjZUNsYXNzID0gdmFsdWU7XG4gICAgfVxuXG4gICAgLy8gcmVmZXJlbmNlIHRvIGNoaWxkIGNvbXBvbmVudDogY29tYmluYXRpb24gb2YgY29tcGFyaXNvbiBvcGVyYXRvciBhbmQgdmFsdWUgZm9yIGNob3NlbiBwcm9wZXJ0eVxuICAgIEBWaWV3Q2hpbGQoJ3NwZWNpZnlQcm9wZXJ0eVZhbHVlJykgc3BlY2lmeVByb3BlcnR5VmFsdWU6IFNwZWNpZnlQcm9wZXJ0eVZhbHVlQ29tcG9uZW50O1xuXG4gICAgLy8gcHJvcGVydGllcyB0aGF0IGNhbiBiZSBzZWxlY3RlZCBmcm9tXG4gICAgcHJpdmF0ZSBfcHJvcGVydGllczogUHJvcGVydGllcztcblxuICAgIC8vIHByb3BlcnRpZXMgYXMgYW4gQXJyYXkgc3RydWN0dXJlIChiYXNlZCBvbiB0aGlzLnByb3BlcnRpZXMpXG4gICAgcHJvcGVydGllc0FzQXJyYXk6IEFycmF5PFByb3BlcnR5PjtcblxuICAgIC8vIHJlcHJlc2VudHMgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBwcm9wZXJ0eVxuICAgIHByb3BlcnR5U2VsZWN0ZWQ6IFByb3BlcnR5O1xuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgLy8gdW5pcXVlIG5hbWUgZm9yIHRoaXMgcHJvcGVydHkgdG8gYmUgdXNlZCBpbiB0aGUgcGFyZW50IEZvcm1Hcm91cFxuICAgIHByb3BJbmRleDogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHtcblxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuXG4gICAgICAgIC8vIGJ1aWxkIGEgZm9ybSBmb3IgdGhlIHByb3BlcnR5IHNlbGVjdGlvblxuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgICAgICAgIHByb3BlcnR5OiBbbnVsbCwgVmFsaWRhdG9ycy5yZXF1aXJlZF0sXG4gICAgICAgICAgICBpc1NvcnRDcml0ZXJpb246IFtmYWxzZSwgVmFsaWRhdG9ycy5yZXF1aXJlZF1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gdXBkYXRlIHRoZSBzZWxlY3RlZCBwcm9wZXJ0eVxuICAgICAgICB0aGlzLmZvcm0udmFsdWVDaGFuZ2VzLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcHJvcElyaSA9IGRhdGEucHJvcGVydHk7XG4gICAgICAgICAgICB0aGlzLnByb3BlcnR5U2VsZWN0ZWQgPSB0aGlzLl9wcm9wZXJ0aWVzW3Byb3BJcmldO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnByb3BJbmRleCA9ICdwcm9wZXJ0eScgKyB0aGlzLmluZGV4O1xuXG4gICAgICAgICAgICAvLyBhZGQgZm9ybSB0byB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2wodGhpcy5wcm9wSW5kZXgsIHRoaXMuZm9ybSk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG5cbiAgICAgICAgLy8gcmVtb3ZlIGZvcm0gZnJvbSB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAucmVtb3ZlQ29udHJvbCh0aGlzLnByb3BJbmRleCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluZGljYXRlcyBpZiBwcm9wZXJ0eSBjYW4gYmUgdXNlZCBhcyBhIHNvcnQgY3JpdGVyaW9uLlxuICAgICAqIFByb3BlcnR5IGhhcyB0byBoYXZlIGNhcmRpbmFsaXR5IG9yIG1heCBjYXJkaW5hbGl0eSAxIGZvciB0aGUgY2hvc2VuIHJlc291cmNlIGNsYXNzLlxuICAgICAqXG4gICAgICogV2UgY2Fubm90IHNvcnQgYnkgcHJvcGVydGllcyB3aG9zZSBjYXJkaW5hbGl0eSBpcyBncmVhdGVyIHRoYW4gMS5cbiAgICAgKiBSZXR1cm4gYm9vbGVhblxuICAgICAqL1xuICAgIHNvcnRDcml0ZXJpb24oKSB7XG5cbiAgICAgICAgLy8gY2hlY2sgaWYgYSByZXNvdXJjZSBjbGFzcyBpcyBzZWxlY3RlZCBhbmQgaWYgdGhlIHByb3BlcnR5J3MgY2FyZGluYWxpdHkgaXMgMSBmb3IgdGhlIHNlbGVjdGVkIHJlc291cmNlIGNsYXNzXG4gICAgICAgIGlmICh0aGlzLl9hY3RpdmVSZXNvdXJjZUNsYXNzICE9PSB1bmRlZmluZWQgJiYgdGhpcy5wcm9wZXJ0eVNlbGVjdGVkICE9PSB1bmRlZmluZWQgJiYgIXRoaXMucHJvcGVydHlTZWxlY3RlZC5pc0xpbmtQcm9wZXJ0eSkge1xuXG4gICAgICAgICAgICBjb25zdCBjYXJkaW5hbGl0aWVzOiBDYXJkaW5hbGl0eVtdID0gdGhpcy5fYWN0aXZlUmVzb3VyY2VDbGFzcy5jYXJkaW5hbGl0aWVzLmZpbHRlcihcbiAgICAgICAgICAgICAgICAoY2FyZDogQ2FyZGluYWxpdHkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FyZGluYWxpdHkgMSBvciBtYXggb2NjdXJyZW5jZSAxXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYXJkLnByb3BlcnR5ID09PSB0aGlzLnByb3BlcnR5U2VsZWN0ZWQuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIGNhcmQudmFsdWUgPT09IDFcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIChjYXJkLm9jY3VycmVuY2UgPT09IENhcmRpbmFsaXR5T2NjdXJyZW5jZS5jYXJkIHx8IGNhcmQub2NjdXJyZW5jZSA9PT0gQ2FyZGluYWxpdHlPY2N1cnJlbmNlLm1heENhcmQpXG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICByZXR1cm4gY2FyZGluYWxpdGllcy5sZW5ndGggPT09IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgdGhlIHByb3BlcnRpZXMgYXJyYXkgdGhhdCBpcyBhY2Nlc3NlZCBieSB0aGUgdGVtcGxhdGUuXG4gICAgICovXG4gICAgcHJpdmF0ZSB1cGRhdGVQcm9wZXJ0aWVzQXJyYXkoKSB7XG5cbiAgICAgICAgLy8gcmVwcmVzZW50IHRoZSBwcm9wZXJ0aWVzIGFzIGFuIGFycmF5IHRvIGJlIGFjY2Vzc2VkIGJ5IHRoZSB0ZW1wbGF0ZVxuICAgICAgICBjb25zdCBwcm9wc0FycmF5ID0gW107XG5cbiAgICAgICAgZm9yIChjb25zdCBwcm9wSXJpIGluIHRoaXMuX3Byb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9wcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KHByb3BJcmkpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJvcCA9IHRoaXMuX3Byb3BlcnRpZXNbcHJvcElyaV07XG5cbiAgICAgICAgICAgICAgICAvLyBvbmx5IGxpc3QgZWRpdGFibGUgcHJvcHMgdGhhdCBhcmUgbm90IGxpbmsgdmFsdWUgcHJvcHNcbiAgICAgICAgICAgICAgICBpZiAocHJvcC5pc0VkaXRhYmxlICYmICFwcm9wLmlzTGlua1ZhbHVlUHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcHNBcnJheS5wdXNoKHRoaXMuX3Byb3BlcnRpZXNbcHJvcElyaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNvcnQgcHJvcGVydGllcyBieSBsYWJlbCAoYXNjZW5kaW5nKVxuICAgICAgICBwcm9wc0FycmF5LnNvcnQoT250b2xvZ3lJbmZvcm1hdGlvbi5zb3J0RnVuYyk7XG5cbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzQXNBcnJheSA9IHByb3BzQXJyYXk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgc2VsZWN0ZWQgcHJvcGVydHkgd2l0aCB0aGUgc3BlY2lmaWVkIHZhbHVlLlxuICAgICAqL1xuICAgIGdldFByb3BlcnR5U2VsZWN0ZWRXaXRoVmFsdWUoKTogUHJvcGVydHlXaXRoVmFsdWUge1xuXG4gICAgICAgIGNvbnN0IHByb3BWYWw6IENvbXBhcmlzb25PcGVyYXRvckFuZFZhbHVlID0gdGhpcy5zcGVjaWZ5UHJvcGVydHlWYWx1ZS5nZXRDb21wYXJpc29uT3BlcmF0b3JBbmRWYWx1ZUxpdGVyYWxGb3JQcm9wZXJ0eSgpO1xuXG4gICAgICAgIGxldCBpc1NvcnRDcml0ZXJpb24gPSBmYWxzZTtcblxuICAgICAgICAvLyBvbmx5IG5vbiBsaW5raW5nIHByb3BlcnRpZXMgY2FuIGJlIHVzZWQgZm9yIHNvcnRpbmdcbiAgICAgICAgaWYgKCF0aGlzLnByb3BlcnR5U2VsZWN0ZWQuaXNMaW5rUHJvcGVydHkpIHtcbiAgICAgICAgICAgIGlzU29ydENyaXRlcmlvbiA9IHRoaXMuZm9ybS52YWx1ZS5pc1NvcnRDcml0ZXJpb247XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb3BlcnR5V2l0aFZhbHVlKHRoaXMucHJvcGVydHlTZWxlY3RlZCwgcHJvcFZhbCwgaXNTb3J0Q3JpdGVyaW9uKTtcblxuICAgIH1cblxuXG59XG4iXX0=