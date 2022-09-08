import create from "zustand";

const MILLISECONDS_ERROR_MARGIN = 7;
const SIMULTANEOUS_NOTES_MAX_TIME_DIFFERENCE = 10;

export interface GlobalStore {
  globalInstrument: string;
  globalSongName: string;
  globalSongNotes: string;
  globalSampleName: string;

  isSustainOn: boolean;

  isPaused: boolean;
  lastPlayedLine: number;
  lastSongSpeed: number;

  isRecording: boolean;
  recordedNotes: string[];
  lastRecordedNoteTime: number;
  
  setGlobalInstrument: (globalInstrument: string) => void;
  setGlobalSongName: (globalSongName: string) => void;
  setGlobalSongNotes: (globalSongNotes: string) => void;
  setGlobalSampleName: (globalSampleName: string) => void;
  toggleSustainGlobal: () => void;
  setSongPausedGlobal: (isPaused: boolean) => void;
  setLastPlayedLineGlobal: (lastPlayedLine: number) => void;
  setLastSongSpeedGlobal: (speed: number) => void;
  setRecordingSongGlobal: (isRecording: boolean) => void;
  addRecordedNoteGlobal: (note: string, duration?: number) => void;
  clearRecordedNotesGlobal: () => void;
}

// TODO: Split this store into domain specific stores if possible!
export const useGlobalStore = create<GlobalStore>((set, get) => ({
  globalInstrument: "acoustic_grand_piano",
  globalSongName: "",
  globalSongNotes: "",
  globalSampleName: "",

  isSustainOn: false,

  isPaused: false,
  lastPlayedLine: 0,
  lastSongSpeed: 250,

  isRecording: false,
  recordedNotes: [] as string[],
  lastRecordedNoteTime: 0,

  setGlobalInstrument: (globalInstrument: string) => set({ globalInstrument }),
  setGlobalSongName: (globalSongName: string) => set({ globalSongName }),
  setGlobalSongNotes: (globalSongNotes: string) => set({ globalSongNotes }),
  setGlobalSampleName: (globalSampleName: string) => set({ globalSampleName }),
  toggleSustainGlobal: () => set({ isSustainOn: !get().isSustainOn }),
  setSongPausedGlobal: (isPaused: boolean) => set({ isPaused }),
  setLastPlayedLineGlobal: (lastPlayedLine: number) => set({ lastPlayedLine }),
  setLastSongSpeedGlobal: (speed: number) => set({ lastSongSpeed: speed }),
  setRecordingSongGlobal: (isRecording: boolean) => set({ isRecording }),
  addRecordedNoteGlobal: (note: string, duration?: number) => {
    const { lastRecordedNoteTime, isSustainOn, recordedNotes } = get();
    const currentTime = Date.now();
    const timeDifference =
      currentTime - lastRecordedNoteTime - MILLISECONDS_ERROR_MARGIN;
    if (!duration) {
      duration = isSustainOn ? 100 : 1;
    }
    if (timeDifference > SIMULTANEOUS_NOTES_MAX_TIME_DIFFERENCE) {
      if (recordedNotes.length === 0) {
        recordedNotes.push("START", "(>> -1)", `(${note} ${duration})`);
      } else {
        recordedNotes.push(
          `(@ ${Math.round(timeDifference)}) (${note} ${duration})`
        );
      }
    } else {
      recordedNotes[recordedNotes.length - 1] += ` (${note} ${duration})`;
    }
    set({ lastRecordedNoteTime: currentTime });
  },
  clearRecordedNotesGlobal: () => set({ recordedNotes: [] }),
}));
