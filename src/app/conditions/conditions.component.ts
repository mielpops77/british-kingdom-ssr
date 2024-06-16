import { Component, ElementRef, Inject, Input, OnDestroy, OnInit, PLATFORM_ID, Renderer2, WritableSignal, signal } from '@angular/core';
import { ThemeService } from '../services/themes/theme.service';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

ThemeService

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.css'],
  standalone: true,
  imports: [],
})
export class ConditionsComponent implements OnInit, OnDestroy {
  private dataSubscription: Subscription | undefined;
  public data: WritableSignal<any> = signal([]);
  isBrowser: Boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private themeService: ThemeService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.dataSubscription = this.themeService.template1$.subscribe(data => {
      if (data) {
        this.data.set(data);

        if (this.isBrowser) {
          const container = this.el.nativeElement.querySelector('.conditions-container');

          const div = document.createElement('div');
          div.innerHTML = this.data().textPageCondition;

          this.renderer.setProperty(container, 'innerHTML', '');

          // Parcourir tous les éléments du div et appliquer les styles
          div.querySelectorAll('*').forEach((element: Element) => {
            const styles = this.extractStylesFromHtml(element.outerHTML);
            this.applyStyles(styles, element);
          });

          // Ajouter le contenu au conteneur
          this.renderer.appendChild(container, div);
        }
      }
    });
  }

  private extractStylesFromHtml(htmlContent: string): { [key: string]: string } {
    // Créer un élément div pour accueillir le HTML
    const div = document.createElement('div');
    div.innerHTML = htmlContent;

    const styles: { [key: string]: string } = {};

    // Parcourir toutes les balises du div et extraire les styles
    div.querySelectorAll('*').forEach((element: Element) => {
      const computedStyles = getComputedStyle(element as HTMLElement);

      // Filtrer les styles pour ne conserver que ceux qui sont spécifiés explicitement dans le HTML
      Array.from(computedStyles).forEach((style) => {
        const property = style.trim();
        const value = computedStyles.getPropertyValue(property);
        styles[property] = value;
      });
    });

    return styles;
  }


  private applyStyles(styles: { [key: string]: string }, element: Element): void {
    // Appliquer les styles à l'élément spécifié
    Object.entries(styles).forEach(([property, value]) => {
      // Ignorer les styles de fond (background) pour rendre le fond transparent
      if (property.toLowerCase().includes('background')) {
        return;
      }

      this.renderer.setStyle(element, property, value);
    });

    // Ajouter un style de fond transparent
    this.renderer.setStyle(element, 'background', 'transparent');
  }


  ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
  }
}
