import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Subscription} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DownloadRemoteAudioService {

    private subscriptionMap: Map<string, Subscription> = new Map<string, Subscription>();

    constructor(private http: HttpClient) {

    }


    loadAudioFromRemote(audioTrackId: string, htmlAudioElement: HTMLAudioElement, callback: () => void) {
        for (const audioTrackId of this.subscriptionMap.keys()) {
            this.cancelDownload(audioTrackId);
        }
        let downloadSubscription = this.http.get(`audio-tracks/binary?id=${audioTrackId}`, {
            headers: {'Content-Type': 'audio/mpeg'},
            responseType: 'arraybuffer' as 'json'
        })
            .subscribe((response) => {
                let bufferedResponse: ArrayBuffer = response as ArrayBuffer;
                let blob = new Blob([bufferedResponse]);
                htmlAudioElement.src = URL.createObjectURL(blob);
                callback();
                this.subscriptionMap.delete(audioTrackId);
            }, error => {
                console.error('Error fetching media:', error);
            });
        this.subscriptionMap.set(audioTrackId, downloadSubscription);
    }

    cancelDownload(audioTrackId: string) {
        this.subscriptionMap.get(audioTrackId)?.unsubscribe();
        this.subscriptionMap.delete(audioTrackId);
    }
}
