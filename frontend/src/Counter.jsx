import { useEffect, useState, useRef } from "react";
import styles from "./styles/Counter.module.css";
import EnergyIndicator from "./EnergyIndicator";
import { useSelector, useDispatch } from "react-redux";
import {
  spentEnergy,
  addEnergy,
  incrementCount,
  setUserData,
  setEnergy,
  setTotalPoints,
  setIsEntered,
  isEntered,
} from "./store/counterSlice";
import coin from "./assets/ecocoin-230.png";
import icon from "./assets/bot-icon-150.png";
import io from "socket.io-client";
import { getTelegramData } from "./utility/getTelegramData.js";
import Modal from "./components/modal/Modal";
import Spacer from "./components/spacer/Spacer.jsx";

const Counter = () => {
  const count = useSelector((state) => state.counter.count);
  const step = useSelector((state) => state.counter.step);
  const energy = useSelector((state) => state.counter.energy);
  const totalPoints = useSelector((state) => state.counter.totalPoints);
  const telegramId = useSelector((state) => state.counter.telegramId);
  const isEntered = useSelector((state) => state.counter.isEntered);

  const dispatch = useDispatch();
  const [isStepVisible, setIsStepVisible] = useState(false);
  const [socket, setSocket] = useState(null);
  const [telegramName, setTelegramName] = useState(null);
  const [telegramUserName, setTelegramUserName] = useState(null);
  const [botPoints, setBotPoints] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isFirstEnter, setIsFirstEnter] = useState(true);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // setIsFirstEnter(false);
    dispatch(setIsEntered(true))
  };


  useEffect(() => {
    const telegramData = getTelegramData();
    if (telegramData) {
      setTelegramName(telegramData.first_name);
      setTelegramUserName(telegramData.username);
      dispatch(setUserData({ telegramId: telegramData.id }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (telegramId) {
      const newSocket = io("http://localhost:3000");
      setSocket(newSocket);

      newSocket.emit("getUserData", telegramId);

      newSocket.on("userData", (userData) => {
        dispatch(setUserData(userData));
        dispatch(setTotalPoints(userData.totalPoints));
        dispatch(setEnergy(userData.energy));
      });

      newSocket.on("updateCount", ({ userId, totalPoints }) => {
        if (userId === telegramId) {
          dispatch(setTotalPoints(totalPoints));
        }
      });

      newSocket.on("botTapPoints", ({ pointsToAdd, totalPoints }) => {
        setIsModalOpen(true);
        setBotPoints(pointsToAdd);
        dispatch(setTotalPoints(totalPoints));

      });

      return () => {
        newSocket.close();
      };
    }
  }, [telegramId, dispatch]);


  const clickHandler = () => {
    if (energy > 0) {
      dispatch(incrementCount(step));
      dispatch(spentEnergy(step));
      if (socket) {
        socket.emit("incrementCount", { userId: telegramId, step });
        socket.emit("addEnergy", { userId: telegramId, energy });
      }
    }
  };

  useEffect(()=> {

  const tg = window.Telegram.WebApp;
  tg.MainButton.text = "LAUNCH APP";
  tg.ready();
  }, []);

  return (
    <div className={styles["counter-container"]}>
      <div>
        {!isEntered && isModalOpen && (
          <Modal onClose={handleCloseModal} icon={icon}>
            <h2>EcoBot tapped {botPoints} coin</h2>
          </Modal>
        )}
      </div>
      <header className={styles.header}>
        <p className={styles.name}>{"Hi, " + (telegramName || "no user")}</p>
        <p className={styles.level}>{"Level: " + (step || "no step")}</p>
        <p className={styles.account}>{`Account: ${telegramUserName}`}</p>
      </header>
      <div className={styles["step-container"]}>
        {isStepVisible ? <p className={styles.step}>+{step}</p> : ""}
      </div>
      <Spacer size={10} />
      <p className={styles.count}>{totalPoints}</p>
      <div className={styles["coin-container"]}>
        <button className={styles.tap} onClick={clickHandler}>
          <img
            src={coin}
            alt="Eco Coin"
            style={{ opacity: 0.5 + energy / 200 }}
          />
        </button>
      </div>
      <p className={styles.totalPoints}>clicks: {count}</p>
      <br />
      <br />
      <EnergyIndicator />
    </div>
  );
};

export default Counter;
