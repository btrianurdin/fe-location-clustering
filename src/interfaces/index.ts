export interface IMapBounds {
  northEast: [number, number];
  southWest: [number, number];
}

export interface IClusterPayload {
  count: number;
  clusters: Array<IClusterList>;
}

export interface IClusterList {
  is_cluster: boolean;
  cluster_id?: number;
  point_count?: number;
  coordinates: [number, number];
  price?: string;
}

export interface IHotelData {
  location_id: string;
  name: string;
  latitude: number;
  longitude: number;
  price: string;
  rating: number;
}

export interface ICluster {
  cluster: number;
  cluster_id: number;
  point_count: number;
  point_count_abbreviated: number;
}

export interface IGeoJsonFeaturesFormat<T> {
  type: "Feature";
  properties: T;
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}
