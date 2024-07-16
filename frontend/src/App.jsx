import React, { useState, useEffect, Suspense } from "react";
import { useSpring, animated } from "@react-spring/web";
import "./App.css";
import Counter from "./Counter";
import Loader from "./components/loader/Loader";

function App() {
  const [loading, setLoading] = useState(true);
  const props = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 500,
    config: {
      duration: 2000, // Длительность анимации в миллисекундах
      easing: t => t * t * t, // Функция плавности (easing)
    },
  });

  useEffect(() => {
    // Set a timer for 3 seconds to display the loader
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Suspense fallback={<Loader />}>
          <animated.div style={props}>
            {" "}
            <Counter />
          </animated.div>
        </Suspense>
      )}
    </>
  );
}

export default App;
