import { useRef } from "react";
import { useMap, useMapEvent } from "react-leaflet";
import { IMapBounds } from "../../interfaces";

interface IZoomControlProps {
  onZoom: (bounds: IMapBounds, zoom: number) => void;
}

const ZoomControl = ({ onZoom }: IZoomControlProps) => {
  const map = useMap();
  const delayRef = useRef<number | null>(null);

  useMapEvent("zoomend", () => {
    if (delayRef.current) {
      clearTimeout(delayRef.current);
    }

    delayRef.current = setTimeout(() => {
      const bounds = map.getBounds();
      const northEast = bounds.getNorthEast();
      const southWest = bounds.getSouthWest();

      console.log({
        northEast: [northEast.lat, northEast.lng],
        southWest: [southWest.lat, southWest.lng],
      });

      onZoom(
        {
          northEast: [northEast.lat, northEast.lng],
          southWest: [southWest.lat, southWest.lng],
        },
        map.getZoom()
      );
    }, 500);
  });

  return null;
};

export default ZoomControl;
