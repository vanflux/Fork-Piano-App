import React, { useEffect, useRef } from "react";
import { useEditorStore } from "../../stores/editor-store";
import NoteRow from "./components/NoteRow/NoteRow";
import styles from "./Editor.module.css";

function Editor() {
  const initialized = useRef(false);
  const { rows, endTime, createNewNoteRow, setBarIdTimings } = useEditorStore();

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(x => `N${x}`).forEach(createNewNoteRow);
    }
  }, []);

  const handleOnChange = (note: string, barId: number, newStartTime: number, newEndTime: number) => {
    setBarIdTimings(note, barId, newStartTime, newEndTime);
  };

  return (
    <div className={styles.container}>
      <div style={{ minWidth: endTime }} className={styles.noteRowList}>
        { rows.map(row => <NoteRow onChange={(...args) => handleOnChange?.(row.note, ...args)} key={`note-row-${row.note}`} {...row} />) }
      </div>
    </div>
  );
}

export default Editor;
