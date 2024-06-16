import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Chaton } from '../../models/chaton';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatonsService {

  private chatonSubject: BehaviorSubject<Chaton[] | null> = new BehaviorSubject<Chaton[] | null>(null);
  public chaton$: Observable<Chaton[] | null> = this.chatonSubject.asObservable();

  constructor(private http: HttpClient) { 
  }

  loadChaton(): void {
    const url = environment.urlChatons;
    const profilId = environment.id
    const params = { profilId: profilId.toString() }
    this.http.get<Chaton[]>(url, { params }).subscribe(
      (response) => {
      this.chatonSubject.next(response);
      },
      (error) =>{
        console.log('erreur chargement chatons: ', error);
      }
    )
  }
}
