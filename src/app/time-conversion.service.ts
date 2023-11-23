import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TimeConversionService {

    stringToSeconds(timeString: string): number {
        const [minutes, seconds, decis] = [timeString.substring(0, 2),
               timeString.substring(3, 5),
               timeString.substring(6, 7)]
            .map(str => parseInt(str));
        return minutes * 60 + seconds + decis * 0.1;
    }

    secondsToString(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        const decimals = Math.floor(parseFloat((seconds % 1).toFixed(1)) * 10);
        console.log(`${this.padNumber(minutes)}:${this.padNumber(remainingSeconds)}.${decimals}`)
        return `${this.padNumber(minutes)}:${this.padNumber(remainingSeconds)}.${decimals}`;
    }

    private padNumber(num: number): string {
        return num.toString().padStart(2, '0');
    }
}
