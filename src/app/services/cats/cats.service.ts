import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cat } from '../../models/cat';


@Injectable({
  providedIn: 'root'
})
export class CatsService {

  constructor(private http: HttpClient) {
  }

  public catSubscription: BehaviorSubject<Cat[] | null> = new BehaviorSubject<Cat[] | null>(null);
  public cats$: Observable<Cat[] | null> = this.catSubscription.asObservable();


  loadCats(): void {
    const url = environment.urlCats;
    const profilId = environment.id;
    const params = { profilId: profilId.toString() }
    this.http.get<Cat[]>(url, { params }).subscribe(
      (response) => {
        this.catSubscription.next(response);
      },
      (error) => {
        console.log('erreur récupérations des chats', error);
      }
    )
  }
  getCatById(catId: string): Observable<Cat> {
    const profilId = environment.id;

    // Avant de faire la requête HTTP, affichez le profilId et l'URL de la requête
    console.log('Profil ID:', profilId);
    console.log('maaaaaaaaaaaaaaaj');
    const url = `${environment.urlCats}/${catId}`;
    console.log('URL de la requête:', url);

    // Effectuer la requête HTTP
    return this.http.get<Cat>('https://british-kingdom-back.azurewebsites.net/api/cats/89', {
      params: { profilId: profilId.toString() }
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      console.error('Une erreur s\'est produite:', error.error.message);
    } else {
      // Erreur côté serveur
      console.error(
        `Code d'erreur ${error.status}, ` +
        `Détails : ${error.error}`);
    }
    // Retourne une observable avec une erreur utilisateur-lisible
    return throwError(
      'Une erreur est survenue; veuillez réessayer plus tard.');
  }

}
