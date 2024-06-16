import { environment } from '../../environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgFor, NgStyle } from '@angular/common';
import { Template1 } from '../models/template1';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [MatCardModule, NgStyle, RouterModule, NgFor, MatButtonModule],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss'
})
export class CardsComponent implements OnInit {
  @Input() data: Template1 | null = null;

  public dynamicStylesTextLocalisation: object = {};
  public dynamicStylesTitle: object = {};
  public dynamicStylesText: object = {};
  public url = environment;


  ngOnInit(): void {
    this.setDynamicStyles();

  }

  setDynamicStyles(): void {
    if (this.data) {
      this.dynamicStylesTitle = {
        'font-family': this.data.titleFontStyleCard,
        'color': this.data.titleColorCard,
        'background-color': this.data.backgroundColorCard
      };

      this.dynamicStylesText =
      {
        'font-family': this.data.textFontStyleCard,
        'color': this.data.textColorCard,
      }

      this.dynamicStylesTextLocalisation =
      {
        'font-family': this.data.textFontStylePageAccueil,
        'color': this.data.textColorPageAccueil,
        'font-weight': "bold",
        'font-size': "22px",
        'padding': "20px",

      }

    } else {
      this.dynamicStylesTitle = {};
      this.dynamicStylesText = {};
      this.dynamicStylesTextLocalisation = {};

    }
  }

}
