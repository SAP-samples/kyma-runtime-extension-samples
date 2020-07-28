import { Component, OnInit } from '@angular/core';
import { CustomizationService } from '../customization.service';
import { Customization } from '../customization.model';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-customization-form',
  templateUrl: './customization-form.component.html',
  styleUrls: ['./customization-form.component.scss']
})
export class CustomizationFormComponent implements OnInit {
  customization: Customization;
  name = '';
  description = '';
  color = '#ff0000';
  usage = '';
  loading = true;

  constructor(
    private customizationService: CustomizationService,
    private route: ActivatedRoute
  ) {

  }

  usageTypeHandler(event: any) {
    console.log(event.target.value);
    this.usage = event.target.value;
  }

  // TODO: Add spinner for get and create

  save() {
    console.log('Save new customization');
    this.loading = true;
    const cust = new Customization();
    cust.name = this.name;
    cust.description = this.description;
    cust.color = this.color;
    cust.usage = this.usage;
    this.customizationService.createCustomization(+this.route.snapshot.queryParamMap.get('taskID'), cust).subscribe(customization => {
      this.customization = customization;
      this.loading = false;
    });
  }



  ngOnInit() {
    this.route.queryParamMap.subscribe(event => {
      if (event.get('taskID') != null) {
        console.log('GetTask');
        this.customizationService.getCustomization(+this.route.snapshot.queryParamMap.get('taskID'))
        .subscribe(customization => {
          this.customization = customization;
          this.loading = false;
        }, err => {
          console.log(err);
        }
      );
      }
    });
  }

}
