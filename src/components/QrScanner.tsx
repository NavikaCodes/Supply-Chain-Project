import { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

interface QrScannerProps {
  onScanSuccess: (data: string) => void;
  onScanError: (error: Error) => void;
}

export function QrScanner({ onScanSuccess, onScanError }: QrScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    if (videoRef.current) {
      codeReader
        .decodeFromVideoDevice(undefined, videoRef.current, (result, error) => {
          if (result) {
            onScanSuccess(result.getText());
          }
        })
        .catch((error) => {
          onScanError(error);
        });
    }

    return () => {
      codeReader.reset();
    };
  }, []);

  return (
    <div className="relative">
      <video ref={videoRef} className="w-full rounded-lg" />
      <div className="absolute inset-0 border-2 border-green-500 rounded-lg" />
    </div>
  );
}