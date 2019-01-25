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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Aa25vcmEvc2VhcmNoLyIsInNvdXJjZXMiOlsibGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQXFCLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN2RixPQUFPLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNwRSxPQUFPLEVBRUgsMEJBQTBCLEVBQzFCLE1BQU0sRUFDTixNQUFNLEVBQ04sV0FBVyxFQUNYLGlCQUFpQixFQUNqQixjQUFjLEVBQ2QsUUFBUSxFQUNSLGNBQWMsRUFDZCxJQUFJLEVBQ0osS0FBSyxFQUNMLFNBQVMsRUFDVCxRQUFRLEVBR1gsTUFBTSxhQUFhLENBQUM7QUFHckIsd0hBQXdIO0FBQ3hILElBQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFOUM7SUE4REksdUNBQXlDLEVBQWU7UUFBZixPQUFFLEdBQUYsRUFBRSxDQUFhO1FBakN4RCxtQkFBYyxHQUFHLGNBQWMsQ0FBQztRQXdCaEMsa0RBQWtEO1FBQ2xELHdCQUFtQixHQUE4QixFQUFFLENBQUM7SUFTcEQsQ0FBQztJQTFCRCxzQkFDSSxtREFBUTtRQU1aLG1DQUFtQzthQUNuQztZQUNJLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUMxQixDQUFDO1FBWEQsb0RBQW9EO2FBQ3BELFVBQ2EsSUFBYztZQUN2QixJQUFJLENBQUMsMEJBQTBCLEdBQUcsU0FBUyxDQUFDLENBQUMseUJBQXlCO1lBQ3RFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFB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QWtEO1lBQ2xELEtBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFFbkQsb0NBQW9DO1lBQ3BDLEtBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLG9CQUFvQixFQUFFLEtBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvRCxDQUFDLENBQUMsQ0FBQztJQUVQLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsdUZBQStDLEdBQS9DO1FBQ0kseURBQXlEO1FBQ3pELElBQUksS0FBWSxDQUFDO1FBRWpCLHdEQUF3RDtRQUN4RCxJQUFJLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxZQUFZLEVBQUUsS0FBSyxRQUFRLEVBQUU7WUFDN0QsS0FBSyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUNsRDtRQUVELHlEQUF5RDtRQUN6RCxPQUFPLElBQUksMEJBQTBCLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRWxGLENBQUM7O2dCQTdKSixTQUFTLFNBQUM7b0JBQ1AsUUFBUSxFQUFFLDRCQUE0QjtvQkFDdEMsUUFBUSxFQUFFLDByREFzQmI7b0JBQ0csTUFBTSxFQUFFLENBQUMsMENBQTBDLENBQUM7aUJBQ3ZEOzs7Z0JBakRRLFdBQVcsdUJBcUZILE1BQU0sU0FBQyxXQUFXOzs7NEJBOUI5QixLQUFLO3lDQUVMLFNBQVMsU0FBQyxlQUFlOzJCQUd6QixLQUFLOztJQTBIVixvQ0FBQztDQUFBLEFBL0pELElBK0pDO1NBcElZLDZCQUE2QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5qZWN0LCBJbnB1dCwgT25DaGFuZ2VzLCBPbkluaXQsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7XG4gICAgQ29tcGFyaXNvbk9wZXJhdG9yLFxuICAgIENvbXBhcmlzb25PcGVyYXRvckFuZFZhbHVlLFxuICAgIEVxdWFscyxcbiAgICBFeGlzdHMsXG4gICAgR3JlYXRlclRoYW4sXG4gICAgR3JlYXRlclRoYW5FcXVhbHMsXG4gICAgS25vcmFDb25zdGFudHMsXG4gICAgTGVzc1RoYW4sXG4gICAgTGVzc1RoYW5FcXVhbHMsXG4gICAgTGlrZSxcbiAgICBNYXRjaCxcbiAgICBOb3RFcXVhbHMsXG4gICAgUHJvcGVydHksXG4gICAgUHJvcGVydHlWYWx1ZSxcbiAgICBWYWx1ZVxufSBmcm9tICdAa25vcmEvY29yZSc7XG5cblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDU2NjEwMTAvZHluYW1pYy1uZXN0ZWQtcmVhY3RpdmUtZm9ybS1leHByZXNzaW9uY2hhbmdlZGFmdGVyaXRoYXNiZWVuY2hlY2tlZGVycm9yXG5jb25zdCByZXNvbHZlZFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAna3VpLXNwZWNpZnktcHJvcGVydHktdmFsdWUnLFxuICAgIHRlbXBsYXRlOiBgPG1hdC1mb3JtLWZpZWxkIGNsYXNzPVwic2VhcmNoLW9wZXJhdG9yLWZpZWxkXCIgKm5nSWY9XCJjb21wYXJpc29uT3BlcmF0b3JzPy5sZW5ndGggPiAwXCI+XG4gICAgPG1hdC1zZWxlY3QgcGxhY2Vob2xkZXI9XCJDb21wYXJpc29uIE9wZXJhdG9yXCIgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ2NvbXBhcmlzb25PcGVyYXRvciddXCI+XG4gICAgICAgIDxtYXQtb3B0aW9uICpuZ0Zvcj1cImxldCBjb21wT3Agb2YgY29tcGFyaXNvbk9wZXJhdG9yc1wiIFt2YWx1ZV09XCJjb21wT3BcIj57eyBjb21wT3AubGFiZWwgfX08L21hdC1vcHRpb24+XG4gICAgPC9tYXQtc2VsZWN0PlxuPC9tYXQtZm9ybS1maWVsZD5cblxuPCEtLSBzZWxlY3QgYXB0IGNvbXBvbmVudCBmb3IgdmFsdWUgc3BlY2lmaWNhdGlvbiB1c2luZyBhIHN3aXRjaCBjYXNlIHN0YXRlbWVudC0tPlxuPHNwYW5cbiAgICAqbmdJZj1cImNvbXBhcmlzb25PcGVyYXRvclNlbGVjdGVkICE9PSB1bmRlZmluZWQgJiYgY29tcGFyaXNvbk9wZXJhdG9yU2VsZWN0ZWQgIT09IG51bGwgJiYgY29tcGFyaXNvbk9wZXJhdG9yU2VsZWN0ZWQuZ2V0Q2xhc3NOYW1lKCkgIT0gJ0V4aXN0cydcIlxuICAgIFtuZ1N3aXRjaF09XCJwcm9wZXJ0eVZhbHVlVHlwZVwiPlxuICA8Ym9vbGVhbi12YWx1ZSAjcHJvcGVydHlWYWx1ZSBbZm9ybUdyb3VwXT1cImZvcm1cIiAqbmdTd2l0Y2hDYXNlPVwiS25vcmFDb25zdGFudHMuQm9vbGVhblZhbHVlXCI+PC9ib29sZWFuLXZhbHVlPlxuICA8ZGF0ZS12YWx1ZSAjcHJvcGVydHlWYWx1ZSBbZm9ybUdyb3VwXT1cImZvcm1cIiAqbmdTd2l0Y2hDYXNlPVwiS25vcmFDb25zdGFudHMuRGF0ZVZhbHVlXCI+PC9kYXRlLXZhbHVlPlxuICA8ZGVjaW1hbC12YWx1ZSAjcHJvcGVydHlWYWx1ZSBbZm9ybUdyb3VwXT1cImZvcm1cIiAqbmdTd2l0Y2hDYXNlPVwiS25vcmFDb25zdGFudHMuRGVjaW1hbFZhbHVlXCI+PC9kZWNpbWFsLXZhbHVlPlxuICA8aW50ZWdlci12YWx1ZSAjcHJvcGVydHlWYWx1ZSBbZm9ybUdyb3VwXT1cImZvcm1cIiAqbmdTd2l0Y2hDYXNlPVwiS25vcmFDb25zdGFudHMuSW50VmFsdWVcIj48L2ludGVnZXItdmFsdWU+XG4gIDxsaW5rLXZhbHVlICNwcm9wZXJ0eVZhbHVlIFtmb3JtR3JvdXBdPVwiZm9ybVwiIFtyZXN0cmljdFJlc291cmNlQ2xhc3NdPVwicHJvcGVydHkub2JqZWN0VHlwZVwiXG4gICAgICAgICAgICAgICpuZ1N3aXRjaENhc2U9XCJLbm9yYUNvbnN0YW50cy5SZXNvdXJjZVwiPjwvbGluay12YWx1ZT5cbiAgPHRleHQtdmFsdWUgI3Byb3BlcnR5VmFsdWUgW2Zvcm1Hcm91cF09XCJmb3JtXCIgKm5nU3dpdGNoQ2FzZT1cIktub3JhQ29uc3RhbnRzLlRleHRWYWx1ZVwiPjwvdGV4dC12YWx1ZT5cbiAgPHVyaS12YWx1ZSAjcHJvcGVydHlWYWx1ZSBbZm9ybUdyb3VwXT1cImZvcm1cIiAqbmdTd2l0Y2hDYXNlPVwiS25vcmFDb25zdGFudHMuVXJpVmFsdWVcIj48L3VyaS12YWx1ZT5cblxuICAgIDwhLS0gVE9ETzogUmVzb3VyY2U6IGhhbmRsZSBsaW5raW5nIHByb3BlcnRpZXMgd2l0aCB0YXJnZXQgY2xhc3MgcmVzdHJpY3Rpb246IGFjY2VzcyBwcm9wZXJ0eSBtZW1iZXIgdG8gZ2V0IG9iamVjdENsYXNzIHZpYSBwcm9wZXJ0eSgpIGdldHRlciBtZXRob2QgLS0+XG4gIDxzcGFuICpuZ1N3aXRjaERlZmF1bHQ9XCJcIj5Ob3Qgc3VwcG9ydGVkIHt7cHJvcGVydHlWYWx1ZVR5cGV9fTwvc3Bhbj5cbjwvc3Bhbj5cbmAsXG4gICAgc3R5bGVzOiBbYC5zZWFyY2gtb3BlcmF0b3ItZmllbGR7bWFyZ2luLXJpZ2h0OjhweH1gXVxufSlcbmV4cG9ydCBjbGFzcyBTcGVjaWZ5UHJvcGVydHlWYWx1ZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcblxuICAgIEtub3JhQ29uc3RhbnRzID0gS25vcmFDb25zdGFudHM7XG5cbiAgICAvLyBwYXJlbnQgRm9ybUdyb3VwXG4gICAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgICBAVmlld0NoaWxkKCdwcm9wZXJ0eVZhbHVlJykgcHJvcGVydHlWYWx1ZUNvbXBvbmVudDogUHJvcGVydHlWYWx1ZTtcblxuICAgIC8vIHNldHRlciBtZXRob2QgZm9yIHRoZSBwcm9wZXJ0eSBjaG9zZW4gYnkgdGhlIHVzZXJcbiAgICBASW5wdXQoKVxuICAgIHNldCBwcm9wZXJ0eShwcm9wOiBQcm9wZXJ0eSkge1xuICAgICAgICB0aGlzLmNvbXBhcmlzb25PcGVyYXRvclNlbGVjdGVkID0gdW5kZWZpbmVkOyAvLyByZXNldCB0byBpbml0aWFsIHN0YXRlXG4gICAgICAgIHRoaXMuX3Byb3BlcnR5ID0gcHJvcDtcbiAgICAgICAgdGhpcy5yZXNldENvbXBhcmlzb25PcGVyYXRvcnMoKTsgLy8gcmVzZXQgY29tcGFyaXNvbiBvcGVyYXRvcnMgZm9yIGdpdmVuIHByb3BlcnR5IChvdmVyd3JpdGluZyBhbnkgcHJldmlvdXMgc2VsZWN0aW9uKVxuICAgIH1cblxuICAgIC8vIGdldHRlciBtZXRob2QgZm9yIHRoaXMuX3Byb3BlcnR5XG4gICAgZ2V0IHByb3BlcnR5KCk6IFByb3BlcnR5IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Byb3BlcnR5O1xuICAgIH1cblxuICAgIHByaXZhdGUgX3Byb3BlcnR5OiBQcm9wZXJ0eTtcblxuICAgIGZvcm06IEZvcm1Hcm91cDtcblxuICAgIC8vIGF2YWlsYWJsZSBjb21wYXJpc29uIG9wZXJhdG9ycyBmb3IgdGhlIHByb3BlcnR5XG4gICAgY29tcGFyaXNvbk9wZXJhdG9yczogQXJyYXk8Q29tcGFyaXNvbk9wZXJhdG9yPiA9IFtdO1xuXG4gICAgLy8gY29tcGFyaXNvbiBvcGVyYXRvciBzZWxlY3RlZCBieSB0aGUgdXNlclxuICAgIGNvbXBhcmlzb25PcGVyYXRvclNlbGVjdGVkOiBDb21wYXJpc29uT3BlcmF0b3I7XG5cbiAgICAvLyB0aGUgdHlwZSBvZiB0aGUgcHJvcGVydHlcbiAgICBwcm9wZXJ0eVZhbHVlVHlwZTtcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRm9ybUJ1aWxkZXIpIHByaXZhdGUgZmI6IEZvcm1CdWlsZGVyKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzZXRzIHRoZSBjb21wYXJpc29uIG9wZXJhdG9ycyBmb3IgdGhpcy5fcHJvcGVydHkuXG4gICAgICovXG4gICAgcmVzZXRDb21wYXJpc29uT3BlcmF0b3JzKCkge1xuXG4gICAgICAgIC8vIGRlcGVuZGluZyBvbiBvYmplY3QgY2xhc3MsIHNldCBjb21wYXJpc29uIG9wZXJhdG9ycyBhbmQgdmFsdWUgZW50cnkgZmllbGRcbiAgICAgICAgaWYgKHRoaXMuX3Byb3BlcnR5LmlzTGlua1Byb3BlcnR5KSB7XG4gICAgICAgICAgICB0aGlzLnByb3BlcnR5VmFsdWVUeXBlID0gS25vcmFDb25zdGFudHMuUmVzb3VyY2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnByb3BlcnR5VmFsdWVUeXBlID0gdGhpcy5fcHJvcGVydHkub2JqZWN0VHlwZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAodGhpcy5wcm9wZXJ0eVZhbHVlVHlwZSkge1xuXG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLlRleHRWYWx1ZTpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBhcmlzb25PcGVyYXRvcnMgPSBbbmV3IExpa2UoKSwgbmV3IE1hdGNoKCksIG5ldyBFcXVhbHMoKSwgbmV3IE5vdEVxdWFscygpLCBuZXcgRXhpc3RzKCldO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLkJvb2xlYW5WYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuUmVzb3VyY2U6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLlVyaVZhbHVlOlxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5JbnRlcnZhbFZhbHVlOlxuICAgICAgICAgICAgICAgIHRoaXMuY29tcGFyaXNvbk9wZXJhdG9ycyA9IFtuZXcgRXF1YWxzKCksIG5ldyBOb3RFcXVhbHMoKSwgbmV3IEV4aXN0cygpXTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5JbnRWYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuRGVjaW1hbFZhbHVlOlxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5EYXRlVmFsdWU6XG4gICAgICAgICAgICAgICAgdGhpcy5jb21wYXJpc29uT3BlcmF0b3JzID0gW25ldyBFcXVhbHMoKSwgbmV3IE5vdEVxdWFscygpLCBuZXcgTGVzc1RoYW4oKSwgbmV3IExlc3NUaGFuRXF1YWxzKCksIG5ldyBHcmVhdGVyVGhhbigpLCBuZXcgR3JlYXRlclRoYW5FcXVhbHMoKSwgbmV3IEV4aXN0cygpXTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5MaXN0VmFsdWU6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLkdlb21WYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuRmlsZVZhbHVlOlxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5BdWRpb0ZpbGVWYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuU3RpbGxJbWFnZUZpbGVWYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuRERERmlsZVZhbHVlOlxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5Nb3ZpbmdJbWFnZUZpbGVWYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuVGV4dEZpbGVWYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuQ29sb3JWYWx1ZTpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBhcmlzb25PcGVyYXRvcnMgPSBbbmV3IEV4aXN0cygpXTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRVJST1I6IFVuc3VwcG9ydGVkIHZhbHVlIHR5cGUgJyArIHRoaXMuX3Byb3BlcnR5Lm9iamVjdFR5cGUpO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIG5nT25Jbml0KCkgeyB9XG5cbiAgICBuZ09uQ2hhbmdlcygpIHtcblxuICAgICAgICAvLyBidWlsZCBhIGZvcm0gZm9yIGNvbXBhcmlzb24gb3BlcmF0b3Igc2VsZWN0aW9uXG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgICAgICAgY29tcGFyaXNvbk9wZXJhdG9yOiBbbnVsbCwgVmFsaWRhdG9ycy5yZXF1aXJlZF1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gc3RvcmUgY29tcGFyaXNvbiBvcGVyYXRvciB3aGVuIHNlbGVjdGVkXG4gICAgICAgIHRoaXMuZm9ybS52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmlzb25PcGVyYXRvclNlbGVjdGVkID0gZGF0YS5jb21wYXJpc29uT3BlcmF0b3I7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcblxuICAgICAgICAgICAgLy8gcmVtb3ZlIGZyb20gdGhlIHBhcmVudCBmb3JtIGdyb3VwIChjbGVhbiByZXNldClcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLnJlbW92ZUNvbnRyb2woJ2NvbXBhcmlzb25PcGVyYXRvcicpO1xuXG4gICAgICAgICAgICAvLyBhZGQgZm9ybSB0byB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2woJ2NvbXBhcmlzb25PcGVyYXRvcicsIHRoaXMuZm9ybSk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgc3BlY2lmaWVkIGNvbXBhcmlzb24gb3BlcmF0b3IgYW5kIHZhbHVlIGZvciB0aGUgcHJvcGVydHkuXG4gICAgICpcbiAgICAgKiByZXR1cm5zIHtDb21wYXJpc29uT3BlcmF0b3JBbmRWYWx1ZX0gdGhlIGNvbXBhcmlzb24gb3BlcmF0b3IgYW5kIHRoZSBzcGVjaWZpZWQgdmFsdWVcbiAgICAgKi9cbiAgICBnZXRDb21wYXJpc29uT3BlcmF0b3JBbmRWYWx1ZUxpdGVyYWxGb3JQcm9wZXJ0eSgpOiBDb21wYXJpc29uT3BlcmF0b3JBbmRWYWx1ZSB7XG4gICAgICAgIC8vIHJldHVybiB2YWx1ZSAobGl0ZXJhbCBvciBJUkkpIGZyb20gdGhlIGNoaWxkIGNvbXBvbmVudFxuICAgICAgICBsZXQgdmFsdWU6IFZhbHVlO1xuXG4gICAgICAgIC8vIGNvbXBhcmlzb24gb3BlcmF0b3IgJ0V4aXN0cycgZG9lcyBub3QgcmVxdWlyZSBhIHZhbHVlXG4gICAgICAgIGlmICh0aGlzLmNvbXBhcmlzb25PcGVyYXRvclNlbGVjdGVkLmdldENsYXNzTmFtZSgpICE9PSAnRXhpc3RzJykge1xuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLnByb3BlcnR5VmFsdWVDb21wb25lbnQuZ2V0VmFsdWUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJldHVybiB0aGUgY29tcGFyaXNvbiBvcGVyYXRvciBhbmQgdGhlIHNwZWNpZmllZCB2YWx1ZVxuICAgICAgICByZXR1cm4gbmV3IENvbXBhcmlzb25PcGVyYXRvckFuZFZhbHVlKHRoaXMuY29tcGFyaXNvbk9wZXJhdG9yU2VsZWN0ZWQsIHZhbHVlKTtcblxuICAgIH1cblxufVxuXG4iXX0=