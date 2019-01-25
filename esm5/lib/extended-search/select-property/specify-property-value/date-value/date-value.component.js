import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KnoraConstants, ValueLiteral } from '@knora/core';
import { HeaderComponent } from './header-calendar/header-calendar.component';
// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
var resolvedPromise = Promise.resolve(null);
var DateValueComponent = /** @class */ (function () {
    function DateValueComponent(fb) {
        this.fb = fb;
        this.type = KnoraConstants.DateValue;
        // custom header for the datepicker
        this.headerComponent = HeaderComponent;
    }
    DateValueComponent.prototype.ngOnInit = function () {
        var _this = this;
        // init datepicker
        this.form = this.fb.group({
            dateValue: [null, Validators.compose([Validators.required])]
        });
        this.form.valueChanges.subscribe(function (data) {
            // console.log(data.dateValue);
        });
        resolvedPromise.then(function () {
            // add form to the parent form group
            _this.formGroup.addControl('propValue', _this.form);
        });
    };
    DateValueComponent.prototype.ngOnDestroy = function () {
        var _this = this;
        // remove form from the parent form group
        resolvedPromise.then(function () {
            _this.formGroup.removeControl('propValue');
        });
    };
    DateValueComponent.prototype.getValue = function () {
        var dateObj = this.form.value.dateValue;
        // get calendar format
        var calendarFormat = dateObj.calendarName;
        // get calendar period
        var calendarPeriod = dateObj.toCalendarPeriod();
        // get the date
        var dateString = calendarFormat.toUpperCase() + ":" + calendarPeriod.periodStart.year + "-" + calendarPeriod.periodStart.month + "-" + calendarPeriod.periodStart.day + ":" + calendarPeriod.periodEnd.year + "-" + calendarPeriod.periodEnd.month + "-" + calendarPeriod.periodEnd.day;
        return new ValueLiteral(String(dateString), KnoraConstants.DateValue);
    };
    DateValueComponent.decorators = [
        { type: Component, args: [{
                    selector: 'date-value',
                    template: "<mat-form-field>\n    <kuiJdnDatepicker>\n        <input matInput [matDatepicker]=\"picker\" placeholder=\"Choose a date\" [formControl]=\"form.controls['dateValue']\">\n        <mat-datepicker #picker [calendarHeaderComponent]=\"headerComponent\"></mat-datepicker>\n    </kuiJdnDatepicker>\n    <mat-datepicker-toggle matSuffix [for]=\"picker\"></mat-datepicker-toggle>\n</mat-form-field>",
                    styles: [""]
                },] },
    ];
    DateValueComponent.ctorParameters = function () { return [
        { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
    ]; };
    DateValueComponent.propDecorators = {
        formGroup: [{ type: Input }]
    };
    return DateValueComponent;
}());
export { DateValueComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS12YWx1ZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Aa25vcmEvc2VhcmNoLyIsInNvdXJjZXMiOlsibGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9kYXRlLXZhbHVlL2RhdGUtdmFsdWUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVEsTUFBTSxFQUFFLEtBQUssRUFBcUIsTUFBTSxlQUFlLENBQUM7QUFDbEYsT0FBTyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFcEUsT0FBTyxFQUFFLGNBQWMsRUFBd0IsWUFBWSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBRWpGLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQztBQUU5RSx3SEFBd0g7QUFDeEgsSUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUU5QztJQXVCSSw0QkFBeUMsRUFBZTtRQUFmLE9BQUUsR0FBRixFQUFFLENBQWE7UUFQeEQsU0FBSSxHQUFHLGNBQWMsQ0FBQyxTQUFTLENBQUM7UUFJaEMsbUNBQW1DO1FBQ25DLG9CQUFlLEdBQUcsZUFBZSxDQUFDO0lBR2xDLENBQUM7SUFFRCxxQ0FBUSxHQUFSO1FBQUEsaUJBZ0JDO1FBZEcsa0JBQWtCO1FBQ2xCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUM7WUFDdEIsU0FBUyxFQUFFLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztTQUMvRCxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsVUFBQyxJQUFJO1lBQ2xDLCtCQUErQjtRQUNuQyxDQUFDLENBQUMsQ0FBQztRQUVILGVBQWUsQ0FBQyxJQUFJLENBQUM7WUFDakIsb0NBQW9DO1lBQ3BDLEtBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxLQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEQsQ0FBQyxDQUFDLENBQUM7SUFFUCxDQUFDO0lBRUQsd0NBQVcsR0FBWDtRQUFBLGlCQU9DO1FBTEcseUNBQXlDO1FBQ3pDLGVBQWUsQ0FBQyxJQUFJLENBQUM7WUFDakIsS0FBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFDLENBQUM7SUFFUCxDQUFDO0lBRUQscUNBQVEsR0FBUjtRQUVJLElBQU0sT0FBTyxHQUEyQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFFbEUsc0JBQXNCO1FBQ3RCLElBQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7UUFDNUMsc0JBQXNCO1FBQ3RCLElBQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQ2xELGVBQWU7UUFDZixJQUFNLFVBQVUsR0FBTSxjQUFjLENBQUMsV0FBVyxFQUFFLFNBQUksY0FBYyxDQUFDLFdBQVcsQ0FBQyxJQUFJLFNBQUksY0FBYyxDQUFDLFdBQVcsQ0FBQyxLQUFLLFNBQUksY0FBYyxDQUFDLFdBQVcsQ0FBQyxHQUFHLFNBQUksY0FBYyxDQUFDLFNBQVMsQ0FBQyxJQUFJLFNBQUksY0FBYyxDQUFDLFNBQVMsQ0FBQyxLQUFLLFNBQUksY0FBYyxDQUFDLFNBQVMsQ0FBQyxHQUFLLENBQUM7UUFFalEsT0FBTyxJQUFJLFlBQVksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFFLENBQUM7O2dCQWpFSixTQUFTLFNBQUM7b0JBQ1AsUUFBUSxFQUFFLFlBQVk7b0JBQ3RCLFFBQVEsRUFBRSx1WUFNSTtvQkFDZCxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUM7aUJBQ2Y7OztnQkFuQlEsV0FBVyx1QkFnQ0gsTUFBTSxTQUFDLFdBQVc7Ozs0QkFUOUIsS0FBSzs7SUFvRFYseUJBQUM7Q0FBQSxBQWxFRCxJQWtFQztTQXZEWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEhvc3QsIEluamVjdCwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBLbm9yYUNvbnN0YW50cywgUHJvcGVydHlWYWx1ZSwgVmFsdWUsIFZhbHVlTGl0ZXJhbCB9IGZyb20gJ0Brbm9yYS9jb3JlJztcbmltcG9ydCB7IEdyZWdvcmlhbkNhbGVuZGFyRGF0ZSwgSkROQ29udmVydGlibGVDYWxlbmRhciwgSkROUGVyaW9kIH0gZnJvbSAnamRuY29udmVydGlibGVjYWxlbmRhcic7XG5pbXBvcnQgeyBIZWFkZXJDb21wb25lbnQgfSBmcm9tICcuL2hlYWRlci1jYWxlbmRhci9oZWFkZXItY2FsZW5kYXIuY29tcG9uZW50JztcblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDU2NjEwMTAvZHluYW1pYy1uZXN0ZWQtcmVhY3RpdmUtZm9ybS1leHByZXNzaW9uY2hhbmdlZGFmdGVyaXRoYXNiZWVuY2hlY2tlZGVycm9yXG5jb25zdCByZXNvbHZlZFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnZGF0ZS12YWx1ZScsXG4gICAgdGVtcGxhdGU6IGA8bWF0LWZvcm0tZmllbGQ+XG4gICAgPGt1aUpkbkRhdGVwaWNrZXI+XG4gICAgICAgIDxpbnB1dCBtYXRJbnB1dCBbbWF0RGF0ZXBpY2tlcl09XCJwaWNrZXJcIiBwbGFjZWhvbGRlcj1cIkNob29zZSBhIGRhdGVcIiBbZm9ybUNvbnRyb2xdPVwiZm9ybS5jb250cm9sc1snZGF0ZVZhbHVlJ11cIj5cbiAgICAgICAgPG1hdC1kYXRlcGlja2VyICNwaWNrZXIgW2NhbGVuZGFySGVhZGVyQ29tcG9uZW50XT1cImhlYWRlckNvbXBvbmVudFwiPjwvbWF0LWRhdGVwaWNrZXI+XG4gICAgPC9rdWlKZG5EYXRlcGlja2VyPlxuICAgIDxtYXQtZGF0ZXBpY2tlci10b2dnbGUgbWF0U3VmZml4IFtmb3JdPVwicGlja2VyXCI+PC9tYXQtZGF0ZXBpY2tlci10b2dnbGU+XG48L21hdC1mb3JtLWZpZWxkPmAsXG4gICAgc3R5bGVzOiBbYGBdXG59KVxuZXhwb3J0IGNsYXNzIERhdGVWYWx1ZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBQcm9wZXJ0eVZhbHVlIHtcblxuICAgIC8vIHBhcmVudCBGb3JtR3JvdXBcbiAgICBASW5wdXQoKSBmb3JtR3JvdXA6IEZvcm1Hcm91cDtcblxuICAgIHR5cGUgPSBLbm9yYUNvbnN0YW50cy5EYXRlVmFsdWU7XG5cbiAgICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgICAvLyBjdXN0b20gaGVhZGVyIGZvciB0aGUgZGF0ZXBpY2tlclxuICAgIGhlYWRlckNvbXBvbmVudCA9IEhlYWRlckNvbXBvbmVudDtcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRm9ybUJ1aWxkZXIpIHByaXZhdGUgZmI6IEZvcm1CdWlsZGVyKSB7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG5cbiAgICAgICAgLy8gaW5pdCBkYXRlcGlja2VyXG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgICAgICAgZGF0ZVZhbHVlOiBbbnVsbCwgVmFsaWRhdG9ycy5jb21wb3NlKFtWYWxpZGF0b3JzLnJlcXVpcmVkXSldXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZm9ybS52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhkYXRhLmRhdGVWYWx1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIC8vIGFkZCBmb3JtIHRvIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAuYWRkQ29udHJvbCgncHJvcFZhbHVlJywgdGhpcy5mb3JtKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcblxuICAgICAgICAvLyByZW1vdmUgZm9ybSBmcm9tIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5yZW1vdmVDb250cm9sKCdwcm9wVmFsdWUnKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBnZXRWYWx1ZSgpOiBWYWx1ZSB7XG5cbiAgICAgICAgY29uc3QgZGF0ZU9iajogSkROQ29udmVydGlibGVDYWxlbmRhciA9IHRoaXMuZm9ybS52YWx1ZS5kYXRlVmFsdWU7XG5cbiAgICAgICAgLy8gZ2V0IGNhbGVuZGFyIGZvcm1hdFxuICAgICAgICBjb25zdCBjYWxlbmRhckZvcm1hdCA9IGRhdGVPYmouY2FsZW5kYXJOYW1lO1xuICAgICAgICAvLyBnZXQgY2FsZW5kYXIgcGVyaW9kXG4gICAgICAgIGNvbnN0IGNhbGVuZGFyUGVyaW9kID0gZGF0ZU9iai50b0NhbGVuZGFyUGVyaW9kKCk7XG4gICAgICAgIC8vIGdldCB0aGUgZGF0ZVxuICAgICAgICBjb25zdCBkYXRlU3RyaW5nID0gYCR7Y2FsZW5kYXJGb3JtYXQudG9VcHBlckNhc2UoKX06JHtjYWxlbmRhclBlcmlvZC5wZXJpb2RTdGFydC55ZWFyfS0ke2NhbGVuZGFyUGVyaW9kLnBlcmlvZFN0YXJ0Lm1vbnRofS0ke2NhbGVuZGFyUGVyaW9kLnBlcmlvZFN0YXJ0LmRheX06JHtjYWxlbmRhclBlcmlvZC5wZXJpb2RFbmQueWVhcn0tJHtjYWxlbmRhclBlcmlvZC5wZXJpb2RFbmQubW9udGh9LSR7Y2FsZW5kYXJQZXJpb2QucGVyaW9kRW5kLmRheX1gO1xuXG4gICAgICAgIHJldHVybiBuZXcgVmFsdWVMaXRlcmFsKFN0cmluZyhkYXRlU3RyaW5nKSwgS25vcmFDb25zdGFudHMuRGF0ZVZhbHVlKTtcbiAgICB9XG59XG4iXX0=