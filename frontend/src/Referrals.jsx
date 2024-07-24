import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import styles from './styles/Referrals.module.css'; // Убедитесь, что этот файл существует

const Referrals = () => {
  const telegramId = useSelector(state => state.counter.telegramId);
  const [referrals, setReferrals] = useState([]);

  // useEffect(() => {
  //   const fetchReferrals = async () => {
  //     try {
  //       const response = await axios.get(`api/referrals/${telegramId}`);
  //       setReferrals(response.data);
  //     } catch (error) {
  //       console.error('Error fetching referrals:', error);
  //     }
  //   };

  //   if (telegramId) {
  //     fetchReferrals();
  //   }
  // }, [telegramId]);

  return (
    <div className={styles.container}>
      <h1>My Referrals</h1>
      <ul>
        {/* {referrals.map((referral, index) => (
          <li key={index}>
            {referral.username} - Points Earned: {referral.pointsEarned}
          </li>
        ))} */}
      </ul>
      <p className={styles.referral}>Referral Link: <a href={`https://t.me/Eco01_bot?start=${telegramId}`}>https://t.me/Eco01_bot?start={telegramId}</a></p>
    </div>
  );
};

export default Referrals;
