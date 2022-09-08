import React from "react";
import { PianoInterpreter } from "../../utils/fileInterpreter";
import { useGlobalStore } from "../../utils/globals";
import styles from "./Controls.module.css";

function Controls() {
  const { isPaused, isRecording, globalSongNotes, lastPlayedLine, lastSongSpeed, recordedNotes, setSongPausedGlobal, setRecordingSongGlobal, clearRecordedNotesGlobal, addRecordedNoteGlobal, setLastPlayedLineGlobal, setLastSongSpeedGlobal } = useGlobalStore();

  const continueSong = async () => {
    if (globalSongNotes.length > 0 && lastPlayedLine < globalSongNotes.length) {
      // TODO: create and use player from store
      const interpreter = new PianoInterpreter(globalSongNotes, lastSongSpeed);
      interpreter.onAddRecordedNote = addRecordedNoteGlobal;
      interpreter.onLastPlayedLineChange = setLastPlayedLineGlobal;
      interpreter.onLastSongSpeedChange = setLastPlayedLineGlobal;
      await interpreter.play(lastPlayedLine, true);
    }
  }
  
  function writeNotesToFile() {
    const fileName = `recording-${new Date().toLocaleDateString()}.piano`;
    if (recordedNotes.length > 0) {
      const file = new File([recordedNotes.join("\n")], fileName, { type: "text/plain" });
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      clearRecordedNotesGlobal();
    }
  }
  
  let paused = false;
  return (
    <div className={styles.box}>
      <span className={styles.text}>Controls</span>
      <div className={styles.actions}>
        <div
          className={`${styles.playPause} ${isPaused ? styles.paused : styles.playing}`}
          onClick={async () => {
            setSongPausedGlobal(!paused);
            if (!isPaused) {
              await continueSong();
            }
          }}
        ></div>
        <div
          className={`${styles.record} ${isRecording && styles.recording}`}
          onClick={() => {
            setRecordingSongGlobal(!isRecording);
            if (!isRecording) {
              writeNotesToFile();
            }
          }}
        ></div>
      </div>
    </div>
  );
}

export default Controls;
