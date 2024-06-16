import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, WritableSignal, signal } from '@angular/core';
import { CarousselComponent } from '../caroussel/caroussel.component';
import { ThemeService } from '../services/themes/theme.service';
import { ProfilService } from '../services/profil/profil.service';
import { CardsComponent } from '../cards/cards.component';
import { NgIf, isPlatformBrowser } from '@angular/common';
import { Template1 } from '../models/template1';
import { Profil } from '../models/profil';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';



@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CarousselComponent, CardsComponent, NgIf],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.scss'
})



export class AccueilComponent implements OnInit, OnDestroy {

  private template1Subscription: Subscription | undefined;
  private profilSubscription: Subscription | undefined;
  private isBrowser: Boolean;
  url = environment;
  public data: WritableSignal<Template1 | null> = signal(null);
  public profil: WritableSignal<Profil | null> = signal(null);

  constructor(@Inject(PLATFORM_ID) private plateformId: Object, private themeService: ThemeService, private profilService: ProfilService) {
    this.isBrowser = isPlatformBrowser(this.plateformId);

  }

  ngOnInit(): void {
    this.template1Subscription = this.themeService.template1$.subscribe(
      (response: Template1 | null) => {
        console.log('response', response);
        this.data.set(response);
      }
    )

    this.profilSubscription = this.profilService.profil$.subscribe(
      (response: Profil | null) => {
        this.profil.set(response);
      }
    )
  }


  public redirect(platform: string) {
    if (!this.isBrowser) {
      return;
    }
    let url: string | undefined = '';
    switch (platform) {
      case 'facebook':
        if (this.profil()?.facebook) {
          url = this.profil()?.facebook;
        }
        break;
      case 'twitter':
        if (this.profil()?.twitter) {
          url = this.profil()?.twitter;
        }
        break;
      case 'instagram':
        if (this.profil()?.instagram) {
          url = this.profil()?.instagram;
        }
        break;

      case 'tiktok':
        if (this.profil()?.tiktok) {
          url = this.profil()?.tiktok;
        }
        break;

      case 'youtube':
        if (this.profil()?.youtube) {
          url = this.profil()?.youtube;
        }
        break;
      default:
        break;
    }
    if (url) {
      window.open(url, '_blank');
    }
  }

  ngOnDestroy(): void {
    this.template1Subscription?.unsubscribe();
    this.profilSubscription?.unsubscribe();
  }


}
