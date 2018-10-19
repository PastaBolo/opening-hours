import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  openingHoursRequired = new FormGroup({
    openingHour: new FormControl('08:00'),
    closingHour: new FormControl('20:00')
  }, Validators.required);

  openingHours = new FormGroup({
    openingHour: new FormControl('08:00'),
    closingHour: new FormControl('20:00')
  });
}
