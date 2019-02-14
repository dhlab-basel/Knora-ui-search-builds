import { Component, Inject, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComparisonOperatorAndValue, Equals, Exists, GreaterThan, GreaterThanEquals, KnoraConstants, LessThan, LessThanEquals, Like, Match, NotEquals, Property } from '@knora/core';
// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
var resolvedPromise = Promise.resolve(null);
var SpecifyPropertyValueComponent = /** @class */ (function () {
    function SpecifyPropertyValueComponent(fb) {
        this.fb = fb;
        this.KnoraConstants = KnoraConstants;
        // available comparison operators for the property
        this.comparisonOperators = [];
    }
    Object.defineProperty(SpecifyPropertyValueComponent.prototype, "property", {
        // getter method for this._property
        get: function () {
            return this._property;
        },
        // setter method for the property chosen by the user
        set: function (prop) {
            this.comparisonOperatorSelected = undefined; // reset to initial state
            this._property = prop;
            this.resetComparisonOperators(); // reset comparison operators for given property (overwriting any previous selection)
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Resets the comparison operators for this._property.
     */
    SpecifyPropertyValueComponent.prototype.resetComparisonOperators = function () {
        // depending on object class, set comparison operators and value entry field
        if (this._property.isLinkProperty) {
            this.propertyValueType = KnoraConstants.Resource;
        }
        else {
            this.propertyValueType = this._property.objectType;
        }
        switch (this.propertyValueType) {
            case KnoraConstants.TextValue:
                this.comparisonOperators = [new Like(), new Match(), new Equals(), new NotEquals(), new Exists()];
                break;
            case KnoraConstants.BooleanValue:
            case KnoraConstants.Resource:
            case KnoraConstants.UriValue:
            case KnoraConstants.IntervalValue:
                this.comparisonOperators = [new Equals(), new NotEquals(), new Exists()];
                break;
            case KnoraConstants.IntValue:
            case KnoraConstants.DecimalValue:
            case KnoraConstants.DateValue:
                this.comparisonOperators = [new Equals(), new NotEquals(), new LessThan(), new LessThanEquals(), new GreaterThan(), new GreaterThanEquals(), new Exists()];
                break;
            case KnoraConstants.ListValue:
            case KnoraConstants.GeomValue:
            case KnoraConstants.FileValue:
            case KnoraConstants.AudioFileValue:
            case KnoraConstants.StillImageFileValue:
            case KnoraConstants.DDDFileValue:
            case KnoraConstants.MovingImageFileValue:
            case KnoraConstants.TextFileValue:
            case KnoraConstants.ColorValue:
                this.comparisonOperators = [new Exists()];
                break;
            default:
                console.log('ERROR: Unsupported value type ' + this._property.objectType);
        }
    };
    SpecifyPropertyValueComponent.prototype.ngOnInit = function () { };
    SpecifyPropertyValueComponent.prototype.ngOnChanges = function () {
        var _this = this;
        // build a form for comparison operator selection
        this.form = this.fb.group({
            comparisonOperator: [null, Validators.required]
        });
        // store comparison operator when selected
        this.form.valueChanges.subscribe(function (data) {
            _this.comparisonOperatorSelected = data.comparisonOperator;
        });
        resolvedPromise.then(function () {
            // remove from the parent form group (clean reset)
            _this.formGroup.removeControl('comparisonOperator');
            // add form to the parent form group
            _this.formGroup.addControl('comparisonOperator', _this.form);
        });
    };
    /**
     * Gets the specified comparison operator and value for the property.
     *
     * returns {ComparisonOperatorAndValue} the comparison operator and the specified value
     */
    SpecifyPropertyValueComponent.prototype.getComparisonOperatorAndValueLiteralForProperty = function () {
        // return value (literal or IRI) from the child component
        var value;
        // comparison operator 'Exists' does not require a value
        if (this.comparisonOperatorSelected.getClassName() !== 'Exists') {
            value = this.propertyValueComponent.getValue();
        }
        // return the comparison operator and the specified value
        return new ComparisonOperatorAndValue(this.comparisonOperatorSelected, value);
    };
    SpecifyPropertyValueComponent.decorators = [
        { type: Component, args: [{
                    selector: 'kui-specify-property-value',
                    template: "<mat-form-field class=\"search-operator-field\" *ngIf=\"comparisonOperators?.length > 0\">\n    <mat-select placeholder=\"Comparison Operator\" [formControl]=\"form.controls['comparisonOperator']\">\n        <mat-option *ngFor=\"let compOp of comparisonOperators\" [value]=\"compOp\">{{ compOp.label }}</mat-option>\n    </mat-select>\n</mat-form-field>\n\n<!-- select apt component for value specification using a switch case statement-->\n<span\n    *ngIf=\"comparisonOperatorSelected !== undefined && comparisonOperatorSelected !== null && comparisonOperatorSelected.getClassName() != 'Exists'\"\n    [ngSwitch]=\"propertyValueType\">\n  <boolean-value #propertyValue [formGroup]=\"form\" *ngSwitchCase=\"KnoraConstants.BooleanValue\"></boolean-value>\n  <date-value #propertyValue [formGroup]=\"form\" *ngSwitchCase=\"KnoraConstants.DateValue\"></date-value>\n  <decimal-value #propertyValue [formGroup]=\"form\" *ngSwitchCase=\"KnoraConstants.DecimalValue\"></decimal-value>\n  <integer-value #propertyValue [formGroup]=\"form\" *ngSwitchCase=\"KnoraConstants.IntValue\"></integer-value>\n  <link-value #propertyValue [formGroup]=\"form\" [restrictResourceClass]=\"property.objectType\"\n              *ngSwitchCase=\"KnoraConstants.Resource\"></link-value>\n  <text-value #propertyValue [formGroup]=\"form\" *ngSwitchCase=\"KnoraConstants.TextValue\"></text-value>\n  <uri-value #propertyValue [formGroup]=\"form\" *ngSwitchCase=\"KnoraConstants.UriValue\"></uri-value>\n\n    <!-- TODO: Resource: handle linking properties with target class restriction: access property member to get objectClass via property() getter method -->\n  <span *ngSwitchDefault=\"\">Not supported {{propertyValueType}}</span>\n</span>\n",
                    styles: [".search-operator-field{margin-right:8px}"]
                },] },
    ];
    /** @nocollapse */
    SpecifyPropertyValueComponent.ctorParameters = function () { return [
        { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
    ]; };
    SpecifyPropertyValueComponent.propDecorators = {
        formGroup: [{ type: Input }],
        propertyValueComponent: [{ type: ViewChild, args: ['propertyValue',] }],
        property: [{ type: Input }]
    };
    return SpecifyPropertyValueComponent;
}());
export { SpecifyPropertyValueComponent };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Aa25vcmEvc2VhcmNoLyIsInNvdXJjZXMiOlsibGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQXFCLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN2RixPQUFPLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNwRSxPQUFPLEVBRUgsMEJBQTBCLEVBQzFCLE1BQU0sRUFDTixNQUFNLEVBQ04sV0FBVyxFQUNYLGlCQUFpQixFQUNqQixjQUFjLEVBQ2QsUUFBUSxFQUNSLGNBQWMsRUFDZCxJQUFJLEVBQ0osS0FBSyxFQUNMLFNBQVMsRUFDVCxRQUFRLEVBR1gsTUFBTSxhQUFhLENBQUM7QUFHckIsd0hBQXdIO0FBQ3hILElBQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFOUM7SUE4REksdUNBQXlDLEVBQWU7UUFBZixPQUFFLEdBQUYsRUFBRSxDQUFhO1FBakN4RCxtQkFBYyxHQUFHLGNBQWMsQ0FBQztRQXdCaEMsa0RBQWtEO1FBQ2xELHdCQUFtQixHQUE4QixFQUFFLENBQUM7SUFTcEQsQ0FBQztJQTFCRCxzQkFDSSxtREFBUTtRQU1aLG1DQUFtQzthQUNuQztZQUNJLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUMxQixDQUFDO1FBWEQsb0RBQW9EO2FBQ3BELFVBQ2EsSUFBYztZQUN2QixJQUFJLENBQUMsMEJBQTBCLEdBQUcsU0FBUyxDQUFDLENBQUMseUJBQXlCO1lBQ3RFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFB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QWtEO1lBQ2xELEtBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFFbkQsb0NBQW9DO1lBQ3BDLEtBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLG9CQUFvQixFQUFFLEtBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvRCxDQUFDLENBQUMsQ0FBQztJQUVQLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsdUZBQStDLEdBQS9DO1FBQ0kseURBQXlEO1FBQ3pELElBQUksS0FBWSxDQUFDO1FBRWpCLHdEQUF3RDtRQUN4RCxJQUFJLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxZQUFZLEVBQUUsS0FBSyxRQUFRLEVBQUU7WUFDN0QsS0FBSyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUNsRDtRQUVELHlEQUF5RDtRQUN6RCxPQUFPLElBQUksMEJBQTBCLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRWxGLENBQUM7O2dCQTdKSixTQUFTLFNBQUM7b0JBQ1AsUUFBUSxFQUFFLDRCQUE0QjtvQkFDdEMsUUFBUSxFQUFFLDByREFzQmI7b0JBQ0csTUFBTSxFQUFFLENBQUMsMENBQTBDLENBQUM7aUJBQ3ZEOzs7O2dCQWpEUSxXQUFXLHVCQXFGSCxNQUFNLFNBQUMsV0FBVzs7OzRCQTlCOUIsS0FBSzt5Q0FFTCxTQUFTLFNBQUMsZUFBZTsyQkFHekIsS0FBSzs7SUEwSFYsb0NBQUM7Q0FBQSxBQS9KRCxJQStKQztTQXBJWSw2QkFBNkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEluamVjdCwgSW5wdXQsIE9uQ2hhbmdlcywgT25Jbml0LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1xuICAgIENvbXBhcmlzb25PcGVyYXRvcixcbiAgICBDb21wYXJpc29uT3BlcmF0b3JBbmRWYWx1ZSxcbiAgICBFcXVhbHMsXG4gICAgRXhpc3RzLFxuICAgIEdyZWF0ZXJUaGFuLFxuICAgIEdyZWF0ZXJUaGFuRXF1YWxzLFxuICAgIEtub3JhQ29uc3RhbnRzLFxuICAgIExlc3NUaGFuLFxuICAgIExlc3NUaGFuRXF1YWxzLFxuICAgIExpa2UsXG4gICAgTWF0Y2gsXG4gICAgTm90RXF1YWxzLFxuICAgIFByb3BlcnR5LFxuICAgIFByb3BlcnR5VmFsdWUsXG4gICAgVmFsdWVcbn0gZnJvbSAnQGtub3JhL2NvcmUnO1xuXG5cbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ1NjYxMDEwL2R5bmFtaWMtbmVzdGVkLXJlYWN0aXZlLWZvcm0tZXhwcmVzc2lvbmNoYW5nZWRhZnRlcml0aGFzYmVlbmNoZWNrZWRlcnJvclxuY29uc3QgcmVzb2x2ZWRQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2t1aS1zcGVjaWZ5LXByb3BlcnR5LXZhbHVlJyxcbiAgICB0ZW1wbGF0ZTogYDxtYXQtZm9ybS1maWVsZCBjbGFzcz1cInNlYXJjaC1vcGVyYXRvci1maWVsZFwiICpuZ0lmPVwiY29tcGFyaXNvbk9wZXJhdG9ycz8ubGVuZ3RoID4gMFwiPlxuICAgIDxtYXQtc2VsZWN0IHBsYWNlaG9sZGVyPVwiQ29tcGFyaXNvbiBPcGVyYXRvclwiIFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWydjb21wYXJpc29uT3BlcmF0b3InXVwiPlxuICAgICAgICA8bWF0LW9wdGlvbiAqbmdGb3I9XCJsZXQgY29tcE9wIG9mIGNvbXBhcmlzb25PcGVyYXRvcnNcIiBbdmFsdWVdPVwiY29tcE9wXCI+e3sgY29tcE9wLmxhYmVsIH19PC9tYXQtb3B0aW9uPlxuICAgIDwvbWF0LXNlbGVjdD5cbjwvbWF0LWZvcm0tZmllbGQ+XG5cbjwhLS0gc2VsZWN0IGFwdCBjb21wb25lbnQgZm9yIHZhbHVlIHNwZWNpZmljYXRpb24gdXNpbmcgYSBzd2l0Y2ggY2FzZSBzdGF0ZW1lbnQtLT5cbjxzcGFuXG4gICAgKm5nSWY9XCJjb21wYXJpc29uT3BlcmF0b3JTZWxlY3RlZCAhPT0gdW5kZWZpbmVkICYmIGNvbXBhcmlzb25PcGVyYXRvclNlbGVjdGVkICE9PSBudWxsICYmIGNvbXBhcmlzb25PcGVyYXRvclNlbGVjdGVkLmdldENsYXNzTmFtZSgpICE9ICdFeGlzdHMnXCJcbiAgICBbbmdTd2l0Y2hdPVwicHJvcGVydHlWYWx1ZVR5cGVcIj5cbiAgPGJvb2xlYW4tdmFsdWUgI3Byb3BlcnR5VmFsdWUgW2Zvcm1Hcm91cF09XCJmb3JtXCIgKm5nU3dpdGNoQ2FzZT1cIktub3JhQ29uc3RhbnRzLkJvb2xlYW5WYWx1ZVwiPjwvYm9vbGVhbi12YWx1ZT5cbiAgPGRhdGUtdmFsdWUgI3Byb3BlcnR5VmFsdWUgW2Zvcm1Hcm91cF09XCJmb3JtXCIgKm5nU3dpdGNoQ2FzZT1cIktub3JhQ29uc3RhbnRzLkRhdGVWYWx1ZVwiPjwvZGF0ZS12YWx1ZT5cbiAgPGRlY2ltYWwtdmFsdWUgI3Byb3BlcnR5VmFsdWUgW2Zvcm1Hcm91cF09XCJmb3JtXCIgKm5nU3dpdGNoQ2FzZT1cIktub3JhQ29uc3RhbnRzLkRlY2ltYWxWYWx1ZVwiPjwvZGVjaW1hbC12YWx1ZT5cbiAgPGludGVnZXItdmFsdWUgI3Byb3BlcnR5VmFsdWUgW2Zvcm1Hcm91cF09XCJmb3JtXCIgKm5nU3dpdGNoQ2FzZT1cIktub3JhQ29uc3RhbnRzLkludFZhbHVlXCI+PC9pbnRlZ2VyLXZhbHVlPlxuICA8bGluay12YWx1ZSAjcHJvcGVydHlWYWx1ZSBbZm9ybUdyb3VwXT1cImZvcm1cIiBbcmVzdHJpY3RSZXNvdXJjZUNsYXNzXT1cInByb3BlcnR5Lm9iamVjdFR5cGVcIlxuICAgICAgICAgICAgICAqbmdTd2l0Y2hDYXNlPVwiS25vcmFDb25zdGFudHMuUmVzb3VyY2VcIj48L2xpbmstdmFsdWU+XG4gIDx0ZXh0LXZhbHVlICNwcm9wZXJ0eVZhbHVlIFtmb3JtR3JvdXBdPVwiZm9ybVwiICpuZ1N3aXRjaENhc2U9XCJLbm9yYUNvbnN0YW50cy5UZXh0VmFsdWVcIj48L3RleHQtdmFsdWU+XG4gIDx1cmktdmFsdWUgI3Byb3BlcnR5VmFsdWUgW2Zvcm1Hcm91cF09XCJmb3JtXCIgKm5nU3dpdGNoQ2FzZT1cIktub3JhQ29uc3RhbnRzLlVyaVZhbHVlXCI+PC91cmktdmFsdWU+XG5cbiAgICA8IS0tIFRPRE86IFJlc291cmNlOiBoYW5kbGUgbGlua2luZyBwcm9wZXJ0aWVzIHdpdGggdGFyZ2V0IGNsYXNzIHJlc3RyaWN0aW9uOiBhY2Nlc3MgcHJvcGVydHkgbWVtYmVyIHRvIGdldCBvYmplY3RDbGFzcyB2aWEgcHJvcGVydHkoKSBnZXR0ZXIgbWV0aG9kIC0tPlxuICA8c3BhbiAqbmdTd2l0Y2hEZWZhdWx0PVwiXCI+Tm90IHN1cHBvcnRlZCB7e3Byb3BlcnR5VmFsdWVUeXBlfX08L3NwYW4+XG48L3NwYW4+XG5gLFxuICAgIHN0eWxlczogW2Auc2VhcmNoLW9wZXJhdG9yLWZpZWxke21hcmdpbi1yaWdodDo4cHh9YF1cbn0pXG5leHBvcnQgY2xhc3MgU3BlY2lmeVByb3BlcnR5VmFsdWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XG5cbiAgICBLbm9yYUNvbnN0YW50cyA9IEtub3JhQ29uc3RhbnRzO1xuXG4gICAgLy8gcGFyZW50IEZvcm1Hcm91cFxuICAgIEBJbnB1dCgpIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuXG4gICAgQFZpZXdDaGlsZCgncHJvcGVydHlWYWx1ZScpIHByb3BlcnR5VmFsdWVDb21wb25lbnQ6IFByb3BlcnR5VmFsdWU7XG5cbiAgICAvLyBzZXR0ZXIgbWV0aG9kIGZvciB0aGUgcHJvcGVydHkgY2hvc2VuIGJ5IHRoZSB1c2VyXG4gICAgQElucHV0KClcbiAgICBzZXQgcHJvcGVydHkocHJvcDogUHJvcGVydHkpIHtcbiAgICAgICAgdGhpcy5jb21wYXJpc29uT3BlcmF0b3JTZWxlY3RlZCA9IHVuZGVmaW5lZDsgLy8gcmVzZXQgdG8gaW5pdGlhbCBzdGF0ZVxuICAgICAgICB0aGlzLl9wcm9wZXJ0eSA9IHByb3A7XG4gICAgICAgIHRoaXMucmVzZXRDb21wYXJpc29uT3BlcmF0b3JzKCk7IC8vIHJlc2V0IGNvbXBhcmlzb24gb3BlcmF0b3JzIGZvciBnaXZlbiBwcm9wZXJ0eSAob3ZlcndyaXRpbmcgYW55IHByZXZpb3VzIHNlbGVjdGlvbilcbiAgICB9XG5cbiAgICAvLyBnZXR0ZXIgbWV0aG9kIGZvciB0aGlzLl9wcm9wZXJ0eVxuICAgIGdldCBwcm9wZXJ0eSgpOiBQcm9wZXJ0eSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9wZXJ0eTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9wcm9wZXJ0eTogUHJvcGVydHk7XG5cbiAgICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgICAvLyBhdmFpbGFibGUgY29tcGFyaXNvbiBvcGVyYXRvcnMgZm9yIHRoZSBwcm9wZXJ0eVxuICAgIGNvbXBhcmlzb25PcGVyYXRvcnM6IEFycmF5PENvbXBhcmlzb25PcGVyYXRvcj4gPSBbXTtcblxuICAgIC8vIGNvbXBhcmlzb24gb3BlcmF0b3Igc2VsZWN0ZWQgYnkgdGhlIHVzZXJcbiAgICBjb21wYXJpc29uT3BlcmF0b3JTZWxlY3RlZDogQ29tcGFyaXNvbk9wZXJhdG9yO1xuXG4gICAgLy8gdGhlIHR5cGUgb2YgdGhlIHByb3BlcnR5XG4gICAgcHJvcGVydHlWYWx1ZVR5cGU7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlcikge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc2V0cyB0aGUgY29tcGFyaXNvbiBvcGVyYXRvcnMgZm9yIHRoaXMuX3Byb3BlcnR5LlxuICAgICAqL1xuICAgIHJlc2V0Q29tcGFyaXNvbk9wZXJhdG9ycygpIHtcblxuICAgICAgICAvLyBkZXBlbmRpbmcgb24gb2JqZWN0IGNsYXNzLCBzZXQgY29tcGFyaXNvbiBvcGVyYXRvcnMgYW5kIHZhbHVlIGVudHJ5IGZpZWxkXG4gICAgICAgIGlmICh0aGlzLl9wcm9wZXJ0eS5pc0xpbmtQcm9wZXJ0eSkge1xuICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eVZhbHVlVHlwZSA9IEtub3JhQ29uc3RhbnRzLlJlc291cmNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eVZhbHVlVHlwZSA9IHRoaXMuX3Byb3BlcnR5Lm9iamVjdFR5cGU7XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKHRoaXMucHJvcGVydHlWYWx1ZVR5cGUpIHtcblxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5UZXh0VmFsdWU6XG4gICAgICAgICAgICAgICAgdGhpcy5jb21wYXJpc29uT3BlcmF0b3JzID0gW25ldyBMaWtlKCksIG5ldyBNYXRjaCgpLCBuZXcgRXF1YWxzKCksIG5ldyBOb3RFcXVhbHMoKSwgbmV3IEV4aXN0cygpXTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5Cb29sZWFuVmFsdWU6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLlJlc291cmNlOlxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5VcmlWYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuSW50ZXJ2YWxWYWx1ZTpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBhcmlzb25PcGVyYXRvcnMgPSBbbmV3IEVxdWFscygpLCBuZXcgTm90RXF1YWxzKCksIG5ldyBFeGlzdHMoKV07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuSW50VmFsdWU6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLkRlY2ltYWxWYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuRGF0ZVZhbHVlOlxuICAgICAgICAgICAgICAgIHRoaXMuY29tcGFyaXNvbk9wZXJhdG9ycyA9IFtuZXcgRXF1YWxzKCksIG5ldyBOb3RFcXVhbHMoKSwgbmV3IExlc3NUaGFuKCksIG5ldyBMZXNzVGhhbkVxdWFscygpLCBuZXcgR3JlYXRlclRoYW4oKSwgbmV3IEdyZWF0ZXJUaGFuRXF1YWxzKCksIG5ldyBFeGlzdHMoKV07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuTGlzdFZhbHVlOlxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5HZW9tVmFsdWU6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLkZpbGVWYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuQXVkaW9GaWxlVmFsdWU6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLlN0aWxsSW1hZ2VGaWxlVmFsdWU6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLkREREZpbGVWYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuTW92aW5nSW1hZ2VGaWxlVmFsdWU6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLlRleHRGaWxlVmFsdWU6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLkNvbG9yVmFsdWU6XG4gICAgICAgICAgICAgICAgdGhpcy5jb21wYXJpc29uT3BlcmF0b3JzID0gW25ldyBFeGlzdHMoKV07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0VSUk9SOiBVbnN1cHBvcnRlZCB2YWx1ZSB0eXBlICcgKyB0aGlzLl9wcm9wZXJ0eS5vYmplY3RUeXBlKTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHsgfVxuXG4gICAgbmdPbkNoYW5nZXMoKSB7XG5cbiAgICAgICAgLy8gYnVpbGQgYSBmb3JtIGZvciBjb21wYXJpc29uIG9wZXJhdG9yIHNlbGVjdGlvblxuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgICAgICAgIGNvbXBhcmlzb25PcGVyYXRvcjogW251bGwsIFZhbGlkYXRvcnMucmVxdWlyZWRdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHN0b3JlIGNvbXBhcmlzb24gb3BlcmF0b3Igd2hlbiBzZWxlY3RlZFxuICAgICAgICB0aGlzLmZvcm0udmFsdWVDaGFuZ2VzLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jb21wYXJpc29uT3BlcmF0b3JTZWxlY3RlZCA9IGRhdGEuY29tcGFyaXNvbk9wZXJhdG9yO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG5cbiAgICAgICAgICAgIC8vIHJlbW92ZSBmcm9tIHRoZSBwYXJlbnQgZm9ybSBncm91cCAoY2xlYW4gcmVzZXQpXG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5yZW1vdmVDb250cm9sKCdjb21wYXJpc29uT3BlcmF0b3InKTtcblxuICAgICAgICAgICAgLy8gYWRkIGZvcm0gdG8gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKCdjb21wYXJpc29uT3BlcmF0b3InLCB0aGlzLmZvcm0pO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIHNwZWNpZmllZCBjb21wYXJpc29uIG9wZXJhdG9yIGFuZCB2YWx1ZSBmb3IgdGhlIHByb3BlcnR5LlxuICAgICAqXG4gICAgICogcmV0dXJucyB7Q29tcGFyaXNvbk9wZXJhdG9yQW5kVmFsdWV9IHRoZSBjb21wYXJpc29uIG9wZXJhdG9yIGFuZCB0aGUgc3BlY2lmaWVkIHZhbHVlXG4gICAgICovXG4gICAgZ2V0Q29tcGFyaXNvbk9wZXJhdG9yQW5kVmFsdWVMaXRlcmFsRm9yUHJvcGVydHkoKTogQ29tcGFyaXNvbk9wZXJhdG9yQW5kVmFsdWUge1xuICAgICAgICAvLyByZXR1cm4gdmFsdWUgKGxpdGVyYWwgb3IgSVJJKSBmcm9tIHRoZSBjaGlsZCBjb21wb25lbnRcbiAgICAgICAgbGV0IHZhbHVlOiBWYWx1ZTtcblxuICAgICAgICAvLyBjb21wYXJpc29uIG9wZXJhdG9yICdFeGlzdHMnIGRvZXMgbm90IHJlcXVpcmUgYSB2YWx1ZVxuICAgICAgICBpZiAodGhpcy5jb21wYXJpc29uT3BlcmF0b3JTZWxlY3RlZC5nZXRDbGFzc05hbWUoKSAhPT0gJ0V4aXN0cycpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdGhpcy5wcm9wZXJ0eVZhbHVlQ29tcG9uZW50LmdldFZhbHVlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZXR1cm4gdGhlIGNvbXBhcmlzb24gb3BlcmF0b3IgYW5kIHRoZSBzcGVjaWZpZWQgdmFsdWVcbiAgICAgICAgcmV0dXJuIG5ldyBDb21wYXJpc29uT3BlcmF0b3JBbmRWYWx1ZSh0aGlzLmNvbXBhcmlzb25PcGVyYXRvclNlbGVjdGVkLCB2YWx1ZSk7XG5cbiAgICB9XG5cbn1cblxuIl19