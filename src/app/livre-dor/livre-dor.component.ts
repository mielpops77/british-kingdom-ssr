import { Component, OnDestroy, OnInit, WritableSignal, signal } from '@angular/core';
import { NgClass, NgFor, NgStyle, DatePipe } from '@angular/common';
import { environment } from '../../environments/environment';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';


import { SnackBarService } from '../services/snackBar/snack-bar.service';
import { LivreOrService } from '../services/livreOr/livre-or.service';
import { ThemeService } from '../services/themes/theme.service';

import { LivreOr } from '../models/livreOr';
import { Template1 } from '../models/template1';


interface DynamicStyles {
  title?: { [key: string]: string };
  textButton?: { [key: string]: string };
  text?: { [key: string]: string };
}

@Component({
  selector: 'app-livre-dor',
  templateUrl: './livre-dor.component.html',
  styleUrls: ['./livre-dor.component.css'],
  standalone: true,
  imports: [NgStyle, NgClass, NgFor, FormsModule, DatePipe]
})
export class LivreDorComponent implements OnInit, OnDestroy {


  constructor(private livreOrService: LivreOrService, private themeService: ThemeService, private snackBarService: SnackBarService) {
  }

  public dynamicStyles: WritableSignal<DynamicStyles> = signal({});
  public data: WritableSignal<Template1 | undefined> = signal(undefined);
  private templateSubscription: Subscription | undefined;
  public newAvis: WritableSignal<LivreOr> = signal({ name: '', profilId: environment.id, id: 0, dateofCrea: '', message: '', validation: false });
  public avis: WritableSignal<LivreOr[]> = signal([]);

  ngOnInit(): void {

    this.livreOrService.getAvis().subscribe(
      (response) => {
        this.avis.set((response as LivreOr[]).filter((avis: LivreOr) => avis.validation == true));
      }
    )

    this.templateSubscription = this.themeService.template1$.subscribe(data => {
      if (data) {
        this.data.set(data);
        this.getDynamicStyles();
      }
    });
  }

  ajouterTemoignage() {

    // this.newAvis.dateofCrea = new Date().toLocaleDateString();
    this.newAvis.update(value => ({
      ...value,
      dateofCrea: new Date().toISOString()
    }));


    if (this.validationVerif() == "sendValide") {
      this.livreOrService.createAvis(this.newAvis()).subscribe(
        (response) => {
          this.snackBarService.showSnackBar("Votre avis à bien été envoyé");
          this.newAvis.set({ name: '', profilId: environment.id, id: 0, dateofCrea: '', message: '', validation: false })
        },
        (error) => {
          console.error('Erreur:', error);
        }
      );
    }

  }

  validationVerif() {

    if (this.newAvis.name !== '' && this.newAvis().message !== '') {
      return "sendValide"
    }
    else {
      return "sendNoValide"

    }
  }

  private getDynamicStyles(): void {
    if (this.data()) {
      this.dynamicStyles.set({
        title: {
          'font-family': this.data()?.titleFontStylePagelivreDor ?? 'default-font-family',
          'color': this.data()?.titleColorPagelivreDor ?? 'default-color',
        },
        textButton: {
          'font-family': this.data()?.buttonTextFontStylePagelivreDor ?? 'default-font-family',
          'color': this.data()?.buttonTextColorPagelivreDor ?? 'default-color',
          'background-color': this.data()?.buttonColorPagelivreDor ?? 'default-background-color',
        },
        text: {
          'font-family': this.data()?.textFontStylePageFemelles ?? 'default-font-family',
          'color': this.data()?.textColorPageFemelles ?? 'default-color',
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.templateSubscription?.unsubscribe();
  }


}
