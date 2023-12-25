import {Injectable, OnDestroy} from "@angular/core";
import {BehaviorSubject, distinctUntilChanged, interval, Observable, Subject, Subscription, takeUntil} from "rxjs";
import {VolumeService} from "../services/volume.service";
import {ProgressService} from "../range-slider/progress.service";
import {AudioTrackVersion} from "../interfaces/audio-track-version";
import {AudioTrack} from "../interfaces/audio-track";

@Injectable({
    providedIn: "root"
})
export class LibraryPlayerService implements OnDestroy {

    currentTrack: AudioTrack;
    activeVersion: AudioTrackVersion;

    ngDestroy$: Subject<boolean> = new Subject<boolean>();

    private startTimeSubject: Subject<number> = new Subject<number>();
    private endTimeSubject: Subject<number> = new Subject<number>();
    private isPlayingSubject = new BehaviorSubject<boolean>(false);
    private progressSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private progressPercentageSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    private progressSubscription: Subscription;
    private startTimeSubscription: Subscription;

    private currentTrackSubject = new Subject<AudioTrack>();
    private currentVersionSubject = new Subject<AudioTrackVersion>();


    constructor(private volumeService: VolumeService, private progressService: ProgressService) {
        this.getCurrentTrack().pipe(takeUntil(this.ngDestroy$)).subscribe(audioTrack => {
            this.currentTrack = audioTrack;
            this.volumeService.getVolume().pipe(takeUntil(this.ngDestroy$)).subscribe((volume) => {
                this.currentTrack.audioEl.volume = volume / 100;
            });
            this.currentTrack.audioEl.currentTime = this.activeVersion.startTime + this.activeVersion.progressInSeconds;
        });



        this.isPlaying().pipe(takeUntil(this.ngDestroy$)).subscribe(value => {
            if (value) {
                this.startUpdateProgress();
            } else {
                this.stopUpdateProgress();
            }
        })

        this.getStartTime().pipe(takeUntil(this.ngDestroy$)).subscribe(value => {
            if (this.isPlayingSubject.value) {
                this.pause();
            }
            this.currentTrack.audioEl.currentTime = value;
            this.setProgressPercentage(0);
            this.setProgressInSeconds(0);

        })

        this.getEndTime().pipe(takeUntil(this.ngDestroy$)).subscribe(value => {
            let progress = this.progressService.evaluateProgress(this.currentTrack, this.activeVersion);
            if (progress >= 100) {
                this.setProgressPercentage(100);
                this.pause();
                return;
            }
            this.setProgressPercentage(progress);
        })
    }

    private startUpdateProgress(): void {
        this.stopUpdateProgress();
        let updatePeriod = 100;
        this.progressSubscription = interval(updatePeriod).subscribe(() => {
            this.updateProgress(updatePeriod);
        });
    }

    private stopUpdateProgress(): void {
        if (this.progressSubscription) {
            this.progressSubscription?.unsubscribe();
        }
    }

    ngOnDestroy(): void {
        this.stopUpdateProgress();
        this.progressSubscription?.unsubscribe();
        this.startTimeSubscription?.unsubscribe();
        this.ngDestroy$.next(true);
    }

    updateProgress(period: number): void {
        const currentTime = this.currentTrack.audioEl.currentTime;
        this.activeVersion.progressInSeconds = currentTime - this.activeVersion.startTime;
        this.setProgressInSeconds(currentTime - this.activeVersion.startTime);
        this.setProgressPercentage(this.progressService.evaluateProgress(this.currentTrack, this.activeVersion));
        if (currentTime >= this.activeVersion.endTime - period / 1000) {
            this.pause();
            this.setProgressInSeconds(this.activeVersion.endTime - this.activeVersion.startTime);
            this.setProgressPercentage(100);
        }
    }


    stop() {
        this.currentTrack.audioEl.pause();
        this.setIsPlaying(false);
        this.setProgressInSeconds(0);
        this.setProgressPercentage(0);
        this.currentTrack.audioEl.currentTime = this.activeVersion.startTime;
    }

    play(audioTrack: AudioTrack, audioTrackVersion: AudioTrackVersion) {
        if (this.activeVersion !== audioTrackVersion) {
            this.currentTrack?.audioEl?.pause();
            if (this.activeVersion) {
                this.activeVersion.active = false;
            }
            this.setIsPlaying(false);
        }
        if (this.resumingCurrentVersion(audioTrackVersion)) {
            this.resetIfPlayedToTheEnd();
            this.currentTrack?.audioEl.play().then(
                () => this.setIsPlaying(true)
            );
            return;
        }
        this.setCurrentTrack(audioTrack, audioTrackVersion);
        audioTrack.audioEl.play().then(
            () => this.setIsPlaying(true)
        );
    }

    private resetIfPlayedToTheEnd() {
        if (this.currentTrack.audioEl.currentTime >= this.activeVersion.endTime - 0.1) {
            this.currentTrack.audioEl.currentTime = this.activeVersion.startTime;
        }
    }

    private resumingCurrentVersion(audioTrackVersion: AudioTrackVersion) {
        return this.activeVersion === audioTrackVersion && !this.isPlayingSubject.value;
    }

    pause() {
        this.currentTrack.audioEl.pause();
        this.setIsPlaying(false);
    }



    getCurrentTrack(): Observable<AudioTrack> {
        return this.currentTrackSubject.asObservable().pipe(distinctUntilChanged());
    }

    setCurrentTrack(audioTrack: AudioTrack, audioTrackVersion: AudioTrackVersion): void {
        this.setCurrentVersion(audioTrackVersion);
        this.activeVersion = audioTrackVersion;
        audioTrackVersion.active = true;
        this.currentTrackSubject.next(audioTrack);
    }


    getCurrentVersion(): Observable<AudioTrackVersion> {
        return this.currentVersionSubject.asObservable().pipe(distinctUntilChanged());
    }

    setCurrentVersion(audioTrackVersion: AudioTrackVersion): void {
        this.currentVersionSubject.next(audioTrackVersion);
    }

    getProgressPercentage(): Observable<number> {
        return this.progressPercentageSubject.asObservable().pipe(distinctUntilChanged());
    }

    setProgressPercentage(percent: number) {
        this.progressPercentageSubject.next(percent);
    }

    isPlaying(): Observable<boolean> {
        return this.isPlayingSubject.asObservable();
    }

    setIsPlaying(value: boolean) {
        this.isPlayingSubject.next(value);
    }

    setProgressInSeconds(value: number) {
        this.progressSubject.next(value);
    }
    
    getProgressInSeconds(): Observable<number> {
        return this.progressSubject.asObservable().pipe(distinctUntilChanged());
    }

    setStartTime(startTime: number): void {
        let validatedValue: number = startTime;
        if (startTime > this.currentTrack.length) {
            validatedValue = this.currentTrack.length;
        } else if (startTime >= this.activeVersion.endTime) {
            validatedValue = this.activeVersion.endTime - 0.1;
        } else if (startTime < 0) {
            validatedValue = 0;
        }
        this.startTimeSubject.next(validatedValue);
    }

    getStartTime(): Observable<number> {
        return this.startTimeSubject.asObservable();
    }

    setEndTime(endTime: number): void {
        let validatedValue: number = endTime;
        if (endTime > this.currentTrack.length) {
            validatedValue = this.currentTrack.length;
        } else if (endTime <= this.activeVersion.startTime) {
            validatedValue = this.activeVersion.startTime + 0.1;
        } else if (endTime <= 0) {
            validatedValue = 0.1;
        }
        this.endTimeSubject.next(validatedValue);
    }

    getEndTime(): Observable<number> {
        return this.endTimeSubject.asObservable();
    }
}