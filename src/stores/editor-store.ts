import create from "zustand";
import { immer } from "zustand/middleware/immer";

export interface EditorStore {
    rows: EditorNoteRows[];
    endTime: number;
    nextBarId: number;

    recalculateEndTime: () => void;
    createNewNoteRow: (note: string) => void;
    setBarIdTimings: (note: string, barId: number, newStartTime: number, newEndTime: number) => void;
}

export interface EditorNoteRows {
    note: string;
    bars: EditorNoteBar[];
}

export interface EditorNoteBar {
    id: number;
    startTime: number;
    endTime: number;
}

export const useEditorStore = create(
    immer<EditorStore>((set, get) => ({
        rows: [],
        endTime: 0,
        nextBarId: 0,

        recalculateEndTime: () => set((state) => {
            state.endTime = Math.max(0, ...state.rows.flatMap(x => x.bars.map(y =>  y.endTime)));
            console.log('end', state.endTime);
        }),
        createNewNoteRow: (note: string) => set((state) => {
            state.rows.push({ note, bars: [{ id: state.nextBarId++, startTime: 0, endTime: 100 }] });
        }),
        setBarIdTimings: (note: string, barId: number, newStartTime: number, newEndTime: number) => {
            set((state) => {
                const bar = state.rows.find(x => x.note === note)?.bars.find(y => y.id === barId);
                if (!bar) return;
                bar.startTime = newStartTime;
                bar.endTime = newEndTime;
            });
            get().recalculateEndTime(); // Cant be inside set()
        },
    }))
);
