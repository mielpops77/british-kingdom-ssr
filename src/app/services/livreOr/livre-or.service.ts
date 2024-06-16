
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LivreOr } from '../../models/livreOr';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LivreOrService {

  constructor(private http: HttpClient) {
  }


  getAvis() {
    const params = new HttpParams().set('ProfilId', environment.id);

    // Utilisez les options pour inclure les paramètres dans la requête
    const options = { params };

    return this.http.get(`${environment.urlLivreOr}` + '/', options);
  }

  createAvis(avis: LivreOr): Observable<LivreOr> {
    return this.http.post<LivreOr>(environment.urlLivreOr + '/', avis);
  }
}
