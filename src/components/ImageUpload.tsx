import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { uploadPropertyImage } from '../lib/upload';

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  disabled?: boolean;
}

export default function ImageUpload({ value, onChange, maxFiles = 10, disabled }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length || !user) return;
    setUploading(true);
    setError('');
    const newUrls: string[] = [];
    for (let i = 0; i < Math.min(files.length, maxFiles - value.length); i++) {
      const result = await uploadPropertyImage(user.id, files[i]);
      if ('url' in result) newUrls.push(result.url);
      else setError(result.error);
    }
    setUploading(false);
    if (newUrls.length) onChange([...value, ...newUrls]);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeUrl = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map((url, idx) => (
          <div key={url} className="relative group">
            <img
              src={url}
              alt=""
              className="w-20 h-20 object-cover rounded-lg border border-gray-300 dark:border-gray-700"
            />
            {!disabled && (
              <button
                type="button"
                onClick={() => removeUrl(idx)}
                className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
        {value.length < maxFiles && !disabled && (
          <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-[#FF385C] hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/heic"
              multiple
              className="sr-only"
              onChange={handleFileSelect}
              disabled={uploading}
            />
            {uploading ? (
              <span className="text-xs text-gray-500">...</span>
            ) : (
              <Upload className="h-6 w-6 text-gray-400" />
            )}
          </label>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
      <p className="text-xs text-gray-500">
        {value.length} / {maxFiles} images. Upload or paste URLs below.
      </p>
    </div>
  );
}
