// contact.component.ts
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Component, OnDestroy, OnInit, WritableSignal, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, NgForm } from '@angular/forms';
import { DatePipe, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';


import { SnackBarService } from '../services/snackBar/snack-bar.service';
import { ContactService } from '../services/contact/contact.service';
import { ThemeService } from '../services/themes/theme.service';


import { Contact } from '../models/contact';
import { Template1 } from '../models/template1';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  standalone: true,
  imports: [FormsModule, NgIf, MatButtonModule, DatePipe]
})
export class ContactComponent implements OnInit, OnDestroy {

  private templateSubscription: Subscription | undefined;

  // Initialisez le modèle avec des valeurs par défaut si nécessaire
  private address: string = '12 Bis Rue des Suisses, 77280 Othis';  // Adresse plus détaillée
  private googleMapsUrl: SafeResourceUrl | undefined;

  public contactModel: Contact = {
    id: 0,
    profilId: environment.id,
    name: '',
    email: '',
    num: '',
    subject: '',
    message: '',
    vue: false,
    dateofCrea: '',
    hour: ''
  };

  // Variable pour suivre l'état de validation de l'e-mail
  public isEmailInvalid: WritableSignal<boolean> = signal(false);
  public isNumInvalid: WritableSignal<boolean> = signal(false);
  public data: WritableSignal<Template1 | undefined> = signal(undefined);

  constructor(
    private contactService: ContactService,
    private snackBarService: SnackBarService,
    private themeService: ThemeService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.templateSubscription = this.themeService.template1$.subscribe(data => {
      if (data) {
        this.data.set(data);
      }
    });


    const dynamicUrl = `https://www.google.com/maps/embed?q=${encodeURIComponent(this.address)}`;
    this.googleMapsUrl = this.sanitizer.bypassSecurityTrustResourceUrl(dynamicUrl);

  }





  sendContactForm(form: NgForm): void {
    if (form.valid) {
      if (this.isNumValid(this.contactModel.num)) {
        this.isNumInvalid.set(false);
      }
      else {
        this.isNumInvalid.set(true);

      }
      // Vérifiez si l'e-mail est valide
      if (this.isEmailValid(this.contactModel.email)) {
        this.isEmailInvalid.set(false);
        // Vérifiez si le numéro de téléphone est valide
        if (this.isNumValid(this.contactModel.num)) {

          this.contactModel.dateofCrea = new Date().toISOString();
          const currentDate = new Date();
          const formattedHour = this.datePipe.transform(currentDate, 'HH:mm');
          formattedHour !== null ? this.contactModel.hour = formattedHour : this.contactModel.hour = '00:00';
          this.contactService.createContact(this.contactModel).subscribe(
            (response) => {
              console.log('Contact créé avec succès', response);
              this.snackBarService.showSnackBar("Votre message à bien été envoyé");

              form.resetForm();
              this.isEmailInvalid.set(false);
              this.isNumInvalid.set(false);
            },
            (error) => {
              console.error('Erreur lors de la création du contact', error);
            }
          );
        } else {
          this.isNumInvalid.set(true);
        }
      } else {
        this.isEmailInvalid.set(true);
      }
    }
  }

  isNumValid(num: string): boolean {
    const numRegex = /^\d{10}$/;
    return numRegex.test(num);
  }

  isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }


  ngOnDestroy(): void {
    this.templateSubscription?.unsubscribe();
  }

}
