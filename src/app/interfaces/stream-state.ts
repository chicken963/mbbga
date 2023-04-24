export interface StreamState {
    playing: boolean;
    readableCurrentTime: string;
    readableDuration: string;
    duration: number | undefined;
    currentTime: number | undefined;
    startTime: number | undefined;
    endTime: number | undefined;
    canplay: boolean;
    volume: number;
    error: boolean;
  }