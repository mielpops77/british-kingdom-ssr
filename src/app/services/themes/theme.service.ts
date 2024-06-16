import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Template1 } from '../../models/template1';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Profil } from '../../models/profil';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {


  private template1Subject: BehaviorSubject<Template1 | null> = new BehaviorSubject<Template1 | null>(null);
  public template1$: Observable<Template1 | null> = this.template1Subject.asObservable();

  constructor(private http: HttpClient) {
    console.log('themeService');
  }

  /*   loadTemplate1(): void {
      const url = `${environment.urlTemplate}?profilId=${environment.id}`;
      this.http.get<Template1[]>(url).subscribe(
        (template1) => {
          console.log('request', template1[0]);
          this.template1Subject.next(template1[0]);
        },
        (error) => {
          console.log('Erreur de chargement du template1', error);
        }
      )
    } */
  loadTemplate1(): void {
    const url = `${environment.urlTemplate}?profilId=${environment.id}`;

    // Options de la requête HTTP
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
        // Ajoutez d'autres en-têtes si nécessaire
      }),
      observe: 'response' as const, // Observer la réponse complète
      responseType: 'json' as const // Type de réponse attendue
    };

    // Effectuer la requête HTTP
    this.http.get<Template1[]>(url, options).subscribe(
      (response: HttpResponse<Template1[]>) => {
        console.log('HTTP Response:', response);


        // Extraire les informations nécessaires
        const status = response.status;
        const body = response.body;
        const headers = response.headers;

        // Mettre à jour le sujet avec les données
        if (body) {
          console.log('Template1 body:', body);
          console.log('Template1 headers:', headers);
          console.log('Template1 status:', status);

          this.template1Subject.next(body[0]); // Envoyer le premier élément à votre sujet
        }
      },
      (error: HttpErrorResponse) => {
        console.error('HTTP Error:', error);

        // Traiter l'erreur ici
        console.log('Error Status:', error.status);
        console.log('Error Message:', error.message);
      }
    );
  }



}



