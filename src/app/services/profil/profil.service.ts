import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Profil } from '../../models/profil';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ProfilService {

  private profilSubject: BehaviorSubject<Profil | null> = new BehaviorSubject<Profil | null>(null);
  public profil$: Observable<Profil | null> = this.profilSubject.asObservable();


  constructor(private http: HttpClient) { 
  }

  loadProfil(): void {
    const url = `${environment.urlProfil}?profilId=${environment.id}`;
    this.http.get<Profil[]>(url).subscribe(
      (response) => {
        this.profilSubject.next(response[0])
      },
      (error) =>
        {
          console.log('erreur récupération du profil: ', error);
        }

    )
  }


}
