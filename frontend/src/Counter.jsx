import { useEffect, useRef, useState } from "react";
import styles from "./Counter.module.css";
import EnergyIndicator from "./EnergyIndicator";
import { useSelector, useDispatch } from "react-redux";
import {
  addEnergy,
  incrementCount,
  updateStep,
  setUserData,
} from "./store/counterSlice";
import coin from "./assets/ecocoin-230.png";
import icon from './assets/bot-icon-150.png'
import io from "socket.io-client";
import { getTelegramData } from "./utility/getTelegramData.js";
import Modal from "./components/modal/Modal";
import Spacer from "./components/spacer/Spacer.jsx";

const Counter = () => {
  const count = useSelector((state) => state.counter.count);
  const step = useSelector((state) => state.counter.step);
  const energy = useSelector((state) => state.counter.energy);
  const telegramId = useSelector((state) => state.counter.telegramId);

  const dispatch = useDispatch();
  const [isStepVisible, setIsStepVisible] = useState(false);
  const [socket, setSocket] = useState(null);
  const [userName, setUserName] = useState(null);
  const [botPoints, setBotPoints] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const decimals = useRef(0);

  useEffect(() => {
    const telegramData = getTelegramData();
    setUserName(telegramData.first_name);

    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    if (telegramData) {
      newSocket.emit("getUserData", telegramData.id);

      newSocket.on("userData", (userData) => {
        dispatch(setUserData(userData));
      });

      newSocket.on("updateCount", ({ userId, totalPoints }) => {
        if (userId === telegramData.id) {
          dispatch(setUserData({ totalPoints }));
        }
      });

      newSocket.on("updateEnergy", ({ userId, energy }) => {
        if (userId === telegramData.id) {
          dispatch(setUserData({ energy }));
        }
      });

      newSocket.on("botTapPoints", ({ pointsToAdd, totalPoints }) => {
        console.log(`Bot tapped ${pointsToAdd} points`);
        setIsModalOpen(true);
        setBotPoints(pointsToAdd);
        dispatch(setUserData({ totalPoints }));
      });
    }

    return () => newSocket.close();
  }, [dispatch]);

  useEffect(() => {
    if (socket) {
      socket.emit("addEnergy", { userId: telegramId, energy });
    }
},[energy])

  useEffect(() => {
    if (count > 0 && count % 10 === 0) {
      decimals.current = Math.floor(count / 10);
    }
    setIsStepVisible(true);
    const timeout = setTimeout(() => setIsStepVisible(false), 200);

    return () => clearTimeout(timeout);
  }, [count]);

  const clickHandler = () => {
    if (socket) {
      socket.emit("incrementCount", { userId: telegramId, step });
    }
    dispatch(incrementCount(step));
  };

  // const renewEnergy = () => {
  //   dispatch(addEnergy(100 - energy));
  //   if (socket) {
  //     socket.emit('addEnergy', { userId: telegramId, energy: 100 - energy });
  //   }
  // };

  window.Telegram.WebApp.ready();

  return (
    <div className={styles["counter-container"]}>

      <div>
        {isModalOpen && (
          <Modal
            onClose={handleCloseModal}
            icon={icon}
          >
            <h2>EcoBot taped ${botPoints} coin</h2>
          </Modal>
        )}
      </div>
      <p style={{ color: "white", position: "absolute", left: "10%"}}>{"Hi, " + userName || "no user"}</p>
      <p style={{ color: "#85FF4A", position: "absolute", left: "10%", top: "5%"}}>{"Multitap level - " + step || "no step"}</p>
      <div className={styles["step-container"]}>
        {isStepVisible ? <p className={styles.step}>+{step}</p> : ""}
      </div>
      <Spacer size={10}/>
      <p className={styles.count}>{count}</p>
      <div className={styles["coin-container"]}>
        <button className={styles.tap} onClick={clickHandler}>
          <img src={coin} alt="Eco Coin" style={{opacity: 0.5 + (energy / 200)}} />
        </button>
      </div>

      <br />
      <br />
      <EnergyIndicator />
      {/* <button onClick={renewEnergy}>Renew Energy</button> */}
    </div>
  );
};

export default Counter;
