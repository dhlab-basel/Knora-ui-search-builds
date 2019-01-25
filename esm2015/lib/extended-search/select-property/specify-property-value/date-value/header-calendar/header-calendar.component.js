import { Component, Host, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { JDNConvertibleCalendar } from 'jdnconvertiblecalendar';
import { DateAdapter, MatCalendar } from '@angular/material';
import { JDNConvertibleCalendarDateAdapter } from 'jdnconvertiblecalendardateadapter';
/** Custom header component containing a calendar format switcher */
export class HeaderComponent {
    constructor(_calendar, _dateAdapter, fb) {
        this._calendar = _calendar;
        this._dateAdapter = _dateAdapter;
        this.fb = fb;
        // a list of supported calendar formats (Gregorian and Julian)
        this.supportedCalendarFormats = JDNConvertibleCalendar.supportedCalendars;
    }
    ngOnInit() {
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
        this.form.valueChanges.subscribe((data) => {
            // pass the target calendar format to the conversion method
            this.convertDate(data.calendar);
        });
    }
    /**
     * Converts the date into the target format.
     *
     * @param calendar the target calendar format.
     */
    convertDate(calendar) {
        if (this._dateAdapter instanceof JDNConvertibleCalendarDateAdapter) {
            // convert the date into the target calendar format
            const convertedDate = this._dateAdapter.convertCalendarFormat(this._calendar.activeDate, calendar);
            // set the new date
            this._calendar.activeDate = convertedDate;
            // select the new date in the datepicker UI
            this._calendar._dateSelected(convertedDate);
            // update view after calendar format conversion
            const view = this._calendar.currentView === 'month' ? this._calendar.monthView :
                (this._calendar.currentView === 'year' ? this._calendar.yearView : this._calendar.multiYearView);
            view.ngAfterContentInit();
        }
        else {
            console.log('date adapter is expected to be an instance of JDNConvertibleCalendarDateAdapter');
        }
    }
}
HeaderComponent.decorators = [
    { type: Component, args: [{
                selector: 'kui-calendar-header',
                template: `
      <mat-select placeholder="Calendar Format" [formControl]="form.controls['calendar']">
        <mat-option *ngFor="let cal of supportedCalendarFormats" [value]="cal">{{cal}}</mat-option>
      </mat-select>
      <mat-calendar-header></mat-calendar-header>
    `,
                styles: []
            },] },
];
HeaderComponent.ctorParameters = () => [
    { type: MatCalendar, decorators: [{ type: Host }] },
    { type: DateAdapter },
    { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLWNhbGVuZGFyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Brbm9yYS9zZWFyY2gvIiwic291cmNlcyI6WyJsaWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2RhdGUtdmFsdWUvaGVhZGVyLWNhbGVuZGFyL2hlYWRlci1jYWxlbmRhci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBYSxJQUFJLEVBQUUsTUFBTSxFQUE0QixNQUFNLGVBQWUsQ0FBQztBQUM3RixPQUFPLEVBQUUsV0FBVyxFQUFhLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXBFLE9BQU8sRUFBeUIsc0JBQXNCLEVBQWEsTUFBTSx3QkFBd0IsQ0FBQztBQUNsRyxPQUFPLEVBQUUsV0FBVyxFQUFtQixXQUFXLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM5RSxPQUFPLEVBQUUsaUNBQWlDLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUV0RixvRUFBb0U7QUFXcEUsTUFBTTtJQUNGLFlBQTRCLFNBQThDLEVBQzlELFlBQWlELEVBQzVCLEVBQWU7UUFGcEIsY0FBUyxHQUFULFNBQVMsQ0FBcUM7UUFDOUQsaUJBQVksR0FBWixZQUFZLENBQXFDO1FBQzVCLE9BQUUsR0FBRixFQUFFLENBQWE7UUFLaEQsOERBQThEO1FBQzlELDZCQUF3QixHQUFHLHNCQUFzQixDQUFDLGtCQUFrQixDQUFDO0lBTHJFLENBQUM7SUFVRCxRQUFRO1FBRUosaUVBQWlFO1FBQ2pFLElBQUksSUFBSSxDQUFDLFlBQVksWUFBWSxpQ0FBaUMsRUFBRTtZQUNoRSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsb0JBQW9CLENBQUM7U0FDOUQ7YUFBTTtZQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsaUZBQWlGLENBQUMsQ0FBQztTQUNsRztRQUVELGlEQUFpRDtRQUNqRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDO1lBQ3RCLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQztTQUNyRCxDQUFDLENBQUM7UUFFSCxrRUFBa0U7UUFDbEUsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDdEMsMkRBQTJEO1lBQzNELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BDLENBQUMsQ0FBQyxDQUFDO0lBRVAsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxXQUFXLENBQUMsUUFBZ0M7UUFFeEMsSUFBSSxJQUFJLENBQUMsWUFBWSxZQUFZLGlDQUFpQyxFQUFFO1lBRWhFLG1EQUFtRDtZQUNuRCxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBRW5HLG1CQUFtQjtZQUNuQixJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxhQUFhLENBQUM7WUFFMUMsMkNBQTJDO1lBQzNDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRTVDLCtDQUErQztZQUMvQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzVFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUVyRyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztTQUM3QjthQUFNO1lBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpRkFBaUYsQ0FBQyxDQUFDO1NBQ2xHO0lBQ0wsQ0FBQzs7O1lBeEVKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUscUJBQXFCO2dCQUMvQixRQUFRLEVBQUU7Ozs7O0tBS1Q7Z0JBQ0QsTUFBTSxFQUFFLEVBQUU7YUFDYjs7O1lBYnNDLFdBQVcsdUJBZWpDLElBQUk7WUFmWixXQUFXO1lBSFgsV0FBVyx1QkFvQlgsTUFBTSxTQUFDLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIERpcmVjdGl2ZSwgSG9zdCwgSW5qZWN0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBLbm9yYUNvbnN0YW50cywgUHJvcGVydHlWYWx1ZSwgVmFsdWUsIFZhbHVlTGl0ZXJhbCB9IGZyb20gJ0Brbm9yYS9jb3JlJztcbmltcG9ydCB7IEdyZWdvcmlhbkNhbGVuZGFyRGF0ZSwgSkROQ29udmVydGlibGVDYWxlbmRhciwgSkROUGVyaW9kIH0gZnJvbSAnamRuY29udmVydGlibGVjYWxlbmRhcic7XG5pbXBvcnQgeyBEYXRlQWRhcHRlciwgTUFUX0RBVEVfTE9DQUxFLCBNYXRDYWxlbmRhciB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcbmltcG9ydCB7IEpETkNvbnZlcnRpYmxlQ2FsZW5kYXJEYXRlQWRhcHRlciB9IGZyb20gJ2pkbmNvbnZlcnRpYmxlY2FsZW5kYXJkYXRlYWRhcHRlcic7XG5cbi8qKiBDdXN0b20gaGVhZGVyIGNvbXBvbmVudCBjb250YWluaW5nIGEgY2FsZW5kYXIgZm9ybWF0IHN3aXRjaGVyICovXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2t1aS1jYWxlbmRhci1oZWFkZXInLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICA8bWF0LXNlbGVjdCBwbGFjZWhvbGRlcj1cIkNhbGVuZGFyIEZvcm1hdFwiIFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWydjYWxlbmRhciddXCI+XG4gICAgICAgIDxtYXQtb3B0aW9uICpuZ0Zvcj1cImxldCBjYWwgb2Ygc3VwcG9ydGVkQ2FsZW5kYXJGb3JtYXRzXCIgW3ZhbHVlXT1cImNhbFwiPnt7Y2FsfX08L21hdC1vcHRpb24+XG4gICAgICA8L21hdC1zZWxlY3Q+XG4gICAgICA8bWF0LWNhbGVuZGFyLWhlYWRlcj48L21hdC1jYWxlbmRhci1oZWFkZXI+XG4gICAgYCxcbiAgICBzdHlsZXM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIEhlYWRlckNvbXBvbmVudDxEPiBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgY29uc3RydWN0b3IoQEhvc3QoKSBwcml2YXRlIF9jYWxlbmRhcjogTWF0Q2FsZW5kYXI8SkROQ29udmVydGlibGVDYWxlbmRhcj4sXG4gICAgICAgIHByaXZhdGUgX2RhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcjxKRE5Db252ZXJ0aWJsZUNhbGVuZGFyPixcbiAgICAgICAgQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHtcbiAgICB9XG5cbiAgICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgICAvLyBhIGxpc3Qgb2Ygc3VwcG9ydGVkIGNhbGVuZGFyIGZvcm1hdHMgKEdyZWdvcmlhbiBhbmQgSnVsaWFuKVxuICAgIHN1cHBvcnRlZENhbGVuZGFyRm9ybWF0cyA9IEpETkNvbnZlcnRpYmxlQ2FsZW5kYXIuc3VwcG9ydGVkQ2FsZW5kYXJzO1xuXG4gICAgLy8gdGhlIGN1cnJlbnRseSBhY3RpdmUgY2FsZW5kYXIgZm9ybWF0XG4gICAgYWN0aXZlRm9ybWF0O1xuXG4gICAgbmdPbkluaXQoKSB7XG5cbiAgICAgICAgLy8gZ2V0IHRoZSBjdXJyZW50bHkgYWN0aXZlIGNhbGVuZGFyIGZvcm1hdCBmcm9tIHRoZSBkYXRlIGFkYXB0ZXJcbiAgICAgICAgaWYgKHRoaXMuX2RhdGVBZGFwdGVyIGluc3RhbmNlb2YgSkROQ29udmVydGlibGVDYWxlbmRhckRhdGVBZGFwdGVyKSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUZvcm1hdCA9IHRoaXMuX2RhdGVBZGFwdGVyLmFjdGl2ZUNhbGVuZGFyRm9ybWF0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2RhdGUgYWRhcHRlciBpcyBleHBlY3RlZCB0byBiZSBhbiBpbnN0YW5jZSBvZiBKRE5Db252ZXJ0aWJsZUNhbGVuZGFyRGF0ZUFkYXB0ZXInKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGJ1aWxkIGEgZm9ybSBmb3IgdGhlIGNhbGVuZGFyIGZvcm1hdCBzZWxlY3Rpb25cbiAgICAgICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7XG4gICAgICAgICAgICBjYWxlbmRhcjogW3RoaXMuYWN0aXZlRm9ybWF0LCBWYWxpZGF0b3JzLnJlcXVpcmVkXVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBkbyB0aGUgY29udmVyc2lvbiB3aGVuIHRoZSB1c2VyIHNlbGVjdHMgYW5vdGhlciBjYWxlbmRhciBmb3JtYXRcbiAgICAgICAgdGhpcy5mb3JtLnZhbHVlQ2hhbmdlcy5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgIC8vIHBhc3MgdGhlIHRhcmdldCBjYWxlbmRhciBmb3JtYXQgdG8gdGhlIGNvbnZlcnNpb24gbWV0aG9kXG4gICAgICAgICAgICB0aGlzLmNvbnZlcnREYXRlKGRhdGEuY2FsZW5kYXIpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIHRoZSBkYXRlIGludG8gdGhlIHRhcmdldCBmb3JtYXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2FsZW5kYXIgdGhlIHRhcmdldCBjYWxlbmRhciBmb3JtYXQuXG4gICAgICovXG4gICAgY29udmVydERhdGUoY2FsZW5kYXI6ICdHcmVnb3JpYW4nIHwgJ0p1bGlhbicpIHtcblxuICAgICAgICBpZiAodGhpcy5fZGF0ZUFkYXB0ZXIgaW5zdGFuY2VvZiBKRE5Db252ZXJ0aWJsZUNhbGVuZGFyRGF0ZUFkYXB0ZXIpIHtcblxuICAgICAgICAgICAgLy8gY29udmVydCB0aGUgZGF0ZSBpbnRvIHRoZSB0YXJnZXQgY2FsZW5kYXIgZm9ybWF0XG4gICAgICAgICAgICBjb25zdCBjb252ZXJ0ZWREYXRlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuY29udmVydENhbGVuZGFyRm9ybWF0KHRoaXMuX2NhbGVuZGFyLmFjdGl2ZURhdGUsIGNhbGVuZGFyKTtcblxuICAgICAgICAgICAgLy8gc2V0IHRoZSBuZXcgZGF0ZVxuICAgICAgICAgICAgdGhpcy5fY2FsZW5kYXIuYWN0aXZlRGF0ZSA9IGNvbnZlcnRlZERhdGU7XG5cbiAgICAgICAgICAgIC8vIHNlbGVjdCB0aGUgbmV3IGRhdGUgaW4gdGhlIGRhdGVwaWNrZXIgVUlcbiAgICAgICAgICAgIHRoaXMuX2NhbGVuZGFyLl9kYXRlU2VsZWN0ZWQoY29udmVydGVkRGF0ZSk7XG5cbiAgICAgICAgICAgIC8vIHVwZGF0ZSB2aWV3IGFmdGVyIGNhbGVuZGFyIGZvcm1hdCBjb252ZXJzaW9uXG4gICAgICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5fY2FsZW5kYXIuY3VycmVudFZpZXcgPT09ICdtb250aCcgPyB0aGlzLl9jYWxlbmRhci5tb250aFZpZXcgOlxuICAgICAgICAgICAgICAgICh0aGlzLl9jYWxlbmRhci5jdXJyZW50VmlldyA9PT0gJ3llYXInID8gdGhpcy5fY2FsZW5kYXIueWVhclZpZXcgOiB0aGlzLl9jYWxlbmRhci5tdWx0aVllYXJWaWV3KTtcblxuICAgICAgICAgICAgdmlldy5uZ0FmdGVyQ29udGVudEluaXQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkYXRlIGFkYXB0ZXIgaXMgZXhwZWN0ZWQgdG8gYmUgYW4gaW5zdGFuY2Ugb2YgSkROQ29udmVydGlibGVDYWxlbmRhckRhdGVBZGFwdGVyJyk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=