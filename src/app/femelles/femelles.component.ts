import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, WritableSignal, signal } from '@angular/core';
import { Template1 } from '../models/template1';
import { Cat } from '../models/cat';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CatsService } from '../services/cats/cats.service';
import { ThemeService } from '../services/themes/theme.service';

interface DynamicStyles {
  title: { [key: string]: string };
  borderColor: { [key: string]: string };
  text: { [key: string]: string };
}

@Component({
  selector: 'app-femelles',
  standalone: true,
  imports: [NgClass, NgFor, NgStyle, NgIf],
  templateUrl: './femelles.component.html',
  styleUrl: './femelles.component.scss'
})
export class FemellesComponent {


  public data: WritableSignal<Template1 | null> = signal(null);
  public cats: WritableSignal<Cat[]> = signal([]);
  public dynamicStyles: WritableSignal<DynamicStyles> = signal({
    title: {},
    borderColor: {},
    text: {}
  });
  public url = environment;


  private templateSubscription: Subscription | undefined = undefined;
  private catSubscription: Subscription | undefined = undefined;

  constructor(private catsService: CatsService, private themeService: ThemeService, private router: Router) {
  }

  ngOnInit(): void {
    this.templateSubscription = this.themeService.template1$.subscribe(
      (response) => {
        if (response) {
          this.data.set(response);
          this.getDynamicStyles();
        }
      }
    );
    this.catSubscription = this.catsService.cats$.subscribe(
      (response) => {
        if (response) {
          this.cats.update(cat => cat = response.filter((cat: Cat) => cat.sex === "Femelle"));
        }
      }
    );

  }

  public redirectToNewUrl(id: number, cat: Cat): void {
    localStorage.setItem('selectedCat', JSON.stringify(cat));
    this.router.navigateByUrl('/femelles/' + id);
  }

  private getDynamicStyles(): void {
    const dataTemplate = this.data();
    if (dataTemplate) {
      this.dynamicStyles.set({
        title: {
          'font-size': '1.75rem',
          'font-family': dataTemplate.titleFontStylePageFemelles,
          'color': dataTemplate.titleColorPageFemelles,
        },
        borderColor: {
          'border': "2px solid" + dataTemplate.bordureColorPageFemelles,
        },
        text: {
          'font-family': dataTemplate.textFontStylePageFemelles,
          'color': dataTemplate.textColorPageFemelles,
        },
      });
    }
  }

  public onImageLoad() {
    // Ajoutez une classe pour déclencher l'animation
    const imageElement = event?.target as HTMLElement;
    if (imageElement) {
      imageElement.classList.add('loaded');
    }
  }



  public getGridClass(numCats: number): string {
    if (numCats === 3) {
      return 'image-grid';
    } else if (numCats === 2) {
      return 'two-columns';
    }
    else if (numCats === 1) {
      return 'one-column';
    }
    else {
      return 'image-grid';
    }
  }


  ngOnDestroy(): void {
    this.templateSubscription?.unsubscribe();
    this.catSubscription?.unsubscribe();
  }
}
