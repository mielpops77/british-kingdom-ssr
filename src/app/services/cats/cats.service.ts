import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
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
    console.log('ddddd');
    return this.http.get<Cat>(`${environment.urlCats}/${catId}`, {
      params: { profilId: profilId.toString() }
    });
  }

}
