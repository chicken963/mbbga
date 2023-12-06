import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  evaluateProgress(start: number, current: number, end: number): number {
    let calculatedProgress = (current - start) / (end - start) * 100;
    if (calculatedProgress > 100) return 100;
    if (calculatedProgress < 0) return 0;
    return calculatedProgress;
  }

}
