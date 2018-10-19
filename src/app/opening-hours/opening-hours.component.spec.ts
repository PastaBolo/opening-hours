import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { OpeningHoursComponent } from './opening-hours.component';

const dispatchValue = (input: HTMLInputElement, value: string) => {
  input.value = value;
  input.dispatchEvent(new Event('input'));
};

@Component({
  template: `<app-opening-hours [formGroup]="form"></app-opening-hours>`
})
class HostComponent {
  form = new FormGroup({
    openingHour: new FormControl(),
    closingHour: new FormControl(),
  });
}

describe('OpeningHoursComponent', () => {
  let hostComponent: HostComponent;
  let hostFixture: ComponentFixture<HostComponent>;
  let openingHourInput: HTMLInputElement;
  let closingHourInput: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ OpeningHoursComponent, HostComponent ],
      imports: [ ReactiveFormsModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    hostFixture = TestBed.createComponent(HostComponent);
    hostComponent = hostFixture.componentInstance;
    [openingHourInput, closingHourInput] =
    hostFixture.debugElement.queryAll(By.css('input')).map(el => el.nativeElement);
    openingHourInput.value = '';
    closingHourInput.value = '';
  });

  describe('openingHours required', () => {
    beforeEach(() => {
      hostComponent.form.setValidators(Validators.required);
      hostFixture.detectChanges();
    });

    it('should return requiredAll error if all fields are empty', () => {
        expect(hostComponent.form.errors).toEqual({ requiredAll: true });
    });

    it('should return requiredAll error if one field is empty', () => {
      dispatchValue(openingHourInput, 'test');
      expect(hostComponent.form.errors).toEqual({ requiredAll: true });
    });
  });

  describe('openingHours not required', () => {
    beforeEach(() => {
      hostFixture.detectChanges();
    });

    it('should not return error if all fields are empty', () => {
      expect(hostComponent.form.errors).toBeNull();
    });

    it('should return allOrNothing error if one field is empty', () => {
      dispatchValue(openingHourInput, 'test');
      expect(hostComponent.form.errors).toEqual({ allOrNothing: true });
    });

    it('should return invalidTimeFormat error if both fields are invalid', () => {
      dispatchValue(openingHourInput, 'test1');
      dispatchValue(closingHourInput, 'test2');
      expect(hostComponent.form.errors).toEqual({ invalidTimeFormat: true });
    });

    it('should return invalidTimeFormat error if one field is invalid', () => {
      dispatchValue(openingHourInput, '08:00');
      dispatchValue(closingHourInput, 'test');
      expect(hostComponent.form.errors).toEqual({ invalidTimeFormat: true });
    });

    it('should return invalidTimeFormat error if one field is an invalid hour', () => {
      dispatchValue(openingHourInput, '08:00');
      dispatchValue(closingHourInput, '25:89');
      expect(hostComponent.form.errors).toEqual({ invalidTimeFormat: true });
    });

    it('should return openingAfterClosing error if opening hour is after closing hour', () => {
      dispatchValue(openingHourInput, '20:00');
      dispatchValue(closingHourInput, '08:00');
      expect(hostComponent.form.errors).toEqual({ openingAfterClosing: true });
    });

    it('should return openingAfterClosing error if the hours are the same', () => {
      dispatchValue(openingHourInput, '20:00');
      dispatchValue(closingHourInput, '08:00');
      expect(hostComponent.form.errors).toEqual({ openingAfterClosing: true });
    });

    it('should be valid if all fields are well filled', () => {
      dispatchValue(openingHourInput, '08:00');
      dispatchValue(closingHourInput, '20:00');
      expect(hostComponent.form.valid).toBeTruthy();
    });
  });
});
