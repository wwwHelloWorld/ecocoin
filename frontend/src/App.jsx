import React, { useState, useEffect, Suspense, lazy } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSpring, animated } from "@react-spring/web";
import io from "socket.io-client";
import "./styles/App.css";
import Loader from "./components/loader/Loader"; // Путь к Loader.js
import { setUserData, setisDataLoaded } from "./store/counterSlice";

const Counter = lazy(() => import("./Counter"));
const MenuBottom = lazy(() => import("./MenuBottom"));
const Referrals = lazy(() => import("./Referrals"));


function App() {
  const [loading, setLoading] = useState(true);
  const activePage = useSelector((state) => state.counter.activePage);
  const telegramId = useSelector((state) => state.counter.telegramId);
  const dispatch = useDispatch();

  const props = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 500,
    config: {
      duration: 2000, // Длительность анимации в миллисекундах
      easing: (t) => t * t * t, // Функция плавности (easing)
    },
  });

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);


  if (loading) {
    return <Loader />;
  }

  return (
    <div className="app-container">
      <Suspense fallback={<Loader />}>
        <animated.div style={props}>
          {activePage === "main" ? <Counter /> : <Referrals />}
        </animated.div>
      </Suspense>
      <MenuBottom />
    </div>
  );y
}

export default App;
