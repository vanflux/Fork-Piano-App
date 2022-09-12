import React, { useEffect, useRef } from "react";
import { EditorNoteBar } from "../../../../stores/editor-store";
import styles from "./NoteBar.module.css";

export interface NoteBarProps extends EditorNoteBar {
  onChange?: (newStartTime: number, newEndTime: number) => void;
}

function NoteBar({ id, startTime, endTime, onChange }: NoteBarProps) {
  const ref = useRef<HTMLDivElement>(null);

  const updateTiming = (start: number, end: number) => {
    if (!ref.current) return;
    ref.current.style.left = `${start}px`;
    ref.current.style.width = `${end - start}px`;
  };

  const createHandleMouseDown = (type: 'middle' | 'start' | 'end') => (
      (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      const clientXStart = e.clientX;
      let newStartTime = startTime, newEndTime = endTime;
      const handleMouseMove = (e: MouseEvent) => {
        const clientXEnd = e.clientX;
        const offset = clientXEnd - clientXStart;
        newStartTime = Math.max(0, startTime + (type === 'start' || type === 'middle' ? offset : 0));
        newEndTime = Math.max(newStartTime + 10, endTime + (type === 'end' || type === 'middle' ? offset : 0));
        updateTiming(newStartTime, newEndTime);
      };
      const handleMouseUp = (e: MouseEvent) => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        onChange?.(newStartTime, newEndTime);
      };
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
  );

  useEffect(() => {
    updateTiming(startTime, endTime);
  }, [startTime, endTime]);
  
  return (
    <div onMouseDown={createHandleMouseDown('middle')} ref={ref} className={styles.container}>
      <div onMouseDown={createHandleMouseDown('start')} className={styles.resizer}></div>
      <div onMouseDown={createHandleMouseDown('end')} className={`${styles.resizer} ${styles.end}`}></div>
    </div>
  );
}

export default NoteBar;
