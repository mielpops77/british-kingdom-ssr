import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Portee } from '../../models/portee';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PorteesService {

  private porteeSubject: BehaviorSubject<Portee[] | null> = new BehaviorSubject<Portee[] | null>(null);
  public $portee: Observable<Portee[] | null> = this.porteeSubject.asObservable();


  constructor(private http: HttpClient) {
  }

  loadPortee(): void {

    const url = environment.urlPortees;
    const params = { profilId: environment.id.toString() };
    this.http.get<Portee[]>(url, { params }).subscribe
      (
        (response) => {
          this.porteeSubject.next(response);

        },
        (error) => {
          console.log('erreur, chargement portees', error);
        }
      )
  }

  getPorteeById(porteId: string) {
    const profilId = environment.id;
    return this.http.get(`${environment.urlPortees}/${porteId}`, {
      params: { profilId: profilId.toString() }
    });
  }
}
