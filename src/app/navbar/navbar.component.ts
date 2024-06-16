import { NgFor, NgIf, NgStyle, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, Signal, WritableSignal, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { ThemeService } from '../services/themes/theme.service';


interface DynamicStyles {
  fontFamily?: { [key: string]: string };
}


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgStyle, NgIf, NgFor, RouterModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {

  private template1Subscription: Subscription | undefined;
  private hoverColorMenu: string = '';
  // private fontStyleMenu: string = '';
  private isBrowser: boolean;

  public fontStyleMenu: WritableSignal<DynamicStyles> = signal({
    fontFamily: {
      "font-family":"Arial"
    }
  });
  public isMobile: WritableSignal<Boolean> = signal(false);
  public colorMenu: WritableSignal<string> = signal('');
  public menu: WritableSignal<string[]> = signal([]);

  constructor(
    private themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.template1Subscription = this.themeService.template1$.subscribe(
      (response) => {
        if (response) {
          if (this.isBrowser) {
            this.isMobile.set(window.innerWidth <= 767);
          }
          this.menu.set(response.menu);
          this.colorMenu.set(response.colorMenu);
          this.hoverColorMenu = response.hoverColorMenu;
          this.fontStyleMenu.set({
            'fontFamily': {
              'font-family': response.fontStyleMenu
            }
          });

          console.log(' this.fontStyleMenu', this.fontStyleMenu());

          if (this.isBrowser) {
            document.documentElement.style.setProperty('--hover-color-menu', this.hoverColorMenu);
          }
        }
      }
    )

  }

  /*   getDynamicStyles(): any {
      const styles: any = {};
      styles['font-family'] = this.fontStyleMenu;
      console.log('ici', this.fontStyleMenu);
      console.log('ici', styles);
  
      return styles;
    }
   */

  toggleMobileMenu(): void {
    this.isMobile.update(value => !value);

  }

  ngOnDestroy(): void {
    this.template1Subscription?.unsubscribe();

  }
}
