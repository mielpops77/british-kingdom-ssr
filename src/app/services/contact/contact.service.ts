import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Contact } from '../../models/contact';
@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) {
  }


  createContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(environment.urlContact+'/', contact);
  }
}
