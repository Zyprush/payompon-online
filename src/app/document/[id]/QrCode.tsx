import React from 'react';
import QRCode from 'qrcode.react';

const QrCode = () => {
  // Get the current URL or define any URL you want to encode in the QR code
  const qrValue = window.location.href; // or any other URL/string you want to encode

  return (
    <span className="flex flex-col mt-auto mb-0 text-sm text-green-800 font-serif italic">
      {/* Display the QR code here */}
      <QRCode value={qrValue} size={100} />
      <p className='mt-2'>Not Valid Without Official Seal</p>
      <p>Paid Under O.R:</p>
      <p>Res. Cert. No:</p>
      <p>Issued on: Issued at: Barangay Payompon Mamburao, Occ. Mindoro</p>
    </span>
  );
};

export default QrCode;
