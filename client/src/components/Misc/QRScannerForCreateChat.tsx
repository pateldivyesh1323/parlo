import { ScanQrCode, X } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { type IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";

interface QRScannerForCreateChatProps {
  onScan?: (result: IDetectedBarcode[]) => void;
}

export function QRScannerForCreateChat({
  onScan,
}: QRScannerForCreateChatProps) {
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = (result: IDetectedBarcode[]) => {
    console.log("QR Scanned:", result);
    onScan?.(result);
    setIsScanning(false);
  };

  const toggleScanner = () => {
    setIsScanning(!isScanning);
  };

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" onClick={toggleScanner}>
        <ScanQrCode className="w-4 h-4" />
        Scan QR
      </Button>

      {isScanning && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Scan QR Code</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsScanning(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Scanner
              onScan={(result) => handleScan(result)}
              components={{
                torch: true,
              }}
              styles={{}}
            />
          </div>
        </div>
      )}
    </div>
  );
}
