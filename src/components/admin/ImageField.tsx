"use client";

import React, { useRef, useState, useEffect } from "react";
import { X, Image as ImageIcon, Loader2, Upload } from "lucide-react";
import { toDirectImageUrl, isShareLink } from "@/lib/mediaUrl";

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ImageField({
  label,
  value,
  onChange,
  placeholder = "Paste an image link (OneDrive / Google Drive OK) or upload...",
  disabled = false,
}: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");
  const [converted, setConverted] = useState(false);
  const [broken, setBroken] = useState(false);

  // Synchronise state when the initial value changes or when a link is pasted
  useEffect(() => {
    if (value) {
      setConverted(toDirectImageUrl(value) !== value && isShareLink(value));
    } else {
      setConverted(false);
      setBroken(false);
    }
  }, [value]);

  const handleLinkChange = (raw: string) => {
    setBroken(false);
    setUploadErr("");
    const direct = toDirectImageUrl(raw);
    setConverted(direct !== raw && isShareLink(raw));
    onChange(direct);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadErr("");
    setConverted(false);
    setBroken(false);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (err: unknown) {
      setUploadErr(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const clearImage = () => {
    onChange("");
    setConverted(false);
    setBroken(false);
    setUploadErr("");
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
        {label}
      </label>
      <div className="space-y-3">
        {value && (
          <div className="relative inline-block group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              onError={() => setBroken(true)}
              onLoad={() => setBroken(false)}
              className={`h-28 rounded-lg border object-cover max-w-xs transition-all ${
                broken ? "border-red-300 opacity-50" : "border-line"
              }`}
            />
            {!disabled && (
              <button
                type="button"
                onClick={clearImage}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-650 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md transition-colors"
                aria-label="Remove image"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={value}
            disabled={disabled || uploading}
            onChange={(e) => handleLinkChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand text-sm transition-all"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || uploading}
            className="px-3 py-2.5 rounded-btn border border-brand text-brand text-xs font-bold flex items-center gap-1.5 hover:bg-brand/5 transition-colors disabled:opacity-50 shrink-0"
          >
            {uploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            <span>{uploading ? "Uploading…" : "Upload"}</span>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {converted && !broken && (
          <p className="text-xs text-brand font-semibold">
            ✓ Share link detected — converted to a direct image link automatically.
          </p>
        )}
        {broken && value && (
          <p className="text-xs text-red-600 font-semibold leading-relaxed">
            This link isn’t loading as an image. Make sure the file is shared as “Anyone with the link can view”, or upload the image instead.
          </p>
        )}
        {uploadErr && (
          <p className="text-xs text-red-600 font-semibold">{uploadErr}</p>
        )}
      </div>
    </div>
  );
}
