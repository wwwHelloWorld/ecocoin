import { useSelector, useDispatch } from "react-redux";
import styles from "./styles/MenuButton.module.css";
import { setActivePage } from "./store/counterSlice";

const MenuBottom = () => {
  const activePage = useSelector((state) => state.counter.activePage);
  const dispatch = useDispatch();

  const activePageChanger = (page) => {
    dispatch(setActivePage(page));
  };

  return (
    <nav>
      <ul className={styles.menuContainer}>
        <li>
          <button
            className={activePage === "main" ? styles.active : ""}
            onClick={() => activePageChanger("main")}
          >
            Main
          </button>
        </li>
        <li>
          <button
            className={activePage === "referrals" ? styles.active : ""}
            onClick={() => activePageChanger("referrals")}
          >
            Referrals
          </button>
        </li>
        <li>
          <p className={styles.item}>Home</p>
        </li>
      </ul>
    </nav>
  );
};

export default MenuBottom;
