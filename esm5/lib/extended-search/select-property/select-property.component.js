import { Component, Inject, Input, ViewChild } from '@angular/core';
import { CardinalityOccurrence, Properties, PropertyWithValue, ResourceClass } from '@knora/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpecifyPropertyValueComponent } from './specify-property-value/specify-property-value.component';
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LXByb3BlcnR5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Brbm9yYS9zZWFyY2gvIiwic291cmNlcyI6WyJsaWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zZWxlY3QtcHJvcGVydHkuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBcUIsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3ZGLE9BQU8sRUFFSCxxQkFBcUIsRUFFckIsVUFBVSxFQUVWLGlCQUFpQixFQUNqQixhQUFhLEVBQ2hCLE1BQU0sYUFBYSxDQUFDO0FBQ3JCLE9BQU8sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3BFLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLDJEQUEyRCxDQUFDO0FBRzFHLHdIQUF3SDtBQUN4SCxJQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRTlDO0lBMERJLGlDQUF5QyxFQUFlO1FBQWYsT0FBRSxHQUFGLEVBQUUsQ0FBYTtJQUV4RCxDQUFDO0lBdENELHNCQUNJLCtDQUFVO2FBTWQ7WUFDRyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDM0IsQ0FBQztRQVZELHNFQUFzRTthQUN0RSxVQUNlLEtBQWlCO1lBQzVCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLENBQUMsQ0FBQywrREFBK0Q7WUFDbEcsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7WUFDekIsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDakMsQ0FBQzs7O09BQUE7SUFTRCxzQkFDSSx3REFBbUI7UUFGdkIsNENBQTRDO2FBQzVDLFVBQ3dCLEtBQW9CO1lBQ3hDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxLQUFLLENBQUM7UUFDdEMsQ0FB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NUI7UUFFSSxJQUFNLE9BQU8sR0FBK0IsSUFBSSxDQUFDLG9CQUFvQixDQUFDLCtDQUErQyxFQUFFLENBQUM7UUFFeEgsSUFBSSxlQUFlLEdBQUcsS0FBSyxDQUFDO1FBRTVCLHNEQUFzRDtRQUN0RCxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsRUFBRTtZQUN2QyxlQUFlLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDO1NBQ3JEO1FBRUQsT0FBTyxJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFFbEYsQ0FBQzs7Z0JBaEtKLFNBQVMsU0FBQztvQkFDUCxRQUFRLEVBQUUscUJBQXFCO29CQUMvQixRQUFRLEVBQUUsZ3FCQVF1SjtvQkFDakssTUFBTSxFQUFFLENBQUMsMENBQTBDLENBQUM7aUJBQ3ZEOzs7O2dCQW5CUSxXQUFXLHVCQWlFSCxNQUFNLFNBQUMsV0FBVzs7OzRCQTFDOUIsS0FBSzt3QkFHTCxLQUFLOzZCQUdMLEtBQUs7c0NBY0wsS0FBSzt1Q0FNTCxTQUFTLFNBQUMsc0JBQXNCOztJQXlIckMsOEJBQUM7Q0FBQSxBQW5LRCxJQW1LQztTQXRKWSx1QkFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEluamVjdCwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gICAgQ2FyZGluYWxpdHksXG4gICAgQ2FyZGluYWxpdHlPY2N1cnJlbmNlLFxuICAgIENvbXBhcmlzb25PcGVyYXRvckFuZFZhbHVlLFxuICAgIFByb3BlcnRpZXMsXG4gICAgUHJvcGVydHksXG4gICAgUHJvcGVydHlXaXRoVmFsdWUsXG4gICAgUmVzb3VyY2VDbGFzc1xufSBmcm9tICdAa25vcmEvY29yZSc7XG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgU3BlY2lmeVByb3BlcnR5VmFsdWVDb21wb25lbnQgfSBmcm9tICcuL3NwZWNpZnktcHJvcGVydHktdmFsdWUvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS5jb21wb25lbnQnO1xuXG5cbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ1NjYxMDEwL2R5bmFtaWMtbmVzdGVkLXJlYWN0aXZlLWZvcm0tZXhwcmVzc2lvbmNoYW5nZWRhZnRlcml0aGFzYmVlbmNoZWNrZWRlcnJvclxuY29uc3QgcmVzb2x2ZWRQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2t1aS1zZWxlY3QtcHJvcGVydHknLFxuICAgIHRlbXBsYXRlOiBgPG1hdC1mb3JtLWZpZWxkIGNsYXNzPVwic2VhcmNoLXByb3BlcnR5LWZpZWxkXCIgKm5nSWY9XCJwcm9wZXJ0aWVzQXNBcnJheT8ubGVuZ3RoID4gMFwiPlxuICA8bWF0LXNlbGVjdCBwbGFjZWhvbGRlcj1cIlByb3BlcnRpZXNcIiBbZm9ybUNvbnRyb2xdPVwiZm9ybS5jb250cm9sc1sncHJvcGVydHknXVwiPlxuICAgIDxtYXQtb3B0aW9uICpuZ0Zvcj1cImxldCBwcm9wIG9mIHByb3BlcnRpZXNBc0FycmF5XCIgW3ZhbHVlXT1cInByb3AuaWRcIj57eyBwcm9wLmxhYmVsIH19PC9tYXQtb3B0aW9uPlxuICA8L21hdC1zZWxlY3Q+XG48L21hdC1mb3JtLWZpZWxkPlxuXG48a3VpLXNwZWNpZnktcHJvcGVydHktdmFsdWUgI3NwZWNpZnlQcm9wZXJ0eVZhbHVlIFtmb3JtR3JvdXBdPVwiZm9ybVwiICpuZ0lmPVwicHJvcGVydHlTZWxlY3RlZCAhPT0gdW5kZWZpbmVkXCIgW3Byb3BlcnR5XT1cInByb3BlcnR5U2VsZWN0ZWRcIj48L2t1aS1zcGVjaWZ5LXByb3BlcnR5LXZhbHVlPlxuXG48bWF0LWNoZWNrYm94IG1hdFRvb2x0aXA9XCJTb3J0IGNyaXRlcmlvblwiICpuZ0lmPVwicHJvcGVydHlTZWxlY3RlZCAhPT0gdW5kZWZpbmVkICYmIHNvcnRDcml0ZXJpb24oKVwiIFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWydpc1NvcnRDcml0ZXJpb24nXVwiPjwvbWF0LWNoZWNrYm94PmAsXG4gICAgc3R5bGVzOiBbYC5zZWFyY2gtcHJvcGVydHktZmllbGR7bWFyZ2luLXJpZ2h0OjhweH1gXVxufSlcbmV4cG9ydCBjbGFzcyBTZWxlY3RQcm9wZXJ0eUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICAgIC8vIHBhcmVudCBGb3JtR3JvdXBcbiAgICBASW5wdXQoKSBmb3JtR3JvdXA6IEZvcm1Hcm91cDtcblxuICAgIC8vIGluZGV4IG9mIHRoZSBnaXZlbiBwcm9wZXJ0eSAodW5pcXVlKVxuICAgIEBJbnB1dCgpIGluZGV4OiBudW1iZXI7XG5cbiAgICAvLyBzZXR0ZXIgbWV0aG9kIGZvciBwcm9wZXJ0aWVzIHdoZW4gYmVpbmcgdXBkYXRlZCBieSBwYXJlbnQgY29tcG9uZW50XG4gICAgQElucHV0KClcbiAgICBzZXQgcHJvcGVydGllcyh2YWx1ZTogUHJvcGVydGllcykge1xuICAgICAgICB0aGlzLnByb3BlcnR5U2VsZWN0ZWQgPSB1bmRlZmluZWQ7IC8vIHJlc2V0IHNlbGVjdGVkIHByb3BlcnR5IChvdmVyd3JpdGluZyBhbnkgcHJldmlvdXMgc2VsZWN0aW9uKVxuICAgICAgICB0aGlzLl9wcm9wZXJ0aWVzID0gdmFsdWU7XG4gICAgICAgIHRoaXMudXBkYXRlUHJvcGVydGllc0FycmF5KCk7XG4gICAgfVxuXG4gICAgZ2V0IHByb3BlcnRpZXMoKSB7XG4gICAgICAgcmV0dXJuIHRoaXMuX3Byb3BlcnRpZXM7XG4gICAgfVxuXG4gICAgX2FjdGl2ZVJlc291cmNlQ2xhc3M6IFJlc291cmNlQ2xhc3M7XG5cbiAgICAvLyBzZXR0ZXIgbWV0aG9kIGZvciBzZWxlY3RlZCByZXNvdXJjZSBjbGFzc1xuICAgIEBJbnB1dCgpXG4gICAgc2V0IGFjdGl2ZVJlc291cmNlQ2xhc3ModmFsdWU6IFJlc291cmNlQ2xhc3MpIHtcbiAgICAgICAgdGhpcy5fYWN0aXZlUmVzb3VyY2VDbGFzcyA9IHZhbHVlO1xuICAgIH1cblxuICAgIC8vIHJlZmVyZW5jZSB0byBjaGlsZCBjb21wb25lbnQ6IGNvbWJpbmF0aW9uIG9mIGNvbXBhcmlzb24gb3BlcmF0b3IgYW5kIHZhbHVlIGZvciBjaG9zZW4gcHJvcGVydHlcbiAgICBAVmlld0NoaWxkKCdzcGVjaWZ5UHJvcGVydHlWYWx1ZScpIHNwZWNpZnlQcm9wZXJ0eVZhbHVlOiBTcGVjaWZ5UHJvcGVydHlWYWx1ZUNvbXBvbmVudDtcblxuICAgIC8vIHByb3BlcnRpZXMgdGhhdCBjYW4gYmUgc2VsZWN0ZWQgZnJvbVxuICAgIHByaXZhdGUgX3Byb3BlcnRpZXM6IFByb3BlcnRpZXM7XG5cbiAgICAvLyBwcm9wZXJ0aWVzIGFzIGFuIEFycmF5IHN0cnVjdHVyZSAoYmFzZWQgb24gdGhpcy5wcm9wZXJ0aWVzKVxuICAgIHByb3BlcnRpZXNBc0FycmF5OiBBcnJheTxQcm9wZXJ0eT47XG5cbiAgICAvLyByZXByZXNlbnRzIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgcHJvcGVydHlcbiAgICBwcm9wZXJ0eVNlbGVjdGVkOiBQcm9wZXJ0eTtcblxuICAgIGZvcm06IEZvcm1Hcm91cDtcblxuICAgIC8vIHVuaXF1ZSBuYW1lIGZvciB0aGlzIHByb3BlcnR5IHRvIGJlIHVzZWQgaW4gdGhlIHBhcmVudCBGb3JtR3JvdXBcbiAgICBwcm9wSW5kZXg6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRm9ybUJ1aWxkZXIpIHByaXZhdGUgZmI6IEZvcm1CdWlsZGVyKSB7XG5cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcblxuICAgICAgICAvLyBidWlsZCBhIGZvcm0gZm9yIHRoZSBwcm9wZXJ0eSBzZWxlY3Rpb25cbiAgICAgICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7XG4gICAgICAgICAgICBwcm9wZXJ0eTogW251bGwsIFZhbGlkYXRvcnMucmVxdWlyZWRdLFxuICAgICAgICAgICAgaXNTb3J0Q3JpdGVyaW9uOiBbZmFsc2UsIFZhbGlkYXRvcnMucmVxdWlyZWRdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgc2VsZWN0ZWQgcHJvcGVydHlcbiAgICAgICAgdGhpcy5mb3JtLnZhbHVlQ2hhbmdlcy5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHByb3BJcmkgPSBkYXRhLnByb3BlcnR5O1xuICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eVNlbGVjdGVkID0gdGhpcy5fcHJvcGVydGllc1twcm9wSXJpXTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wcm9wSW5kZXggPSAncHJvcGVydHknICsgdGhpcy5pbmRleDtcblxuICAgICAgICAgICAgLy8gYWRkIGZvcm0gdG8gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKHRoaXMucHJvcEluZGV4LCB0aGlzLmZvcm0pO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuXG4gICAgICAgIC8vIHJlbW92ZSBmb3JtIGZyb20gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLnJlbW92ZUNvbnRyb2wodGhpcy5wcm9wSW5kZXgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbmRpY2F0ZXMgaWYgcHJvcGVydHkgY2FuIGJlIHVzZWQgYXMgYSBzb3J0IGNyaXRlcmlvbi5cbiAgICAgKiBQcm9wZXJ0eSBoYXMgdG8gaGF2ZSBjYXJkaW5hbGl0eSBvciBtYXggY2FyZGluYWxpdHkgMSBmb3IgdGhlIGNob3NlbiByZXNvdXJjZSBjbGFzcy5cbiAgICAgKlxuICAgICAqIFdlIGNhbm5vdCBzb3J0IGJ5IHByb3BlcnRpZXMgd2hvc2UgY2FyZGluYWxpdHkgaXMgZ3JlYXRlciB0aGFuIDEuXG4gICAgICogUmV0dXJuIGJvb2xlYW5cbiAgICAgKi9cbiAgICBzb3J0Q3JpdGVyaW9uKCkge1xuXG4gICAgICAgIC8vIGNoZWNrIGlmIGEgcmVzb3VyY2UgY2xhc3MgaXMgc2VsZWN0ZWQgYW5kIGlmIHRoZSBwcm9wZXJ0eSdzIGNhcmRpbmFsaXR5IGlzIDEgZm9yIHRoZSBzZWxlY3RlZCByZXNvdXJjZSBjbGFzc1xuICAgICAgICBpZiAodGhpcy5fYWN0aXZlUmVzb3VyY2VDbGFzcyAhPT0gdW5kZWZpbmVkICYmIHRoaXMucHJvcGVydHlTZWxlY3RlZCAhPT0gdW5kZWZpbmVkICYmICF0aGlzLnByb3BlcnR5U2VsZWN0ZWQuaXNMaW5rUHJvcGVydHkpIHtcblxuICAgICAgICAgICAgY29uc3QgY2FyZGluYWxpdGllczogQ2FyZGluYWxpdHlbXSA9IHRoaXMuX2FjdGl2ZVJlc291cmNlQ2xhc3MuY2FyZGluYWxpdGllcy5maWx0ZXIoXG4gICAgICAgICAgICAgICAgKGNhcmQ6IENhcmRpbmFsaXR5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNhcmRpbmFsaXR5IDEgb3IgbWF4IG9jY3VycmVuY2UgMVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FyZC5wcm9wZXJ0eSA9PT0gdGhpcy5wcm9wZXJ0eVNlbGVjdGVkLmlkXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBjYXJkLnZhbHVlID09PSAxXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiAoY2FyZC5vY2N1cnJlbmNlID09PSBDYXJkaW5hbGl0eU9jY3VycmVuY2UuY2FyZCB8fCBjYXJkLm9jY3VycmVuY2UgPT09IENhcmRpbmFsaXR5T2NjdXJyZW5jZS5tYXhDYXJkKVxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcmV0dXJuIGNhcmRpbmFsaXRpZXMubGVuZ3RoID09PSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHRoZSBwcm9wZXJ0aWVzIGFycmF5IHRoYXQgaXMgYWNjZXNzZWQgYnkgdGhlIHRlbXBsYXRlLlxuICAgICAqL1xuICAgIHByaXZhdGUgdXBkYXRlUHJvcGVydGllc0FycmF5KCkge1xuXG4gICAgICAgIC8vIHJlcHJlc2VudCB0aGUgcHJvcGVydGllcyBhcyBhbiBhcnJheSB0byBiZSBhY2Nlc3NlZCBieSB0aGUgdGVtcGxhdGVcbiAgICAgICAgY29uc3QgcHJvcHNBcnJheSA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgcHJvcElyaSBpbiB0aGlzLl9wcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fcHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eShwcm9wSXJpKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByb3AgPSB0aGlzLl9wcm9wZXJ0aWVzW3Byb3BJcmldO1xuXG4gICAgICAgICAgICAgICAgLy8gb25seSBsaXN0IGVkaXRhYmxlIHByb3BzIHRoYXQgYXJlIG5vdCBsaW5rIHZhbHVlIHByb3BzXG4gICAgICAgICAgICAgICAgaWYgKHByb3AuaXNFZGl0YWJsZSAmJiAhcHJvcC5pc0xpbmtWYWx1ZVByb3BlcnR5KSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BzQXJyYXkucHVzaCh0aGlzLl9wcm9wZXJ0aWVzW3Byb3BJcmldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnByb3BlcnRpZXNBc0FycmF5ID0gcHJvcHNBcnJheTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBzZWxlY3RlZCBwcm9wZXJ0eSB3aXRoIHRoZSBzcGVjaWZpZWQgdmFsdWUuXG4gICAgICovXG4gICAgZ2V0UHJvcGVydHlTZWxlY3RlZFdpdGhWYWx1ZSgpOiBQcm9wZXJ0eVdpdGhWYWx1ZSB7XG5cbiAgICAgICAgY29uc3QgcHJvcFZhbDogQ29tcGFyaXNvbk9wZXJhdG9yQW5kVmFsdWUgPSB0aGlzLnNwZWNpZnlQcm9wZXJ0eVZhbHVlLmdldENvbXBhcmlzb25PcGVyYXRvckFuZFZhbHVlTGl0ZXJhbEZvclByb3BlcnR5KCk7XG5cbiAgICAgICAgbGV0IGlzU29ydENyaXRlcmlvbiA9IGZhbHNlO1xuXG4gICAgICAgIC8vIG9ubHkgbm9uIGxpbmtpbmcgcHJvcGVydGllcyBjYW4gYmUgdXNlZCBmb3Igc29ydGluZ1xuICAgICAgICBpZiAoIXRoaXMucHJvcGVydHlTZWxlY3RlZC5pc0xpbmtQcm9wZXJ0eSkge1xuICAgICAgICAgICAgaXNTb3J0Q3JpdGVyaW9uID0gdGhpcy5mb3JtLnZhbHVlLmlzU29ydENyaXRlcmlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvcGVydHlXaXRoVmFsdWUodGhpcy5wcm9wZXJ0eVNlbGVjdGVkLCBwcm9wVmFsLCBpc1NvcnRDcml0ZXJpb24pO1xuXG4gICAgfVxuXG5cbn1cbiJdfQ==