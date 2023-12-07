import {Injectable, OnDestroy} from "@angular/core";
import {BehaviorSubject, distinctUntilChanged, interval, Observable, Subject, Subscription, takeUntil} from "rxjs";
import {VolumeService} from "../volume.service";
import {LocalAudioTrack} from "../local-audio/local-audio-track";
import {ProgressService} from "../range-slider/progress.service";

@Injectable({
    providedIn: "root"
})
export class LibraryPlayerService implements OnDestroy {

    currentTrack: LocalAudioTrack;

    ngDestroy$: Subject<boolean> = new Subject<boolean>();

    private startTimeSubject: Subject<number> = new Subject<number>();
    private endTimeSubject: Subject<number> = new Subject<number>();
    private isPlayingSubject = new BehaviorSubject<boolean>(false);
    private progressSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private progressPercentageSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    private progressSubscription: Subscription;
    private startTimeSubscription: Subscription;

    private currentTrackSubject = new Subject<LocalAudioTrack>();


    constructor(private volumeService: VolumeService, private progressService: ProgressService) {
        this.getCurrentTrack().pipe(takeUntil(this.ngDestroy$)).subscribe(audioTrack => {
            this.currentTrack = audioTrack;
            this.volumeService.getVolume().pipe(takeUntil(this.ngDestroy$)).subscribe((volume) => {
                this.currentTrack.audioEl.volume = volume / 100;
            });
            this.currentTrack.audioEl.currentTime = this.currentTrack.startTime;
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
            let progress = this.progressService.evaluateProgress(this.currentTrack);
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
        this.currentTrack.progressInSeconds = currentTime - this.currentTrack.startTime;
        this.setProgressInSeconds(currentTime - this.currentTrack.startTime);
        this.setProgressPercentage(this.progressService.evaluateProgress(this.currentTrack));
        if (currentTime >= this.currentTrack.endTime - period / 1000) {
            this.pause();
            this.setProgressInSeconds(this.currentTrack.endTime - this.currentTrack.startTime);
            this.setProgressPercentage(100);
        }
    }


    stop() {

        this.currentTrack.audioEl.pause();
        this.setIsPlaying(false);
        this.setProgressInSeconds(0);
        this.setProgressPercentage(0);
        this.currentTrack.audioEl.currentTime = this.currentTrack.startTime;

    }

    play(audioTrack: LocalAudioTrack) {
        if (this.currentTrack !== audioTrack) {
            this.currentTrack?.audioEl?.pause();
            this.setIsPlaying(false);
        }
        if (this.resumingCurrentTrack(audioTrack)) {
            this.resetIfPlayedToTheEnd();
            this.currentTrack?.audioEl.play();
            this.setIsPlaying(true);
            return;
        }
        this.setCurrentTrack(audioTrack);
        this.setIsPlaying(true);
        audioTrack.audioEl.play();
    }

    private resetIfPlayedToTheEnd() {
        if (this.currentTrack.audioEl.currentTime >= this.currentTrack.endTime - 0.1) {
            this.currentTrack.audioEl.currentTime = this.currentTrack.startTime;
        }
    }

    private resumingCurrentTrack(audioTrack: LocalAudioTrack) {
        return this.currentTrack === audioTrack && !this.isPlayingSubject.value;
    }

    pause() {
        this.currentTrack.audioEl.pause();
        this.setIsPlaying(false);
    }



    getCurrentTrack(): Observable<LocalAudioTrack> {
        return this.currentTrackSubject.asObservable().pipe(distinctUntilChanged());
    }

    setCurrentTrack(audioTrack: LocalAudioTrack): void {
        this.currentTrackSubject.next(audioTrack);
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
        this.startTimeSubject.next(startTime);
    }

    getStartTime(): Observable<number> {
        return this.startTimeSubject.asObservable();
    }

    setEndTime(endTime: number): void {
        this.endTimeSubject.next(endTime);
    }

    getEndTime(): Observable<number> {
        return this.endTimeSubject.asObservable();
    }
}