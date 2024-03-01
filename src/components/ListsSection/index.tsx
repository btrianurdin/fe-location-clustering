import { useEffect, useState } from "react";
import { IHotelData, IMapBounds } from "../../interfaces";
import { Rating } from "react-simple-star-rating";
import convertCurrency from "../../utils/convert-currency";
import Skeleton from "../skeleton";
import clsx from "clsx";

interface IListsSectionProps {
  bounds: IMapBounds & { zoomLevel: number };
  activeClusterId: number | null;
}

const ListsSection = ({ bounds, activeClusterId }: IListsSectionProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [lists, setLists] = useState<Array<IHotelData>>([]);

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:3002/locations", {
      method: "POST",
      body: JSON.stringify({
        bounds: {
          northEast: bounds.northEast,
          southWest: bounds.southWest,
        },
        cluster_id: activeClusterId,
        zoom_level: bounds.zoomLevel,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        setLists(data.payload?.locations);
      });
  }, [bounds, activeClusterId]);

  return (
    <div className="w-[35%] flex-shrink-0 h-full overflow-auto">
      {isLoading && <ListSkeleton />}
      {!isLoading &&
        lists.map((list) => {
          return (
            <div
              key={list.location_id}
              className="p-5 flex flex-col gap-2 w-full border-b border-b-gray-300 hover:bg-blue-50"
            >
              <h1 className="text-xl font-semibold">{list.name}</h1>
              <div className="w-full flex items-center gap-2">
                <h3>Rating: {list.rating}</h3>
                <Rating
                  initialValue={list.rating}
                  allowFraction
                  size={20}
                  SVGclassName="inline-block"
                  readonly
                />
              </div>
              <h2 className="text-base pt-3">
                Price:{" "}
                <span
                  className={clsx(
                    "bg-blue-600 text-white p-1 px-2 rounded-md",
                    !list.price && "bg-red-500"
                  )}
                >
                  {!list.price && "Not available"}
                  {list.price && convertCurrency(list.price)}
                </span>
              </h2>
            </div>
          );
        })}
    </div>
  );
};

const ListSkeleton = () => {
  const count = 10;

  return (
    <>
      {[...Array(count)].map((_, idx) => (
        <div
          key={idx}
          className="p-5 flex flex-col gap-3 w-full border-b border-b-gray-300 hover:bg-blue-50"
        >
          <Skeleton className={clsx("h-7 w-1/2", idx % 2 === 0 && "w-2/3")} />
          <div className="flex gap-3">
            <Skeleton className="h-3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Skeleton className="w-[60px]" />
            <Skeleton className="w-[100px] h-6" />
          </div>
        </div>
      ))}
    </>
  );
};

export default ListsSection;
