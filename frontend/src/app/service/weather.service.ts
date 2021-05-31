import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private _apiURL = 'https://panda101-backend.herokuapp.com/api/weather' 
  // private _apiURL = 'http://localhost:3000/api/weather' 
  // URL needs to be changed
  public headers = { 'content-type': 'application/json'}

  constructor(
    private http:HttpClient
  ) { }

  getWeather(){
    return this.http.post<any>(this._apiURL, {
      'headers' : this.headers,
      responseType : 'json'
    })
  }
}
