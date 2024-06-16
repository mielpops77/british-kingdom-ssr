import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, WritableSignal, signal } from '@angular/core';
import { ThemeService } from '../services/themes/theme.service';
import { NgStyle, isPlatformBrowser } from '@angular/common';
import { Template1 } from '../models/template1';
import { Subscription } from 'rxjs';



interface DynamicStyles {
  title: {
  };
  colorHeader: {
  };
  subtitle: {
  };
}


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {

  private template1Subscription: Subscription | undefined;
  private screenWidth: number = 0;
  private isBrowser: boolean;
  public dynamicStyles: WritableSignal<DynamicStyles> = signal({
    title: {
    },
    colorHeader: {
    },
    subtitle: {
    }
  });
  public data: WritableSignal<Template1 | null> = signal(null);


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private themeService: ThemeService,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    /*    if (this.isBrowser) {
         this.screenWidth = window.innerWidth;
       } */
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.screenWidth = window.innerWidth;
      window.addEventListener('resize', this.onWindowResize.bind(this));

      this.template1Subscription = this.themeService.template1$.subscribe(
        (response) => {
          this.data.set(response);
          this.getDynamicStyles();
        }
      )
    }
  }

  private onWindowResize(): void {
    this.screenWidth = window.innerWidth;
    this.getDynamicStyles();

  }

  /*  .titlePage {
     padding-top: 50px;
     padding-bottom: 30px;
 
     text-align: center;
 }
 
 .titlePage h1 {
     margin-bottom: 30px; 
 }
 
 .titlePage h2 {
     margin-top: 15px; 
 } */



  getDynamicStyles(): void {
    if (this.data) {
      const styles: DynamicStyles = {
        title: {
          'font-family': this.data()?.titleFontFamily,
          'color': this.data()?.titleColor,
          'font-size': this.screenWidth < 500 ? '25px' : this.screenWidth < 850 ? '30px' : this.screenWidth < 1000 ? '40px' : this.data()?.titleFontSize + 'px',
          'margin-bottom': this.screenWidth < 500 ? '10px' : this.screenWidth < 850 ? '15px' : this.screenWidth < 1000 ? '30px' : '30px',
        },
        colorHeader: {
          'background-color': this.data()?.colorHeader
        },
        subtitle: {
          'font-family': this.data()?.subtitleFontFamily,
          'color': this.data()?.subtitleColor,
          'font-size': this.screenWidth < 500 ? '15px' : this.screenWidth < 850 ? '20px' : this.screenWidth < 1000 ? '30px' : this.data()?.subtitleFontSize + 'px',
          'margin-top': this.screenWidth < 500 ? '5px' : this.screenWidth < 850 ? '10px' : this.screenWidth < 1000 ? '15px' : '15px',

        }
      };
      this.dynamicStyles.set(styles);
    }
  }


  ngOnDestroy(): void {
    this.template1Subscription?.unsubscribe();
  }
}
