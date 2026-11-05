"use client";

import React from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { QuestionProps } from "./types";

function SortableSeqItem({
  id,
  text,
  colors,
  index,
  total,
  onMoveUp,
  onMoveDown,
}: {
  id: string;
  text: string;
  colors: any;
  index: number;
  total: number;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    touchAction: "none" as const,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 border rounded-xl text-xs font-semibold shadow-xs flex items-center justify-between gap-3 select-none touch-none ${colors.card} ${colors.hover}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center gap-2.5 flex-1 cursor-grab active:cursor-grabbing min-w-0"
      >
        <GripVertical className={`w-4 h-4 shrink-0 ${colors.slate}`} />
        <span className="w-5 h-5 rounded-full bg-slate-200/80 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-bold text-[10px] flex items-center justify-center shrink-0">
          {index + 1}
        </span>
        <span className={`truncate ${colors.ink || "text-slate-900"}`}>{text}</span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          disabled={index <= 0}
          onClick={onMoveUp}
          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
          title="Move Up"
        >
          ▲
        </button>
        <button
          type="button"
          disabled={index >= total - 1}
          onClick={onMoveDown}
          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
          title="Move Down"
        >
          ▼
        </button>
      </div>
    </div>
  );
}

export function SequenceQuestion({
  answer,
  colors,
  onAnswerChange,
}: QuestionProps) {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 5 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 100, tolerance: 5 },
  });
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 5 },
  });
  const sensors = useSensors(mouseSensor, touchSensor, pointerSensor);

  const currentSeq: string[] = Array.isArray(answer) ? answer : [];

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={(event) => {
        const { active, over } = event;
        if (!active || !over || active.id === over.id) return;
        const oldIndex = currentSeq.indexOf(String(active.id));
        const newIndex = currentSeq.indexOf(String(over.id));
        const nextSeq = [...currentSeq];
        nextSeq.splice(oldIndex, 1);
        nextSeq.splice(newIndex, 0, String(active.id));
        onAnswerChange(nextSeq);
      }}
    >
      <div className="max-w-md mx-auto space-y-4">
        <h4
          className={`text-[10px] font-bold uppercase tracking-wider mb-2 text-center ${colors.slate}`}
        >
          Drag items or use ▲ / ▼ buttons to rearrange sequence
        </h4>
        <SortableContext items={currentSeq} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {currentSeq.map((item: string, sIdx: number, arr: string[]) => (
              <SortableSeqItem
                key={item}
                id={item}
                text={item}
                colors={colors}
                index={sIdx}
                total={arr.length}
                onMoveUp={() => {
                  if (sIdx <= 0) return;
                  const nextSeq = [...arr];
                  const [moved] = nextSeq.splice(sIdx, 1);
                  nextSeq.splice(sIdx - 1, 0, moved);
                  onAnswerChange(nextSeq);
                }}
                onMoveDown={() => {
                  if (sIdx >= arr.length - 1) return;
                  const nextSeq = [...arr];
                  const [moved] = nextSeq.splice(sIdx, 1);
                  nextSeq.splice(sIdx + 1, 0, moved);
                  onAnswerChange(nextSeq);
                }}
              />
            ))}
          </div>
        </SortableContext>
      </div>
    </DndContext>
  );
}

