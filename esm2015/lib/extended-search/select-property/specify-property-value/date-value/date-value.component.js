/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KnoraConstants, ValueLiteral } from '@knora/core';
import { HeaderComponent } from './header-calendar/header-calendar.component';
/** @type {?} */
const resolvedPromise = Promise.resolve(null);
export class DateValueComponent {
    /**
     * @param {?} fb
     */
    constructor(fb) {
        this.fb = fb;
        this.type = KnoraConstants.DateValue;
        // custom header for the datepicker
        this.headerComponent = HeaderComponent;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        // init datepicker
        this.form = this.fb.group({
            dateValue: [null, Validators.compose([Validators.required])]
        });
        this.form.valueChanges.subscribe((data) => {
            // console.log(data.dateValue);
        });
        resolvedPromise.then(() => {
            // add form to the parent form group
            this.formGroup.addControl('propValue', this.form);
        });
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        // remove form from the parent form group
        resolvedPromise.then(() => {
            this.formGroup.removeControl('propValue');
        });
    }
    /**
     * @return {?}
     */
    getValue() {
        /** @type {?} */
        const dateObj = this.form.value.dateValue;
        /** @type {?} */
        const calendarFormat = dateObj.calendarName;
        /** @type {?} */
        const calendarPeriod = dateObj.toCalendarPeriod();
        /** @type {?} */
        const dateString = `${calendarFormat.toUpperCase()}:${calendarPeriod.periodStart.year}-${calendarPeriod.periodStart.month}-${calendarPeriod.periodStart.day}:${calendarPeriod.periodEnd.year}-${calendarPeriod.periodEnd.month}-${calendarPeriod.periodEnd.day}`;
        return new ValueLiteral(String(dateString), KnoraConstants.DateValue);
    }
}
DateValueComponent.decorators = [
    { type: Component, args: [{
                selector: 'date-value',
                template: `<mat-form-field>
    <jdn-datepicker>
        <input matInput [matDatepicker]="picker" placeholder="Choose a date" [formControl]="form.controls['dateValue']">
        <mat-datepicker #picker [calendarHeaderComponent]="headerComponent"></mat-datepicker>
    </jdn-datepicker>
    <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
</mat-form-field>`,
                styles: [``]
            },] },
];
/** @nocollapse */
DateValueComponent.ctorParameters = () => [
    { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
];
DateValueComponent.propDecorators = {
    formGroup: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    DateValueComponent.prototype.formGroup;
    /** @type {?} */
    DateValueComponent.prototype.type;
    /** @type {?} */
    DateValueComponent.prototype.form;
    /** @type {?} */
    DateValueComponent.prototype.headerComponent;
    /** @type {?} */
    DateValueComponent.prototype.fb;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS12YWx1ZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Aa25vcmEvc2VhcmNoLyIsInNvdXJjZXMiOlsibGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9kYXRlLXZhbHVlL2RhdGUtdmFsdWUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFRLE1BQU0sRUFBRSxLQUFLLEVBQXFCLE1BQU0sZUFBZSxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXBFLE9BQU8sRUFBRSxjQUFjLEVBQXdCLFlBQVksRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUVqRixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNkNBQTZDLENBQUM7O0FBRzlFLE1BQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFhOUMsTUFBTTs7OztJQVlGLFlBQXlDLEVBQWU7UUFBZixPQUFFLEdBQUYsRUFBRSxDQUFhO29CQVBqRCxjQUFjLENBQUMsU0FBUzs7K0JBS2IsZUFBZTtLQUdoQzs7OztJQUVELFFBQVE7O1FBR0osSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQztZQUN0QixTQUFTLEVBQUUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1NBQy9ELENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFOztTQUV6QyxDQUFDLENBQUM7UUFFSCxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTs7WUFFdEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNyRCxDQUFDLENBQUM7S0FFTjs7OztJQUVELFdBQVc7O1FBR1AsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDdEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDN0MsQ0FBQyxDQUFDO0tBRU47Ozs7SUFFRCxRQUFROztRQUVKLE1BQU0sT0FBTyxHQUEyQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7O1FBR2xFLE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7O1FBRTVDLE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDOztRQUVsRCxNQUFNLFVBQVUsR0FBRyxHQUFHLGNBQWMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxjQUFjLENBQUMsV0FBVyxDQUFDLElBQUksSUFBSSxjQUFjLENBQUMsV0FBVyxDQUFDLEtBQUssSUFBSSxjQUFjLENBQUMsV0FBVyxDQUFDLEdBQUcsSUFBSSxjQUFjLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxjQUFjLENBQUMsU0FBUyxDQUFDLEtBQUssSUFBSSxjQUFjLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRWpRLE1BQU0sQ0FBQyxJQUFJLFlBQVksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ3pFOzs7WUFqRUosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxZQUFZO2dCQUN0QixRQUFRLEVBQUU7Ozs7OztrQkFNSTtnQkFDZCxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUM7YUFDZjs7OztZQW5CUSxXQUFXLHVCQWdDSCxNQUFNLFNBQUMsV0FBVzs7O3dCQVQ5QixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBIb3N0LCBJbmplY3QsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgS25vcmFDb25zdGFudHMsIFByb3BlcnR5VmFsdWUsIFZhbHVlLCBWYWx1ZUxpdGVyYWwgfSBmcm9tICdAa25vcmEvY29yZSc7XG5pbXBvcnQgeyBHcmVnb3JpYW5DYWxlbmRhckRhdGUsIEpETkNvbnZlcnRpYmxlQ2FsZW5kYXIsIEpETlBlcmlvZCB9IGZyb20gJ2pkbmNvbnZlcnRpYmxlY2FsZW5kYXInO1xuaW1wb3J0IHsgSGVhZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9oZWFkZXItY2FsZW5kYXIvaGVhZGVyLWNhbGVuZGFyLmNvbXBvbmVudCc7XG5cbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ1NjYxMDEwL2R5bmFtaWMtbmVzdGVkLXJlYWN0aXZlLWZvcm0tZXhwcmVzc2lvbmNoYW5nZWRhZnRlcml0aGFzYmVlbmNoZWNrZWRlcnJvclxuY29uc3QgcmVzb2x2ZWRQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2RhdGUtdmFsdWUnLFxuICAgIHRlbXBsYXRlOiBgPG1hdC1mb3JtLWZpZWxkPlxuICAgIDxqZG4tZGF0ZXBpY2tlcj5cbiAgICAgICAgPGlucHV0IG1hdElucHV0IFttYXREYXRlcGlja2VyXT1cInBpY2tlclwiIHBsYWNlaG9sZGVyPVwiQ2hvb3NlIGEgZGF0ZVwiIFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWydkYXRlVmFsdWUnXVwiPlxuICAgICAgICA8bWF0LWRhdGVwaWNrZXIgI3BpY2tlciBbY2FsZW5kYXJIZWFkZXJDb21wb25lbnRdPVwiaGVhZGVyQ29tcG9uZW50XCI+PC9tYXQtZGF0ZXBpY2tlcj5cbiAgICA8L2pkbi1kYXRlcGlja2VyPlxuICAgIDxtYXQtZGF0ZXBpY2tlci10b2dnbGUgbWF0U3VmZml4IFtmb3JdPVwicGlja2VyXCI+PC9tYXQtZGF0ZXBpY2tlci10b2dnbGU+XG48L21hdC1mb3JtLWZpZWxkPmAsXG4gICAgc3R5bGVzOiBbYGBdXG59KVxuZXhwb3J0IGNsYXNzIERhdGVWYWx1ZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBQcm9wZXJ0eVZhbHVlIHtcblxuICAgIC8vIHBhcmVudCBGb3JtR3JvdXBcbiAgICBASW5wdXQoKSBmb3JtR3JvdXA6IEZvcm1Hcm91cDtcblxuICAgIHR5cGUgPSBLbm9yYUNvbnN0YW50cy5EYXRlVmFsdWU7XG5cbiAgICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgICAvLyBjdXN0b20gaGVhZGVyIGZvciB0aGUgZGF0ZXBpY2tlclxuICAgIGhlYWRlckNvbXBvbmVudCA9IEhlYWRlckNvbXBvbmVudDtcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRm9ybUJ1aWxkZXIpIHByaXZhdGUgZmI6IEZvcm1CdWlsZGVyKSB7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG5cbiAgICAgICAgLy8gaW5pdCBkYXRlcGlja2VyXG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgICAgICAgZGF0ZVZhbHVlOiBbbnVsbCwgVmFsaWRhdG9ycy5jb21wb3NlKFtWYWxpZGF0b3JzLnJlcXVpcmVkXSldXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZm9ybS52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhkYXRhLmRhdGVWYWx1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIC8vIGFkZCBmb3JtIHRvIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAuYWRkQ29udHJvbCgncHJvcFZhbHVlJywgdGhpcy5mb3JtKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcblxuICAgICAgICAvLyByZW1vdmUgZm9ybSBmcm9tIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5yZW1vdmVDb250cm9sKCdwcm9wVmFsdWUnKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBnZXRWYWx1ZSgpOiBWYWx1ZSB7XG5cbiAgICAgICAgY29uc3QgZGF0ZU9iajogSkROQ29udmVydGlibGVDYWxlbmRhciA9IHRoaXMuZm9ybS52YWx1ZS5kYXRlVmFsdWU7XG5cbiAgICAgICAgLy8gZ2V0IGNhbGVuZGFyIGZvcm1hdFxuICAgICAgICBjb25zdCBjYWxlbmRhckZvcm1hdCA9IGRhdGVPYmouY2FsZW5kYXJOYW1lO1xuICAgICAgICAvLyBnZXQgY2FsZW5kYXIgcGVyaW9kXG4gICAgICAgIGNvbnN0IGNhbGVuZGFyUGVyaW9kID0gZGF0ZU9iai50b0NhbGVuZGFyUGVyaW9kKCk7XG4gICAgICAgIC8vIGdldCB0aGUgZGF0ZVxuICAgICAgICBjb25zdCBkYXRlU3RyaW5nID0gYCR7Y2FsZW5kYXJGb3JtYXQudG9VcHBlckNhc2UoKX06JHtjYWxlbmRhclBlcmlvZC5wZXJpb2RTdGFydC55ZWFyfS0ke2NhbGVuZGFyUGVyaW9kLnBlcmlvZFN0YXJ0Lm1vbnRofS0ke2NhbGVuZGFyUGVyaW9kLnBlcmlvZFN0YXJ0LmRheX06JHtjYWxlbmRhclBlcmlvZC5wZXJpb2RFbmQueWVhcn0tJHtjYWxlbmRhclBlcmlvZC5wZXJpb2RFbmQubW9udGh9LSR7Y2FsZW5kYXJQZXJpb2QucGVyaW9kRW5kLmRheX1gO1xuXG4gICAgICAgIHJldHVybiBuZXcgVmFsdWVMaXRlcmFsKFN0cmluZyhkYXRlU3RyaW5nKSwgS25vcmFDb25zdGFudHMuRGF0ZVZhbHVlKTtcbiAgICB9XG59XG4iXX0=