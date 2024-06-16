import { ThemeService } from './services/themes/theme.service';
import { NavbarComponent } from './navbar/navbar.component';
import { HeaderComponent } from './header/header.component';
import { ApplicationRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { Template1 } from './models/template1';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../environments/environment';
import { FooterComponent } from './footer/footer.component';
import { InitializationService } from './services/initialization.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit, OnDestroy {

  private theme1Subscription: Subscription | undefined;
  private data: Template1 | null = null;
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID)
    private platformId: Object,
    private themeService: ThemeService,
    private initializationService: InitializationService,
    private appRef: ApplicationRef // Injection de ApplicationRef

  ) {

    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {

    this.initializationService.initialize();

    this.theme1Subscription = this.themeService.template1$.subscribe(
      (response) => {
        this.data = response;
        if (this.data?.favicon !== 'favicon.ico') {
          this.updateFavicon(environment.favicon + this.data?.favicon);
        }
      },
    )



  }


  private updateFavicon(faviconUrl: string): void {
    if (this.isBrowser) {
      const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'icon';
      link.href = faviconUrl;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }

  ngOnDestroy(): void {
    this.theme1Subscription?.unsubscribe();
  }

}
