import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, WritableSignal, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgIf, NgStyle, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { PorteesService } from '../services/Portees/portees.service';
import { ThemeService } from '../services/themes/theme.service';
import { CatsService } from '../services/cats/cats.service';

import { Template1 } from '../models/template1';
import { Portee } from '../models/portee';
import { Cat } from '../models/cat';



interface DynamicStyles {
  title?: { [key: string]: string };
  info1?: { [key: string]: string };
  info2?: { [key: string]: string };
  info3?: { [key: string]: string };
  bordure?: { [key: string]: string };
  button?: { [key: string]: string };
}

@Component({
  selector: 'app-chatons',
  standalone: true,
  imports: [NgStyle, NgFor, MatButtonModule, NgIf],
  templateUrl: './chatons.component.html',
  styleUrl: './chatons.component.scss'
})
export class ChatonsComponent implements OnInit, OnDestroy {

  private porteeSubject: Subscription | undefined;
  private templateSubject: Subscription | undefined;
  private catsSubject: Subscription | undefined;
  private allCats: Cat[] = [];
  private allPortee: Portee[] = [];
  private data: Template1 | null = null;
  private isBrowser: Boolean;


  public porteeDisponible: WritableSignal<Boolean> = signal(false);
  public dynamicStyles: WritableSignal<DynamicStyles> = signal({});
  public porteInfo: WritableSignal<any> = signal([]);
  public env = environment;


  constructor(
    private porteesService: PorteesService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private themeService: ThemeService,
    private catsService: CatsService,
    private router: Router

  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    console.log('ou sui-je??');
    this.catsSubject = this.catsService.cats$.subscribe(cats => {
      if (cats) {
        this.allCats = cats;
      }
    });

    this.porteeSubject = this.porteesService.$portee.subscribe(portee => {
      if (portee) {
        this.allPortee = portee;
        this.porteeDisponible.set(this.allPortee.some(p => p.disponible));

        this.porteInfo.set(this.allPortee
          .filter(p => p.disponible)
          .map(portee => {
            const info = {
              nameFemale: '',
              nameMale: '',
              dateOfBirth: '',
              nbrMale: 0,
              nbrFemale: 0,
              urlFemale: environment.imgProfilCat + portee.urlProfilMother,
              urlMale: environment.imgProfilCat + portee.urlProfilFather,
              idMaman: portee.idMaman,
              idPapa: portee.idPapa,
              portee: portee
            };
            info.dateOfBirth = this.formaterDate(portee.dateOfBirth);

            info.nbrMale = portee.chatons.filter(chaton => chaton.sex === 'Mâle').length;
            info.nbrFemale = portee.chatons.filter(chaton => chaton.sex === 'Femelle').length;

            const mamanCat = this.allCats.find(cat => cat.id === portee.idMaman);
            const papaCat = this.allCats.find(cat => cat.id === portee.idPapa);
            info.nameFemale = mamanCat ? mamanCat.name : '';
            info.nameMale = papaCat ? papaCat.name : '';

            return info;
          }));
      }
    });

    this.templateSubject = this.themeService.template1$.subscribe(data => {
      // this.setDynamicStyles();

      if (data) {
        this.data = data;
        this.getDynamicStyles();
      }
    });
  }

  getDynamicStyles(): void {
    if (this.data) {
      this.dynamicStyles.set({});
      const dynamicStyles = this.dynamicStyles()

      if (this.data.titleFontStylePageChatons && this.data.titleColorPageChatons) {
        dynamicStyles.title = {
          'font-family': this.data.titleFontStylePageChatons,
          'color': this.data.titleColorPageChatons,
        };
      }

      if (this.data.info1FontStylePageChatons && this.data.info1ColorPageChatons) {
        dynamicStyles.info1 = {
          'font-family': this.data.info1FontStylePageChatons,
          'color': this.data.info1ColorPageChatons,
        };
      }

      if (this.data.info2FontStylePageChatons && this.data.info2ColorPageChatons) {
        dynamicStyles.info2 = {
          'font-family': this.data.info2FontStylePageChatons,
          'color': this.data.info2ColorPageChatons,
        };
      }

      if (this.data.info3FontStylePageChatons && this.data.info3ColorPageChatons) {
        dynamicStyles.info3 = {
          'font-family': this.data.info3FontStylePageChatons,
          'color': this.data.info3ColorPageChatons,
        };
      }

      if (this.data.bordureColorPageChatons) {
        dynamicStyles.bordure = {
          'color': this.data.bordureColorPageChatons,
        };
      }

      if (this.data.buttonTextFontStylePageChatons && this.data.buttonTextColorPageChatons && this.data.buttonColorPageChatons) {
        dynamicStyles.button = {
          'font-family': this.data.buttonTextFontStylePageChatons,
          'color': this.data.buttonTextColorPageChatons,
          'background-color': this.data.buttonColorPageChatons,
        };
      }
    }
  }

  formaterDate(inputDate: string): string {
    const dateObj = new Date(inputDate);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    const locale = 'fr-FR';
    const formattedDate = dateObj.toLocaleDateString(locale, options);
    return formattedDate;
  }

  redirectToNewUrl(id: number, type: string): void {

    this.router.navigate(['/', type, id]);
  }

  redirigerVersConditions() {
    this.router.navigate(['/conditions']).then(() => {
      const element = document.documentElement;
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
      }
    });
  }

  redirigerVersPortee(portee: any) {
    if (this.isBrowser && portee) {
      localStorage.setItem('selectedPortee', JSON.stringify(portee));
    }
    this.router.navigate(['/portee/' + portee.portee.id]).then(() => {
    });
  }

  faireDefilerVersBas() {
    this.router.navigate(['/conditions']).then(() => {
      const element = document.getElementById('preparer-son-arrivee');
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
      }
    });
  }



  onImageLoad() {
    // Ajoutez une classe pour déclencher l'animation
    const imageElement = event?.target as HTMLElement;
    if (imageElement) {
      imageElement.classList.add('loaded');
    }
  }


  ngOnDestroy(): void {
    this.templateSubject?.unsubscribe();
    this.porteeSubject?.unsubscribe();
    this.catsSubject?.unsubscribe();
  }


}
