import { useCallback, useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import { IClusterPayload, IMapBounds } from "../../interfaces";
import FloatingProgress from "../floating-progress";
import ZoomControl from "../zoom-control";
import MoveControl from "../move-control";
import clsx from "clsx";

import "leaflet/dist/leaflet.css";

interface IMapSectionProps {
  bounds: IMapBounds & { zoomLevel: number };
  acitveClusterId: number | null;
  onMove: (bounds: IMapBounds) => void;
  onZoom: (bounds: IMapBounds, zoom: number) => void;
  onClusterClick: (isCluster: boolean, clusterId?: number) => void;
}

const MapSection = ({
  bounds,
  acitveClusterId,
  onMove,
  onZoom,
  onClusterClick,
}: IMapSectionProps) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [hotels, setHotels] = useState<IClusterPayload | null>(null);

  const fetchHotels = useCallback(async () => {
    setIsFetching(true);
    const response = await fetch(`http://localhost:3002/clusters`, {
      method: "POST",
      body: JSON.stringify({
        bounds: {
          northEast: bounds.northEast,
          southWest: bounds.southWest,
        },
        zoom_level: bounds.zoomLevel,
      }),
    });
    const data = await response.json();
    setIsFetching(false);
    setHotels(data.payload);
  }, [bounds]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  return (
    <div className="w-full relative">
      {isFetching && <FloatingProgress />}
      <div className="w-full h-full">
        <MapContainer
          bounds={[
            [-7.775670687112559, 110.3869331021706],
            [-7.810068564955439, 110.33496262029804],
          ]}
          zoom={10}
          style={{
            height: "100%",
            width: "100%",
          }}
          minZoom={10}
          zoomControl={false}
          className="[&_.leaflet-attribution-flag]:!hidden"
        >
          <TileLayer
            attribution='github: <a href="https://github.com/btrianurdin">btrianurdin</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {hotels?.clusters?.map((cluster, idx) => {
            const emptyPrice =
              !cluster.is_cluster && "price" in cluster && cluster.price === "";

            return (
              <Marker
                eventHandlers={{
                  click: () =>
                    onClusterClick(cluster.is_cluster, cluster.cluster_id),
                }}
                key={`cluster-${idx}`}
                position={cluster.coordinates.reverse() as [number, number]}
                icon={L.divIcon({
                  html: `<div class="${clsx(
                    "bg-blue-600 text-white !text-xs rounded-full flex shadow-xl border border-gray-400 items-center justify-center h-6 w-16",
                    cluster.is_cluster && "w-6",
                    emptyPrice && "!w-5 !h-3",
                    acitveClusterId === cluster.cluster_id && "bg-red-500"
                  )}">${
                    cluster.is_cluster ? cluster.point_count : cluster.price
                  }</div>`,
                  className: "-left-10 -top-4",
                })}
              />
            );
          })}
          <ZoomControl onZoom={onZoom} />
          <MoveControl onMove={onMove} />
          {/* <Polyline
              positions={[
                [-6.959396750064258, 110.06125311491178],
                [ -6.953159844004375, 110.76999325450794],
                [-7.095340581703681, 110.7712498859616],
              ]}

              weight={5}
              color="red"
            />
            <Rectangle
              bounds={[
                [-7.358380940700147, 110.80741882324219],
                [-8.081664515668198, 109.68406677246094],
              ]}
            />
            <Rectangle
              bounds={[
                [-7.335226676489317, 111.29217093331476],
                [-8.058549782645944, 110.16881888253351],
              ]}
              color="red"
            /> */}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapSection;
