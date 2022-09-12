import React from "react";
import { EditorNoteRows } from "../../../../stores/editor-store";
import NoteBar from "../NoteBar/NoteBar";
import styles from "./NoteRow.module.css";

export interface NoteRowProps extends EditorNoteRows {
  onChange?: (id: number, newStartTime: number, newEndTime: number) => void;
}

function NoteRow({ note, bars, onChange }: NoteRowProps) {
  return (
    <div className={styles.container}>
      { bars.map(bar => <NoteBar onChange={(...args) => onChange?.(bar.id, ...args)} key={`note-bar-${bar.id}`} {...bar} />) }
    </div>
  );
}

export default NoteRow;
