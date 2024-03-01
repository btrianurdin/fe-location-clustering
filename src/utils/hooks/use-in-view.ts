import { useEffect, useMemo, useRef, useState } from "react";

const useInView = () => {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  const observer = useMemo(
    () =>
      new IntersectionObserver(
        ([entry]) => {
          setInView(entry.isIntersecting);
        },
        { threshold: 0.5 }
      ),
    []
  );

  useEffect(() => {
    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref]);

  return { ref, inView };
};

export default useInView;
