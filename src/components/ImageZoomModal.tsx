import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, X, Maximize2, Move } from 'lucide-react';

interface ImageZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  subtitle?: string;
  badge?: string;
}

export function ImageZoomModal({
  isOpen,
  onClose,
  imageUrl,
  title,
  subtitle,
  badge = 'Technical Detail',
}: ImageZoomModalProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.35, 3.5));
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      const next = Math.max(prev - 0.35, 0.75);
      if (next <= 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 select-none animate-in fade-in duration-300"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top Bar with Title and Close */}
      <div className="flex items-center justify-between z-20 pb-4 border-b border-neutral-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-red-500 block mb-0.5">
            {badge}
          </span>
          <h3 className="font-bold text-lg sm:text-xl text-white uppercase tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-700 text-white hover:bg-red-600 hover:border-red-600 flex items-center justify-center transition-all duration-200"
          aria-label="Close zoom modal"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Image Area with Zoom & Pan */}
      <div
        className="relative flex-1 flex items-center justify-center overflow-hidden my-4 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
          className="max-w-full max-h-full flex items-center justify-center"
        >
          <img
            src={imageUrl}
            alt={title}
            className="max-h-[72vh] max-w-[85vw] object-contain rounded-md shadow-2xl pointer-events-none"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Drag Helper Hint when zoomed */}
        {scale > 1 && (
          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm border border-neutral-800 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[11px] text-neutral-300 pointer-events-none">
            <Move size={12} className="text-red-500" />
            <span>Click & drag to pan</span>
          </div>
        )}
      </div>

      {/* Floating Zoom Controls Bar */}
      <div className="z-20 flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-neutral-800">
        <div className="flex items-center gap-2 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 px-4 py-2 rounded-full shadow-xl">
          <button
            onClick={handleZoomOut}
            disabled={scale <= 0.75}
            className="p-2 rounded-full hover:bg-neutral-800 disabled:opacity-40 text-white hover:text-red-500 transition-colors"
            title="Zoom Out"
            aria-label="Zoom out"
          >
            <ZoomOut size={18} />
          </button>

          <span className="text-xs font-mono font-bold text-neutral-300 min-w-14 text-center">
            {Math.round(scale * 100)}%
          </span>

          <button
            onClick={handleZoomIn}
            disabled={scale >= 3.5}
            className="p-2 rounded-full hover:bg-neutral-800 disabled:opacity-40 text-white hover:text-red-500 transition-colors"
            title="Zoom In"
            aria-label="Zoom in"
          >
            <ZoomIn size={18} />
          </button>

          <div className="h-4 w-px bg-neutral-700 mx-1" />

          <button
            onClick={handleResetZoom}
            className="p-2 rounded-full hover:bg-neutral-800 text-white hover:text-red-500 transition-colors"
            title="Reset to 100%"
            aria-label="Reset zoom"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        <button
          onClick={onClose}
          className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-colors"
        >
          Close Preview
        </button>
      </div>
    </div>
  );
}
