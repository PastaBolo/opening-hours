import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validator, ValidationErrors, NG_VALIDATORS, FormControl, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-opening-hours',
  templateUrl: './opening-hours.component.html',
  styleUrls: ['./opening-hours.component.css'],
  providers: [
    { provide: NG_VALIDATORS, useExisting: OpeningHoursComponent, multi: true }
  ]
})
export class OpeningHoursComponent implements OnInit, Validator {
  // tslint:disable-next-line:no-input-rename
  @Input('formGroup') openingHours: FormGroup;
  openingHourControl: FormControl;
  closingHourControl: FormControl;
  private isRequired: boolean;

  ngOnInit(): void {
    const controls = Object.keys(this.openingHours.controls).map(k => this.openingHours.controls[k]);
    this.openingHourControl = <FormControl> controls[0];
    this.closingHourControl = <FormControl> controls[1];

    this.isRequired = ((validator: ValidatorFn) =>
      !!(validator(new FormControl()) || {}).required
    )(this.openingHours.validator || (() => null));
  }

  validate(): ValidationErrors | null {
    if (this.isRequired && this.someEmptyFields()) {
      return { requiredAll: true };
    }
    if (this.allEmptyFields()) {
      return null;
    }
    if (this.onlyOneEmptyField()) {
      return { allOrNothing: true };
    }
    if (this.isInvalidTimeFormat()) {
      return { invalidTimeFormat: true };
    }
    if (this.isOpeningAfterClosing()) {
      return { openingAfterClosing: true };
    }
    return null;
  }

  private allEmptyFields(): boolean {
    return !this.openingHourControl.value && !this.closingHourControl.value;
  }

  private someEmptyFields(): boolean {
    return !this.openingHourControl.value || !this.closingHourControl.value;
  }

  private onlyOneEmptyField(): boolean {
    // Logical XOR
    return !this.openingHourControl.value ? this.closingHourControl.value : ! this.closingHourControl.value;
  }

  private isInvalidTimeFormat(): boolean {
    const timeRegexp = /^([0-1]+[0-9]|2[0-3]):[0-5][0-9]$/;
    return !timeRegexp.test(this.openingHourControl.value) || !timeRegexp.test(this.closingHourControl.value);
  }

  private isOpeningAfterClosing(): boolean {
    const momentOpeningHour = moment(this.openingHourControl.value, 'HH:mm');
    const momentClosingHour = moment(this.closingHourControl.value, 'HH:mm');
    return momentClosingHour.isBefore(momentOpeningHour) || momentClosingHour.isSame(momentOpeningHour);
  }
}
