
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../environments/environment';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Template1 } from '../models/template1';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-caroussel',
  standalone: true,
  imports: [NgbCarouselModule, NgFor, NgIf],
  templateUrl: './caroussel.component.html',
  styleUrl: './caroussel.component.scss',
  encapsulation: ViewEncapsulation.None,

})
export class CarousselComponent {
  @Input() data: Template1 | null = null;
  url = environment;

  ngOnChanges(changes: any) {
    if (changes.data) {
      console.log('data', this.data?.bannerImages);
    }
  }
}
