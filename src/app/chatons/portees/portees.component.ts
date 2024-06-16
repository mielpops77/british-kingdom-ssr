import { Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild, WritableSignal, signal } from '@angular/core';
import { ImageDialogComponent } from '../../image-dialog/image-dialog.component';
import { NgFor, NgIf, NgStyle, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { PorteesService } from '../../services/Portees/portees.service';
import { ThemeService } from '../../services/themes/theme.service';
import { CatsService } from '../../services/cats/cats.service';

interface DynamicStyles {
  title: {
    'font-family': string;
    'color': string;
  };
  borderColor: {
    'border': string;
  };
  text: {
    'font-family': string;
    'color': string;
  };
  statusName: {
    'font-family': string;
    'color': string;
  };
  background: {
    'font-family': string;
    'color': string;
    'background-color': string;
  };
  fondPhotos: {
    'background-color': string;
  };
}


@Component({
  selector: 'app-portees',
  standalone: true,
  imports: [NgIf, NgStyle, NgFor, RouterModule],
  templateUrl: './portees.component.html',
  styleUrl: './portees.component.scss'
})
export class PorteesComponent implements OnInit, OnDestroy {


  @ViewChild('carouselImages') carouselImages!: ElementRef;
  private templateSubscription: Subscription | undefined;

  private allImages: any[] = [];
  private data: any = [];
  private isBrowser: boolean;

  public selectedPortee: WritableSignal<any | null> = signal(null);
  public displayedImages: WritableSignal<any[]> = signal([]);
  public dynamicStyles: WritableSignal<DynamicStyles> = signal<DynamicStyles>({
    title: {
      'font-family': 'Arial',
      'color': '#000000'
    },
    borderColor: {
      'border': '1px solid #000000'
    },
    text: {
      'font-family': 'Arial',
      'color': '#000000'
    },
    statusName: {
      'font-family': 'Arial',
      'color': '#000000'
    },
    background: {
      'font-family': 'Arial',
      'color': '#000000',
      'background-color': '#FFFFFF'
    },
    fondPhotos: {
      'background-color': '#FFFFFF'
    }
  });
  public dateOfSell = '';
  public env = environment;
  public test: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private dialog: MatDialog,
    private router: Router,
    private porteesService: PorteesService,
    private catsService: CatsService
  ) {

    this.isBrowser = isPlatformBrowser(this.platformId);

  }


  @HostListener('window:resize', ['$event'])

  onResize(event: Event): void {
    this.processImages();
  }


  ngOnInit(): void {

    this.templateSubscription = this.themeService.template1$.subscribe(data => {
      if (data) {
        this.data = data;
        this.getDynamicStyles();

      }
    });
    this.initializeSelectedPortee();
  }


  private initializeSelectedPortee(): void {

    if (this.isBrowser && localStorage.getItem('selectedPortee') !== null) {


      const selectedPorteeString = localStorage.getItem('selectedPortee');
      if (selectedPorteeString) {
        this.selectedPortee.set(JSON.parse(selectedPorteeString));
        console.log('ici?', this.selectedPortee());
        this.processChatons();

      }

    }
    else {
      const porteId = this.route.snapshot.paramMap.get('id');
      if (porteId) {
        this.porteesService.getPorteeById(porteId).subscribe((data: any) => {

          const selectedPortee = { ...data };
          selectedPortee.urlFemale = this.env.imgProfilCat + selectedPortee.urlProfilMother;
          selectedPortee.urlMale = this.env.imgProfilCat + selectedPortee.urlProfilFather;
          selectedPortee.portee = {};
          selectedPortee.portee.chatons = selectedPortee.chatons;

          selectedPortee.dateOfBirth = this.formaterDate(selectedPortee.dateOfBirth);
          this.selectedPortee.set(selectedPortee);


          this.catsService.getCatById(selectedPortee.idMaman).subscribe(
            (data) => { selectedPortee.nameFemale = data.name }

          );

          this.catsService.getCatById(selectedPortee.idPapa).subscribe(
            (data) => { selectedPortee.nameMale = data.name }

          );
          this.selectedPortee.set(selectedPortee);

          this.processChatons();
        });
      }
    }


  }
  private processChatons(): void {
    console.log('Hum', this.selectedPortee()?.portee.chatons);
    const chatons = this.selectedPortee()?.portee.chatons;

    if (chatons) {
      for (let i = 0; i < chatons.length; i++) {
        chatons[i].sex = chatons[i].sex.charAt(0).toUpperCase() + chatons[i].sex.slice(1);
        chatons[i].name = chatons[i].name.charAt(0).toUpperCase() + chatons[i].name.slice(1);


        switch (chatons[i].status) {
          case 'disponible':
            chatons[i].status = 'Disponible';
            break;
          case 'rester':
            chatons[i].status = 'Reste à la chatterie';
            break;
          case 'reserve':
            chatons[i].status = 'Réservé';
            break;
        }

        if (this.isBrowser) {


          const screenWidth = window.innerWidth;

          if (chatons[i].status == 'Reste à la chatterie' && screenWidth <= 550) {
            chatons[i].status = 'Reste'
          }
        }


        this.allImages[i] = [];

        for (let j = 0; j < chatons[i].photos.length; j++) {
          this.allImages[i].push(this.env.imgChaton + chatons[i].photos[j]);
        }

        const remainingElements = 3 - (this.allImages[i].length % 3);
        for (let k = 0; k < remainingElements; k++) {
          this.allImages[i].push(this.env.imgChaton + 'chaton.png');
        }
      }

    }

    this.processDateOfSell();
  }

  private processDateOfSell(): void {
    const dateOfSell = this.selectedPortee()?.dateOfSell;
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };

    if (dateOfSell) {
      const dateOfSellAsDate = new Date(dateOfSell);

      if (!isNaN(dateOfSellAsDate.getTime())) {
        this.dateOfSell = dateOfSellAsDate.toLocaleDateString('fr-FR', options);
      } else {
        console.error('La chaîne de date n\'est pas dans un format valide.');
      }
    } else {
    }
    this.processImages();

  }

  private processImages(): void {
    if (this.isBrowser) {
      const screenWidth = window.innerWidth;
      const updatedImages = this.allImages.map((images) => {
        if (screenWidth <= 760) {
          return images.slice(0, 1); // Afficher 1 image pour une largeur <= 760
        } else if (screenWidth <= 1100) {
          return images.slice(0, 2); // Afficher 2 images pour une largeur <= 1100
        } else {
          return images.slice(0, 3); // Afficher 3 images pour une largeur > 1100
        }
      });
      this.displayedImages.set(updatedImages);
    }
  }



  redirectToNewUrl(id: number, type: string): void {
    this.router.navigateByUrl('/' + type + '/' + id);
  }

  formaterDate(inputDate: string): string {
    const dateObj = new Date(inputDate);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    const locale = 'fr-FR';
    const formattedDate = dateObj.toLocaleDateString(locale, options);
    return formattedDate;
  }



  private getMaxImagesToShow(): number {


    if (this.isBrowser) {

      const screenWidth = window.innerWidth;

      if (screenWidth <= 1100 && screenWidth > 760) {
        return 2;
      }
      if (screenWidth <= 760) {
        return 1;
      }
    }
    return 3;

  }
  startIndex = 0;
  totalImages = 0
  reachedEnd = false;

  nextImages(index: number): void {
    const maxImagesToShow = this.getMaxImagesToShow();
    const nextIndex = this.startIndex + maxImagesToShow;
    const imagesAfterNext = this.allImages[index].slice(nextIndex);
    const allImagesAfterNextChaton = imagesAfterNext.every((image: any) => this.isChatonImage(image));
    if (imagesAfterNext.length === 0 || allImagesAfterNextChaton) {
      this.startIndex = 0;
      this.reachedEnd = true;
    } else {
      this.startIndex = nextIndex;
      this.reachedEnd = false;
    }

    if (!this.reachedEnd) {

      const currentDisplayedImages = this.displayedImages();
      const updatedImages = [...currentDisplayedImages];
      updatedImages[index] = this.allImages[index].slice(this.startIndex, this.startIndex + maxImagesToShow);
      this.displayedImages.set(updatedImages);

      this.updateTransform();
    }
  }


  prevImages(index: number): void {
    const maxImagesToShow = this.getMaxImagesToShow();
    const prevIndex = this.startIndex - maxImagesToShow;

    // Vérifier si toutes les images précédentes sont égales à "chaton.png"
    const allChatonImages = this.allImages[index].slice(prevIndex, this.startIndex).every((image: any) => this.isChatonImage(image));

    if (prevIndex >= 0 && !allChatonImages) {
      this.startIndex = prevIndex;
    }

    const currentDisplayedImages = this.displayedImages();
    const updatedImages = [...currentDisplayedImages];
    updatedImages[index] = this.allImages[index].slice(this.startIndex, this.startIndex + maxImagesToShow);
    this.displayedImages.set(updatedImages);
    this.updateTransform();
  }


  private updateTransform(): void {
    if (this.carouselImages) {
      // Ajuster la transformation pour permettre le défilement continu
      const translatePercentage = -((this.startIndex % this.totalImages) / this.totalImages) * 100;
      this.carouselImages.nativeElement.style.transform = `translateX(${translatePercentage}%)`;
    }
  }


  openImageDialog(imageUrl: string): void {
    this.dialog.open(ImageDialogComponent, {
      data: { imageUrl },
      panelClass: 'custom-dialog-container'
    });
  }
  isChatonImage(imageUrl: string): boolean {
    return imageUrl.includes(this.env.imgChaton + "chaton.png");
  }




  getDynamicStyles(): void {
    if (this.data) {
      this.dynamicStyles.set({
        title: {
          'font-family': this.data.titleFontStylePagechatonProfil,
          'color': this.data.titleColorPagechatonProfil,
        },
        borderColor: {
          'border': this.data.bordureColorPageFemelles,
        },
        text: {
          'font-family': this.data.textFontStylePagechatonProfil,
          'color': this.data.textColorPagechatonProfil,
        },
        statusName: {
          'font-family': this.data.statusNameFontStylePagechatonProfil,
          'color': this.data.statusNameColorPagechatonProfil,
        },
        background: {
          'font-family': this.data.breedFontStylePagechatonProfil,
          'color': this.data.breedColorPagechatonProfil,
          'background-color': this.data.backgroundColorBreedPagechatonProfil,

        },
        fondPhotos: {
          'background-color': this.data.bagroundColorPagechatProfil,
        }
      });
    }
  }



  ngOnDestroy(): void {
    this.templateSubscription?.unsubscribe();
  }
}
