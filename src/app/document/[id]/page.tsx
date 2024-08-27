"use client";
import React, { useEffect, useState } from "react";
import ReactToPrint from "react-to-print";
import PrintContent from "./PrintContent"; // Adjust the path as needed
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRequestStore } from "@/state/request";
interface InfoProps {
  params: {
    id: string;
  };
}

const DocumentComponent: React.FC<InfoProps> = ({ params }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const { setId } = useRequestStore();
  const { id } = params;
  console.log("id", id);
  useEffect(() => {
    setId(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleZoomIn = () => {
    setZoomLevel((prevZoomLevel) => Math.min(prevZoomLevel + 0.1, 3)); // Max zoom 300%
  };

  const handleZoomOut = () => {
    setZoomLevel((prevZoomLevel) => Math.max(prevZoomLevel - 0.1, 0.5)); // Min zoom 50%
  };

  const handleResetZoom = () => {
    setZoomLevel(1); // Reset zoom level to default
  };

  return (
    <div className="flex pt-10 pb-10">
      <div className="bottom-4 right-4 rounded-md border bg-white p-2 flex z-50 fixed gap-3 shadow-lg">
        <button
          onClick={handleZoomIn}
          className="btn-primary btn-sm btn text-xs font-base text-white px-4 rounded-md"
        >
          Zoom In
        </button>
        <button
          onClick={handleZoomOut}
          className="btn-primary btn-sm btn text-xs font-base text-white px-4 rounded-md"
        >
          Zoom Out
        </button>
        <button
          onClick={handleResetZoom}
          className="btn-primary btn-sm btn text-xs font-base text-white px-4 rounded-md"
        >
          Reset Zoom
        </button>
        <ReactToPrint
          trigger={() => (
            <button className="btn-primary btn-sm btn text-xs font-base text-white px-4 rounded-md">
              Print
            </button>
          )}
          content={() => document.getElementById("document") as HTMLDivElement}
        />
      </div>
      <div className="flex">
        <div id="document" className="mx-auto">
          <PrintContent zoomLevel={zoomLevel} />
        </div>
      </div>
    </div>
  );
};

DocumentComponent.displayName = "DocumentComponent";

export default DocumentComponent;
