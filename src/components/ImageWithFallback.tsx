import React, { useState } from 'react';
import { ImageOff, Loader2 } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  fallbackLabel?: string;
}

export function ImageWithFallback({
  src,
  alt = 'Proplastics Industrial Piping',
  fallbackSrc,
  fallbackLabel,
  className = '',
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Reliable backup image of industrial piping if Unsplash or network fails
  const defaultFallback = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop';

  return (
    <div className="relative w-full h-full overflow-hidden bg-neutral-900 flex items-center justify-center">
      {loading && !error && (
        <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center z-10 transition-opacity duration-300">
          <Loader2 className="w-6 h-6 text-red-600 animate-spin" />
        </div>
      )}

      {error ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 to-black p-4 text-center">
          <div className="w-12 h-12 rounded-full bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500 mb-2">
            <ImageOff size={22} />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300">
            {fallbackLabel || alt}
          </span>
          <span className="text-[9px] text-neutral-500 uppercase tracking-widest mt-1">
            Proplastics Engineering Spec
          </span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoading(false)}
          onError={() => {
            if (fallbackSrc && src !== fallbackSrc) {
              // Try fallbackSrc first
              setError(false);
            } else {
              setError(true);
              setLoading(false);
            }
          }}
          className={`${className} transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
          {...props}
        />
      )}
    </div>
  );
}
