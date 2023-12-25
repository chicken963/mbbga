import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VolumeService {
  private volumeSubject = new BehaviorSubject<number>(100);

  setVolume(volume: number) {
    this.volumeSubject.next(volume);
  }

  getVolume(): Observable<number> {
    return this.volumeSubject;
  }
}
