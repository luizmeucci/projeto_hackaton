import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {SobreModel} from './sobre-model';

@Injectable({
  providedIn: 'root'
})
export class SobreApiService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'https://it3-klj-default-rtdb.firebaseio.com/leisMulheres.json'

  public get(): Observable<SobreModel[]>{
    return this.http.get<SobreModel[]>(this.apiUrl);
  }
}
