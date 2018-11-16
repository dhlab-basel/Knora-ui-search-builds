import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { JDNConvertibleCalendar } from 'jdnconvertiblecalendar';
import { DateAdapter, MatCalendar } from '@angular/material';
/** Custom header component containing a calendar format switcher */
export declare class HeaderComponent<D> implements OnInit {
    private _calendar;
    private _dateAdapter;
    private fb;
    constructor(_calendar: MatCalendar<JDNConvertibleCalendar>, _dateAdapter: DateAdapter<JDNConvertibleCalendar>, fb: FormBuilder);
    form: FormGroup;
    supportedCalendarFormats: string[];
    activeFormat: any;
    ngOnInit(): void;
    /**
     * Converts the date into the target format.
     *
     * @param calendar the target calendar format.
     */
    convertDate(calendar: 'Gregorian' | 'Julian'): void;
}
