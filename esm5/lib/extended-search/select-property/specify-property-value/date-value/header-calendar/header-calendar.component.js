import { Component, Host, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { JDNConvertibleCalendar } from 'jdnconvertiblecalendar';
import { DateAdapter, MatCalendar } from '@angular/material';
import { JDNConvertibleCalendarDateAdapter } from 'jdnconvertiblecalendardateadapter';
/** Custom header component containing a calendar format switcher */
var HeaderComponent = /** @class */ (function () {
    function HeaderComponent(_calendar, _dateAdapter, fb) {
        this._calendar = _calendar;
        this._dateAdapter = _dateAdapter;
        this.fb = fb;
        // a list of supported calendar formats (Gregorian and Julian)
        this.supportedCalendarFormats = JDNConvertibleCalendar.supportedCalendars;
    }
    HeaderComponent.prototype.ngOnInit = function () {
        var _this = this;
        // get the currently active calendar format from the date adapter
        if (this._dateAdapter instanceof JDNConvertibleCalendarDateAdapter) {
            this.activeFormat = this._dateAdapter.activeCalendarFormat;
        }
        else {
            console.log('date adapter is expected to be an instance of JDNConvertibleCalendarDateAdapter');
        }
        // build a form for the calendar format selection
        this.form = this.fb.group({
            calendar: [this.activeFormat, Validators.required]
        });
        // do the conversion when the user selects another calendar format
        this.form.valueChanges.subscribe(function (data) {
            // pass the target calendar format to the conversion method
            _this.convertDate(data.calendar);
        });
    };
    /**
     * Converts the date into the target format.
     *
     * @param calendar the target calendar format.
     */
    HeaderComponent.prototype.convertDate = function (calendar) {
        if (this._dateAdapter instanceof JDNConvertibleCalendarDateAdapter) {
            // convert the date into the target calendar format
            var convertedDate = this._dateAdapter.convertCalendarFormat(this._calendar.activeDate, calendar);
            // set the new date
            this._calendar.activeDate = convertedDate;
            // select the new date in the datepicker UI
            this._calendar._dateSelected(convertedDate);
            // update view after calendar format conversion
            var view = this._calendar.currentView === 'month' ? this._calendar.monthView :
                (this._calendar.currentView === 'year' ? this._calendar.yearView : this._calendar.multiYearView);
            view.ngAfterContentInit();
        }
        else {
            console.log('date adapter is expected to be an instance of JDNConvertibleCalendarDateAdapter');
        }
    };
    HeaderComponent.decorators = [
        { type: Component, args: [{
                    selector: 'kui-calendar-header',
                    template: "\n      <mat-select placeholder=\"Calendar Format\" [formControl]=\"form.controls['calendar']\">\n        <mat-option *ngFor=\"let cal of supportedCalendarFormats\" [value]=\"cal\">{{cal}}</mat-option>\n      </mat-select>\n      <mat-calendar-header></mat-calendar-header>\n    ",
                    styles: []
                },] },
    ];
    /** @nocollapse */
    HeaderComponent.ctorParameters = function () { return [
        { type: MatCalendar, decorators: [{ type: Host }] },
        { type: DateAdapter },
        { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
    ]; };
    return HeaderComponent;
}());
export { HeaderComponent };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLWNhbGVuZGFyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Brbm9yYS9zZWFyY2gvIiwic291cmNlcyI6WyJsaWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2RhdGUtdmFsdWUvaGVhZGVyLWNhbGVuZGFyL2hlYWRlci1jYWxlbmRhci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBYSxJQUFJLEVBQUUsTUFBTSxFQUE0QixNQUFNLGVBQWUsQ0FBQztBQUM3RixPQUFPLEVBQUUsV0FBVyxFQUFhLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXBFLE9BQU8sRUFBeUIsc0JBQXNCLEVBQWEsTUFBTSx3QkFBd0IsQ0FBQztBQUNsRyxPQUFPLEVBQUUsV0FBVyxFQUFtQixXQUFXLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM5RSxPQUFPLEVBQUUsaUNBQWlDLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUV0RixvRUFBb0U7QUFDcEU7SUFXSSx5QkFBNEIsU0FBOEMsRUFDOUQsWUFBaUQsRUFDNUIsRUFBZTtRQUZwQixjQUFTLEdBQVQsU0FBUyxDQUFxQztRQUM5RCxpQkFBWSxHQUFaLFlBQVksQ0FBcUM7UUFDNUIsT0FBRSxHQUFGLEVBQUUsQ0FBYTtRQUtoRCw4REFBOEQ7UUFDOUQsNkJBQXdCLEdBQUcsc0JBQXNCLENBQUMsa0JBQWtCLENBQUM7SUFMckUsQ0FBQztJQVVELGtDQUFRLEdBQVI7UUFBQSxpQkFvQkM7UUFsQkcsaUVBQWlFO1FBQ2pFLElBQUksSUFBSSxDQUFDLFlBQVksWUFBWSxpQ0FBaUMsRUFBRTtZQUNoRSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsb0JBQW9CLENBQUM7U0FDOUQ7YUFBTTtZQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsaUZBQWlGLENBQUMsQ0FBQztTQUNsRztRQUVELGlEQUFpRDtRQUNqRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDO1lBQ3RCLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQztTQUNyRCxDQUFDLENBQUM7UUFFSCxrRUFBa0U7UUFDbEUsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLFVBQUMsSUFBSTtZQUNsQywyREFBMkQ7WUFDM0QsS0FBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFDLENBQUM7SUFFUCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILHFDQUFXLEdBQVgsVUFBWSxRQUFnQztRQUV4QyxJQUFJLElBQUksQ0FBQyxZQUFZLFlBQVksaUNBQWlDLEVBQUU7WUFFaEUsbURBQW1EO1lBQ25ELElBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFFbkcsbUJBQW1CO1lBQ25CLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLGFBQWEsQ0FBQztZQUUxQywyQ0FBMkM7WUFDM0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFNUMsK0NBQStDO1lBQy9DLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDNUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRXJHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1NBQzdCO2FBQU07WUFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLGlGQUFpRixDQUFDLENBQUM7U0FDbEc7SUFDTCxDQUFDOztnQkF4RUosU0FBUyxTQUFDO29CQUNQLFFBQVEsRUFBRSxxQkFBcUI7b0JBQy9CLFFBQVEsRUFBRSx5UkFLVDtvQkFDRCxNQUFNLEVBQUUsRUFBRTtpQkFDYjs7OztnQkFic0MsV0FBVyx1QkFlakMsSUFBSTtnQkFmWixXQUFXO2dCQUhYLFdBQVcsdUJBb0JYLE1BQU0sU0FBQyxXQUFXOztJQTREM0Isc0JBQUM7Q0FBQSxBQXpFRCxJQXlFQztTQS9EWSxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBEaXJlY3RpdmUsIEhvc3QsIEluamVjdCwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgS25vcmFDb25zdGFudHMsIFByb3BlcnR5VmFsdWUsIFZhbHVlLCBWYWx1ZUxpdGVyYWwgfSBmcm9tICdAa25vcmEvY29yZSc7XG5pbXBvcnQgeyBHcmVnb3JpYW5DYWxlbmRhckRhdGUsIEpETkNvbnZlcnRpYmxlQ2FsZW5kYXIsIEpETlBlcmlvZCB9IGZyb20gJ2pkbmNvbnZlcnRpYmxlY2FsZW5kYXInO1xuaW1wb3J0IHsgRGF0ZUFkYXB0ZXIsIE1BVF9EQVRFX0xPQ0FMRSwgTWF0Q2FsZW5kYXIgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5pbXBvcnQgeyBKRE5Db252ZXJ0aWJsZUNhbGVuZGFyRGF0ZUFkYXB0ZXIgfSBmcm9tICdqZG5jb252ZXJ0aWJsZWNhbGVuZGFyZGF0ZWFkYXB0ZXInO1xuXG4vKiogQ3VzdG9tIGhlYWRlciBjb21wb25lbnQgY29udGFpbmluZyBhIGNhbGVuZGFyIGZvcm1hdCBzd2l0Y2hlciAqL1xuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdrdWktY2FsZW5kYXItaGVhZGVyJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgPG1hdC1zZWxlY3QgcGxhY2Vob2xkZXI9XCJDYWxlbmRhciBGb3JtYXRcIiBbZm9ybUNvbnRyb2xdPVwiZm9ybS5jb250cm9sc1snY2FsZW5kYXInXVwiPlxuICAgICAgICA8bWF0LW9wdGlvbiAqbmdGb3I9XCJsZXQgY2FsIG9mIHN1cHBvcnRlZENhbGVuZGFyRm9ybWF0c1wiIFt2YWx1ZV09XCJjYWxcIj57e2NhbH19PC9tYXQtb3B0aW9uPlxuICAgICAgPC9tYXQtc2VsZWN0PlxuICAgICAgPG1hdC1jYWxlbmRhci1oZWFkZXI+PC9tYXQtY2FsZW5kYXItaGVhZGVyPlxuICAgIGAsXG4gICAgc3R5bGVzOiBbXVxufSlcbmV4cG9ydCBjbGFzcyBIZWFkZXJDb21wb25lbnQ8RD4gaW1wbGVtZW50cyBPbkluaXQge1xuICAgIGNvbnN0cnVjdG9yKEBIb3N0KCkgcHJpdmF0ZSBfY2FsZW5kYXI6IE1hdENhbGVuZGFyPEpETkNvbnZlcnRpYmxlQ2FsZW5kYXI+LFxuICAgICAgICBwcml2YXRlIF9kYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXI8SkROQ29udmVydGlibGVDYWxlbmRhcj4sXG4gICAgICAgIEBJbmplY3QoRm9ybUJ1aWxkZXIpIHByaXZhdGUgZmI6IEZvcm1CdWlsZGVyKSB7XG4gICAgfVxuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgLy8gYSBsaXN0IG9mIHN1cHBvcnRlZCBjYWxlbmRhciBmb3JtYXRzIChHcmVnb3JpYW4gYW5kIEp1bGlhbilcbiAgICBzdXBwb3J0ZWRDYWxlbmRhckZvcm1hdHMgPSBKRE5Db252ZXJ0aWJsZUNhbGVuZGFyLnN1cHBvcnRlZENhbGVuZGFycztcblxuICAgIC8vIHRoZSBjdXJyZW50bHkgYWN0aXZlIGNhbGVuZGFyIGZvcm1hdFxuICAgIGFjdGl2ZUZvcm1hdDtcblxuICAgIG5nT25Jbml0KCkge1xuXG4gICAgICAgIC8vIGdldCB0aGUgY3VycmVudGx5IGFjdGl2ZSBjYWxlbmRhciBmb3JtYXQgZnJvbSB0aGUgZGF0ZSBhZGFwdGVyXG4gICAgICAgIGlmICh0aGlzLl9kYXRlQWRhcHRlciBpbnN0YW5jZW9mIEpETkNvbnZlcnRpYmxlQ2FsZW5kYXJEYXRlQWRhcHRlcikge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVGb3JtYXQgPSB0aGlzLl9kYXRlQWRhcHRlci5hY3RpdmVDYWxlbmRhckZvcm1hdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkYXRlIGFkYXB0ZXIgaXMgZXhwZWN0ZWQgdG8gYmUgYW4gaW5zdGFuY2Ugb2YgSkROQ29udmVydGlibGVDYWxlbmRhckRhdGVBZGFwdGVyJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBidWlsZCBhIGZvcm0gZm9yIHRoZSBjYWxlbmRhciBmb3JtYXQgc2VsZWN0aW9uXG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgICAgICAgY2FsZW5kYXI6IFt0aGlzLmFjdGl2ZUZvcm1hdCwgVmFsaWRhdG9ycy5yZXF1aXJlZF1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gZG8gdGhlIGNvbnZlcnNpb24gd2hlbiB0aGUgdXNlciBzZWxlY3RzIGFub3RoZXIgY2FsZW5kYXIgZm9ybWF0XG4gICAgICAgIHRoaXMuZm9ybS52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAvLyBwYXNzIHRoZSB0YXJnZXQgY2FsZW5kYXIgZm9ybWF0IHRvIHRoZSBjb252ZXJzaW9uIG1ldGhvZFxuICAgICAgICAgICAgdGhpcy5jb252ZXJ0RGF0ZShkYXRhLmNhbGVuZGFyKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyB0aGUgZGF0ZSBpbnRvIHRoZSB0YXJnZXQgZm9ybWF0LlxuICAgICAqXG4gICAgICogQHBhcmFtIGNhbGVuZGFyIHRoZSB0YXJnZXQgY2FsZW5kYXIgZm9ybWF0LlxuICAgICAqL1xuICAgIGNvbnZlcnREYXRlKGNhbGVuZGFyOiAnR3JlZ29yaWFuJyB8ICdKdWxpYW4nKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuX2RhdGVBZGFwdGVyIGluc3RhbmNlb2YgSkROQ29udmVydGlibGVDYWxlbmRhckRhdGVBZGFwdGVyKSB7XG5cbiAgICAgICAgICAgIC8vIGNvbnZlcnQgdGhlIGRhdGUgaW50byB0aGUgdGFyZ2V0IGNhbGVuZGFyIGZvcm1hdFxuICAgICAgICAgICAgY29uc3QgY29udmVydGVkRGF0ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLmNvbnZlcnRDYWxlbmRhckZvcm1hdCh0aGlzLl9jYWxlbmRhci5hY3RpdmVEYXRlLCBjYWxlbmRhcik7XG5cbiAgICAgICAgICAgIC8vIHNldCB0aGUgbmV3IGRhdGVcbiAgICAgICAgICAgIHRoaXMuX2NhbGVuZGFyLmFjdGl2ZURhdGUgPSBjb252ZXJ0ZWREYXRlO1xuXG4gICAgICAgICAgICAvLyBzZWxlY3QgdGhlIG5ldyBkYXRlIGluIHRoZSBkYXRlcGlja2VyIFVJXG4gICAgICAgICAgICB0aGlzLl9jYWxlbmRhci5fZGF0ZVNlbGVjdGVkKGNvbnZlcnRlZERhdGUpO1xuXG4gICAgICAgICAgICAvLyB1cGRhdGUgdmlldyBhZnRlciBjYWxlbmRhciBmb3JtYXQgY29udmVyc2lvblxuICAgICAgICAgICAgY29uc3QgdmlldyA9IHRoaXMuX2NhbGVuZGFyLmN1cnJlbnRWaWV3ID09PSAnbW9udGgnID8gdGhpcy5fY2FsZW5kYXIubW9udGhWaWV3IDpcbiAgICAgICAgICAgICAgICAodGhpcy5fY2FsZW5kYXIuY3VycmVudFZpZXcgPT09ICd5ZWFyJyA/IHRoaXMuX2NhbGVuZGFyLnllYXJWaWV3IDogdGhpcy5fY2FsZW5kYXIubXVsdGlZZWFyVmlldyk7XG5cbiAgICAgICAgICAgIHZpZXcubmdBZnRlckNvbnRlbnRJbml0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZGF0ZSBhZGFwdGVyIGlzIGV4cGVjdGVkIHRvIGJlIGFuIGluc3RhbmNlIG9mIEpETkNvbnZlcnRpYmxlQ2FsZW5kYXJEYXRlQWRhcHRlcicpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19