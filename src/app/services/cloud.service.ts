import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, map } from "rxjs";
import { AudioTrack } from "../interfaces/audiotrack";

@Injectable({
  providedIn: "root"
})
export class CloudService {

  constructor(private http: HttpClient){};
  files: AudioTrack[];

  getFiles(): Observable<AudioTrack[]> {
    return this.http.get('http://localhost:8080/audiotracks/all').pipe(
      map((response1) => {
        let response = response1 as any[];
        return response.map(item => {
          const data: AudioTrack = {
            id: item.id,
            name: item.name,
            artist: item.artist,
            startTime: item.startTime,
            endTime: item.endTime,
            url: `http://localhost:8080/audiotracks/${item.artist}/${item.name}`,
            length: item.length
          };
          return data;
        });
      }));
  }
}
