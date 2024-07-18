import { DatePipe, NgClass, NgFor, NgIf, NgStyle, UpperCasePipe, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, PLATFORM_ID, WritableSignal, signal } from '@angular/core';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';
import { environment } from '../../environments/environment';
import { CatsService } from '../services/cats/cats.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Cat } from '../models/cat';
import { Subscription } from 'rxjs';
import { ThemeService } from '../services/themes/theme.service';

import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-cat',
  standalone: true,
  imports: [NgStyle, NgClass, DatePipe, UpperCasePipe, NgFor, NgIf, AsyncPipe],
  templateUrl: './cat.component.html',
  styleUrl: './cat.component.scss'
})
export class CatComponent {

  selectedCat: WritableSignal<Cat | null> = signal<Cat | null>(null);

  public imageUrlParentsCat: string = "";
  public imageUrlCatProfil: string = "";
  public imageUrlCatImg: string = "";
  public screenWidth: number = 0
  // screenWidth: number = window.innerWidth;

  private env = environment;
  private imageLoadErrorOccurred: boolean = false; // Variable pour suivre si une erreur de chargement d'image s'est produite


  private templateSubscription: Subscription | undefined;
  private isBrowser: Boolean;
  private data: any = [];

  // @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
  }


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private themeService: ThemeService,
    private catService: CatsService,
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private dialog: MatDialog

  ) {

    this.imageUrlParentsCat = environment.imgParentsCat;
    this.imageUrlCatProfil = environment.imgProfilCat;
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.imageUrlCatImg = environment.imgCat;
  }

  ngOnInit(): void {

    this.templateSubscription = this.themeService.template1$.subscribe(data => {
      if (data) {
        this.data = data;
      }
    });
    if (this.isBrowser) {
      if (this.isBrowser) {
        this.screenWidth = window.innerWidth;
        window.addEventListener('resize', this.onResize.bind(this));
      }

      if (localStorage.getItem('selectedCat') !== null) {
        console.log('localStorage?????');

        const selectedCatString = localStorage.getItem('selectedCat');
        if (selectedCatString) {
          this.selectedCat.set(JSON.parse(selectedCatString));
        }
      }
      else {
        console.log('else?????');

        const catId = this.route.snapshot.paramMap.get('id');
        if (catId) {
          this.catService.getCatById(catId).subscribe((data: any) => {
            this.selectedCat.set(data);
            console.log('getId',data);
          }
        
        );
        }
      }


    }
  }


  openPedigree() {
    const cat = this.selectedCat();
    if (cat?.pedigree !== "") {
      if (this.isBrowser) {
        window.open(this.env.imgPedigree + cat?.pedigree, '_blank');
      }
    }
  }




  openImageDialog(imageUrl: string): void {
    this.dialog.open(ImageDialogComponent, {
      data: { imageUrl },
      panelClass: 'custom-dialog-container'
    });
  }

  scrollToBottom() {
    this.elementRef.nativeElement.ownerDocument.documentElement.scrollTop = this.elementRef.nativeElement.ownerDocument.documentElement.scrollHeight;
  }


  getRows(arr: string[] | undefined, chunkSize: number): string[][] {
    if (!arr) return [];
    let i, j, temparray;
    const newArray = [];
    for (i = 0, j = arr.length; i < j; i += chunkSize) {
      temparray = arr.slice(i, i + chunkSize);
      newArray.push(temparray);
    }
    return newArray;
  }


  getDynamicStyles(value: string): any {
    const styles: any = {};
    switch (value) {
      case 'borderColor':
        styles['border'] = "2px solid" + this.data.bordureColorPageFemelles;
        break;
      case 'title':
        styles['font-family'] = this.data.titleFontStylePagechatProfil;
        styles['color'] = this.data.titleColorPagechatProfil;
        break;
      case 'text-title':
        styles['font-family'] = this.data.textFontStylePagechatProfil;
        styles['color'] = this.data.textColorPagechatProfil;
        styles['font-weight'] = "bold";

        break;
      case 'buttons':
        styles['background-color'] = this.data.buttonColorPagechatProfil;
        styles['font-family'] = this.data.buttonTextFontStylePagechatProfil;
        styles['color'] = this.data.buttonTextColorPagechatProfil;
        break;
      case 'border':
        styles['background-color'] = this.data.bordureColorPagechatProfil;
        break;
      case 'fond-photos':
        styles['background-color'] = this.data.bagroundColorPagechatProfil;
        break;
      default:
        break;
    }

    return styles;
  }

  onImageLoad(name: string) {
    // Ajoutez une classe pour déclencher l'animation
    const photoProfilElement = document.querySelector(name);
    if (photoProfilElement) {
      photoProfilElement.classList.add('loaded');
    }
  }

  ngOnDestroy(): void {
    this.templateSubscription?.unsubscribe();
    if (this.isBrowser) {
      localStorage.removeItem('selectedCat');
    }

  }

}
