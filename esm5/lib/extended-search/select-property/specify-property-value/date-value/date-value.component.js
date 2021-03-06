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
    /** @nocollapse */
    DateValueComponent.ctorParameters = function () { return [
        { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
    ]; };
    DateValueComponent.propDecorators = {
        formGroup: [{ type: Input }]
    };
    return DateValueComponent;
}());
export { DateValueComponent };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS12YWx1ZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Aa25vcmEvc2VhcmNoLyIsInNvdXJjZXMiOlsibGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9kYXRlLXZhbHVlL2RhdGUtdmFsdWUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVEsTUFBTSxFQUFFLEtBQUssRUFBcUIsTUFBTSxlQUFlLENBQUM7QUFDbEYsT0FBTyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFcEUsT0FBTyxFQUFFLGNBQWMsRUFBd0IsWUFBWSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBRWpGLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQztBQUU5RSx3SEFBd0g7QUFDeEgsSUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUU5QztJQXVCSSw0QkFBeUMsRUFBZTtRQUFmLE9BQUUsR0FBRixFQUFFLENBQWE7UUFQeEQsU0FBSSxHQUFHLGNBQWMsQ0FBQyxTQUFTLENBQUM7UUFJaEMsbUNBQW1DO1FBQ25DLG9CQUFlLEdBQUcsZUFBZSxDQUFDO0lBR2xDLENBQUM7SUFFRCxxQ0FBUSxHQUFSO1FBQUEsaUJBZ0JDO1FBZEcsa0JBQWtCO1FBQ2xCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUM7WUFDdEIsU0FBUyxFQUFFLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztTQUMvRCxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsVUFBQyxJQUFJO1lBQ2xDLCtCQUErQjtRQUNuQyxDQUFDLENBQUMsQ0FBQztRQUVILGVBQWUsQ0FBQyxJQUFJLENBQUM7WUFDakIsb0NBQW9DO1lBQ3BDLEtBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxLQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEQsQ0FBQyxDQUFDLENBQUM7SUFFUCxDQUFDO0lBRUQsd0NBQVcsR0FBWDtRQUFBLGlCQU9DO1FBTEcseUNBQXlDO1FBQ3pDLGVBQWUsQ0FBQyxJQUFJLENBQUM7WUFDakIsS0FBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFDLENBQUM7SUFFUCxDQUFDO0lBRUQscUNBQVEsR0FBUjtRQUVJLElBQU0sT0FBTyxHQUEyQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFFbEUsc0JBQXNCO1FBQ3RCLElBQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7UUFDNUMsc0JBQXNCO1FBQ3RCLElBQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQ2xELGVBQWU7UUFDZixJQUFNLFVBQVUsR0FBTSxjQUFjLENBQUMsV0FBVyxFQUFFLFNBQUksY0FBYyxDQUFDLFdBQVcsQ0FBQyxJQUFJLFNBQUksY0FBYyxDQUFDLFdBQVcsQ0FBQyxLQUFLLFNBQUksY0FBYyxDQUFDLFdBQVcsQ0FBQyxHQUFHLFNBQUksY0FBYyxDQUFDLFNBQVMsQ0FBQyxJQUFJLFNBQUksY0FBYyxDQUFDLFNBQVMsQ0FBQyxLQUFLLFNBQUksY0FBYyxDQUFDLFNBQVMsQ0FBQyxHQUFLLENBQUM7UUFFalEsT0FBTyxJQUFJLFlBQVksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFFLENBQUM7O2dCQWpFSixTQUFTLFNBQUM7b0JBQ1AsUUFBUSxFQUFFLFlBQVk7b0JBQ3RCLFFBQVEsRUFBRSx1WUFNSTtvQkFDZCxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUM7aUJBQ2Y7Ozs7Z0JBbkJRLFdBQVcsdUJBZ0NILE1BQU0sU0FBQyxXQUFXOzs7NEJBVDlCLEtBQUs7O0lBb0RWLHlCQUFDO0NBQUEsQUFsRUQsSUFrRUM7U0F2RFksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBIb3N0LCBJbmplY3QsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgS25vcmFDb25zdGFudHMsIFByb3BlcnR5VmFsdWUsIFZhbHVlLCBWYWx1ZUxpdGVyYWwgfSBmcm9tICdAa25vcmEvY29yZSc7XG5pbXBvcnQgeyBHcmVnb3JpYW5DYWxlbmRhckRhdGUsIEpETkNvbnZlcnRpYmxlQ2FsZW5kYXIsIEpETlBlcmlvZCB9IGZyb20gJ2pkbmNvbnZlcnRpYmxlY2FsZW5kYXInO1xuaW1wb3J0IHsgSGVhZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9oZWFkZXItY2FsZW5kYXIvaGVhZGVyLWNhbGVuZGFyLmNvbXBvbmVudCc7XG5cbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ1NjYxMDEwL2R5bmFtaWMtbmVzdGVkLXJlYWN0aXZlLWZvcm0tZXhwcmVzc2lvbmNoYW5nZWRhZnRlcml0aGFzYmVlbmNoZWNrZWRlcnJvclxuY29uc3QgcmVzb2x2ZWRQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2RhdGUtdmFsdWUnLFxuICAgIHRlbXBsYXRlOiBgPG1hdC1mb3JtLWZpZWxkPlxuICAgIDxrdWlKZG5EYXRlcGlja2VyPlxuICAgICAgICA8aW5wdXQgbWF0SW5wdXQgW21hdERhdGVwaWNrZXJdPVwicGlja2VyXCIgcGxhY2Vob2xkZXI9XCJDaG9vc2UgYSBkYXRlXCIgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ2RhdGVWYWx1ZSddXCI+XG4gICAgICAgIDxtYXQtZGF0ZXBpY2tlciAjcGlja2VyIFtjYWxlbmRhckhlYWRlckNvbXBvbmVudF09XCJoZWFkZXJDb21wb25lbnRcIj48L21hdC1kYXRlcGlja2VyPlxuICAgIDwva3VpSmRuRGF0ZXBpY2tlcj5cbiAgICA8bWF0LWRhdGVwaWNrZXItdG9nZ2xlIG1hdFN1ZmZpeCBbZm9yXT1cInBpY2tlclwiPjwvbWF0LWRhdGVwaWNrZXItdG9nZ2xlPlxuPC9tYXQtZm9ybS1maWVsZD5gLFxuICAgIHN0eWxlczogW2BgXVxufSlcbmV4cG9ydCBjbGFzcyBEYXRlVmFsdWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgUHJvcGVydHlWYWx1ZSB7XG5cbiAgICAvLyBwYXJlbnQgRm9ybUdyb3VwXG4gICAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgICB0eXBlID0gS25vcmFDb25zdGFudHMuRGF0ZVZhbHVlO1xuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgLy8gY3VzdG9tIGhlYWRlciBmb3IgdGhlIGRhdGVwaWNrZXJcbiAgICBoZWFkZXJDb21wb25lbnQgPSBIZWFkZXJDb21wb25lbnQ7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlcikge1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuXG4gICAgICAgIC8vIGluaXQgZGF0ZXBpY2tlclxuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgICAgICAgIGRhdGVWYWx1ZTogW251bGwsIFZhbGlkYXRvcnMuY29tcG9zZShbVmFsaWRhdG9ycy5yZXF1aXJlZF0pXVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmZvcm0udmFsdWVDaGFuZ2VzLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YS5kYXRlVmFsdWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAvLyBhZGQgZm9ybSB0byB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2woJ3Byb3BWYWx1ZScsIHRoaXMuZm9ybSk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG5cbiAgICAgICAgLy8gcmVtb3ZlIGZvcm0gZnJvbSB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAucmVtb3ZlQ29udHJvbCgncHJvcFZhbHVlJyk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgZ2V0VmFsdWUoKTogVmFsdWUge1xuXG4gICAgICAgIGNvbnN0IGRhdGVPYmo6IEpETkNvbnZlcnRpYmxlQ2FsZW5kYXIgPSB0aGlzLmZvcm0udmFsdWUuZGF0ZVZhbHVlO1xuXG4gICAgICAgIC8vIGdldCBjYWxlbmRhciBmb3JtYXRcbiAgICAgICAgY29uc3QgY2FsZW5kYXJGb3JtYXQgPSBkYXRlT2JqLmNhbGVuZGFyTmFtZTtcbiAgICAgICAgLy8gZ2V0IGNhbGVuZGFyIHBlcmlvZFxuICAgICAgICBjb25zdCBjYWxlbmRhclBlcmlvZCA9IGRhdGVPYmoudG9DYWxlbmRhclBlcmlvZCgpO1xuICAgICAgICAvLyBnZXQgdGhlIGRhdGVcbiAgICAgICAgY29uc3QgZGF0ZVN0cmluZyA9IGAke2NhbGVuZGFyRm9ybWF0LnRvVXBwZXJDYXNlKCl9OiR7Y2FsZW5kYXJQZXJpb2QucGVyaW9kU3RhcnQueWVhcn0tJHtjYWxlbmRhclBlcmlvZC5wZXJpb2RTdGFydC5tb250aH0tJHtjYWxlbmRhclBlcmlvZC5wZXJpb2RTdGFydC5kYXl9OiR7Y2FsZW5kYXJQZXJpb2QucGVyaW9kRW5kLnllYXJ9LSR7Y2FsZW5kYXJQZXJpb2QucGVyaW9kRW5kLm1vbnRofS0ke2NhbGVuZGFyUGVyaW9kLnBlcmlvZEVuZC5kYXl9YDtcblxuICAgICAgICByZXR1cm4gbmV3IFZhbHVlTGl0ZXJhbChTdHJpbmcoZGF0ZVN0cmluZyksIEtub3JhQ29uc3RhbnRzLkRhdGVWYWx1ZSk7XG4gICAgfVxufVxuIl19