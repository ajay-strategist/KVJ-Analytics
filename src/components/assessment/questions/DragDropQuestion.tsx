"use client";

import React, { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  PointerSensor,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { QuestionProps } from "./types";

function DraggableItem({
  id,
  text,
  colors,
  isSelected,
  onSelect,
}: {
  id: string;
  text: string;
  colors: any;
  isSelected?: boolean;
  onSelect?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.35 : 1,
    touchAction: "none" as const,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => {
        onSelect?.();
      }}
      className={`p-3 border rounded-xl cursor-grab active:cursor-grabbing text-xs font-semibold shadow-xs select-none touch-none transition-all flex items-center justify-between gap-2.5 ${
        isSelected
          ? "border-brand bg-brand/10 text-brand ring-2 ring-brand/50 shadow-md font-bold"
          : `${colors.card} ${colors.hover} text-ink hover:border-brand/40`
      }`}
    >
      <span className="truncate">{text}</span>
      {isSelected ? (
        <span className="text-[9px] font-extrabold bg-brand text-white px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wider animate-pulse">
          Selected
        </span>
      ) : (
        <span className="text-[9px] text-slate-400 font-medium shrink-0 opacity-60">
          Tap or drag
        </span>
      )}
    </div>
  );
}

function DroppableSlot({
  id,
  matchedItem,
  label,
  onClear,
  colors,
  onSlotClick,
  isTargetActive,
}: {
  id: string;
  matchedItem?: string;
  label: string;
  onClear: () => void;
  colors: any;
  onSlotClick?: () => void;
  isTargetActive?: boolean;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div className="flex items-center gap-3">
      <div className={`w-1/2 p-3 border rounded-xl text-xs font-semibold select-none ${colors.card}`}>
        {label}
      </div>
      <div className={`${colors.slate} font-bold text-xs select-none`}>⇌</div>
      <div
        ref={setNodeRef}
        onClick={() => onSlotClick?.()}
        className={`w-1/2 p-3 border rounded-xl min-h-[48px] flex items-center justify-between text-xs font-semibold transition-all relative touch-none ${
          isOver
            ? "border-brand bg-brand/15 border-dashed ring-2 ring-brand/50"
            : matchedItem
            ? "border-emerald-500/50 bg-emerald-50 text-emerald-900 shadow-xs"
            : isTargetActive
            ? "border-brand border-dashed bg-brand/10 ring-2 ring-brand/40 cursor-pointer animate-pulse"
            : `${colors.card} border-dashed hover:border-brand/30 cursor-pointer`
        }`}
      >
        {matchedItem ? (
          <>
            <span className="truncate select-none font-semibold text-xs text-emerald-900 pr-1">
              {matchedItem}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="text-error hover:bg-red-100/80 rounded-full font-bold text-xs cursor-pointer p-1 ml-auto shrink-0 transition-colors"
              title="Remove match"
            >
              ✕
            </button>
          </>
        ) : (
          <span
            className={`text-[11px] select-none pointer-events-none ${
              isTargetActive ? "text-brand font-bold" : `${colors.slate} opacity-50 italic`
            }`}
          >
            {isTargetActive ? "Tap to place here" : "Tap or drop match"}
          </span>
        )}
      </div>
    </div>
  );
}

export function DragDropQuestion({
  question,
  answer,
  colors,
  onAnswerChange,
}: QuestionProps) {
  const [selectedDraggable, setSelectedDraggable] = useState<{
    questionId: string;
    value: string;
  } | null>(null);

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

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={(event) => {
        const { over, active } = event;
        if (!over || !active) return;
        const rightStr = String(active.id);
        const slotIdStr = String(over.id);
        if (!slotIdStr.startsWith("slot-")) return;
        const slotIdx = parseInt(slotIdStr.replace("slot-", ""), 10);
        if (isNaN(slotIdx)) return;
        const currentMatches = [...(answer || [])];
        currentMatches[slotIdx] = [currentMatches[slotIdx]?.[0] ?? "", rightStr];
        onAnswerChange(currentMatches);
        setSelectedDraggable(null);
      }}
    >
      <div className="space-y-4">
        {selectedDraggable && selectedDraggable.questionId === question.id && (
          <div className="p-2.5 bg-brand/10 border border-brand/30 rounded-xl text-xs text-brand font-semibold flex items-center justify-between animate-fadeIn">
            <span>
              Selected: <strong>&ldquo;{selectedDraggable.value}&rdquo;</strong> — tap any matching
              target slot to place
            </span>
            <button
              type="button"
              onClick={() => setSelectedDraggable(null)}
              className="ml-2 text-xs font-bold underline cursor-pointer text-slate hover:text-ink"
            >
              Cancel
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: Match Choices (Draggables) */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate">
              Match Choices
            </h4>
            <p className={`text-[10px] italic mb-1 ${colors.slate}`}>
              Tap or drag an option to match.
            </p>
            <div className="flex flex-wrap md:flex-col gap-2">
              {(question.config.right || []).map((r: string, rIdx: number) => {
                const isSelected =
                  selectedDraggable?.questionId === question.id &&
                  selectedDraggable?.value === r;
                return (
                  <DraggableItem
                    key={`opt-${rIdx}`}
                    id={r}
                    text={r}
                    colors={colors}
                    isSelected={isSelected}
                    onSelect={() => {
                      setSelectedDraggable(
                        isSelected ? null : { questionId: question.id, value: r }
                      );
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Column 2: Items to Match (Droppables) */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate">
              Items to Match
            </h4>
            {(question.config.left || []).map((l: string, lIdx: number) => {
              const pair = (answer || [])[lIdx];
              const isTargetActive = Boolean(
                selectedDraggable && selectedDraggable.questionId === question.id
              );
              return (
                <DroppableSlot
                  key={`slot-${lIdx}`}
                  id={`slot-${lIdx}`}
                  label={l}
                  matchedItem={pair ? pair[1] : ""}
                  isTargetActive={isTargetActive}
                  onSlotClick={() => {
                    if (selectedDraggable && selectedDraggable.questionId === question.id) {
                      const currentMatches = [...(answer || [])];
                      currentMatches[lIdx] = [l, selectedDraggable.value];
                      onAnswerChange(currentMatches);
                      setSelectedDraggable(null);
                    }
                  }}
                  onClear={() => {
                    const nextMatches = [...(answer || [])];
                    nextMatches[lIdx] = [l, ""];
                    onAnswerChange(nextMatches);
                  }}
                  colors={colors}
                />
              );
            })}
          </div>
        </div>
      </div>
    </DndContext>
  );
}

