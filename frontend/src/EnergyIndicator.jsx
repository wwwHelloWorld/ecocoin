import { useSelector, useDispatch } from "react-redux";
import { spentEnergy, addEnergy } from "./store/counterSlice";
import styles from "./styles/Counter.module.css";
import { useEffect, useState, useLayoutEffect } from "react";

export default function EnergyIndicator() {
  const [isUpdated, setIsUpdated] = useState(false);
  const [background, setBackground] = useState("not-empty");
  const dispatch = useDispatch();

  const energy = useSelector((state) => state.counter.energy);
  const count = useSelector((state) => state.counter.count);
  const step = useSelector((state) => state.counter.step);
  const isEnergyEmpty = useSelector((state) => state.counter.isEnergyEmpty);

  useLayoutEffect(() => {
    if (isEnergyEmpty) {
      setBackground("empty");
    } else {
      setBackground("not-empty");
    }
  }, [isEnergyEmpty]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (energy < 100) {
        dispatch(addEnergy(1));
      }
    }, 10000); // Обновляем энергию каждые 10 секунд
    return () => clearInterval(interval);
  }, [dispatch, energy]);

  // useEffect(() => {
  //   if (count === 0) return;

  //   dispatch(spentEnergy(step));
  //   setIsUpdated(true);
  //   const timeout = setTimeout(() => {
  //     setIsUpdated(false);
  //   }, 200);
  //   return () => clearTimeout(timeout);
  // }, [count, dispatch, step]);

  return (
    <>
      <div className={`${styles[background]} ${styles["indicator-container"]}`}>
        <div
          className={styles.indicator}
          style={{
            width: `${energy}%`,
            float: "left",
            opacity: isUpdated ? 1 : 0.7,
          }}
        />
      </div>
      <p className={styles.energyCounter}>{energy}%</p>
    </>
  );
}
