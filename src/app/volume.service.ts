import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VolumeService {
  private volumeSubject = new BehaviorSubject<number>(1); // Initial volume

  setVolume(volume: number) {
    this.volumeSubject.next(volume / 100);
  }

  getVolume(): Observable<number> {
    return this.volumeSubject.asObservable();
  }
}
