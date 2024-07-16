import styles from "./Loader.module.css";
import icon from "../../assets/bot-icon-50-inverse.png";
import {Radio} from "react-loader-spinner";

function Loader() {
  return (
    <div className={styles.loaderContainer}>
      <Radio
        visible={true}
        height="170"
        width="170"
        color="#80ff80"
        ariaLabel="radio-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />

      <h1 className={styles["loaderH1"]}>EcoCoin</h1>
      {/* <div>
        <img src={icon} alt="" />
      </div> */}
    </div>
  );
}

export default Loader;
