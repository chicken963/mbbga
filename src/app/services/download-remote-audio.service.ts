import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpEventType, HttpRequest} from "@angular/common/http";
import {map, Observable, Subscription} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DownloadRemoteAudioService {

    private subscriptionMap: Map<string, Subscription> = new Map<string, Subscription>();

    constructor(private http: HttpClient) {

    }


    loadAudioFromRemote(audioTrackId: string): Observable<string | number | null> {
        const req = new HttpRequest('GET', `audio-tracks/binary/async?id=${audioTrackId}`, {
            responseType: 'blob',
            reportProgress: true,
        });

        return  this.http.request(req).pipe(
            map((event) => {
                if (event.type === HttpEventType.DownloadProgress && event.total) {
                    return  Math.round((100 * event.loaded) / event.total);
                } else if (event.type === HttpEventType.Response) {
                    let blob = event.body as Blob;
                    return URL.createObjectURL(blob);
                }
                return null;
            })
        )
    }

    cancelDownload(audioTrackId: string) {
        this.subscriptionMap.get(audioTrackId)?.unsubscribe();
        this.subscriptionMap.delete(audioTrackId);
    }
}
