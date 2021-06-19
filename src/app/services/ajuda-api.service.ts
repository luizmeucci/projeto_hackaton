import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AjudaModel} from './ajuda-model';

@Injectable({
  providedIn: 'root'
})
export class AjudaApiService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'https://it3-klj-default-rtdb.firebaseio.com/instituicoesMulheres.json'

  public get(): Observable<AjudaModel[]>{
    return this.http.get<AjudaModel[]>(this.apiUrl);
  }
}
