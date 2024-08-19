import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import styles from './styles/Referrals.module.css'; // Make sure this file exists

const Referrals = () => {
  const telegramId = useSelector(state => state.counter.telegramId);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("REFERALS", telegramId)
  const url = "http://localhost:3000/"

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await axios.get(`${url}api/users/referrals/${telegramId}`);
        console.log("response data", response)
        setReferrals(response.data);
      } catch (error) {
        console.error('Error fetching referrals:', error);
        setError('Failed to load referrals. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (telegramId) {
      fetchReferrals();
    } else {
      setLoading(false);
      setError('No Telegram ID found.');
    }
  }, [telegramId]);

  if (loading) {
    return <p>Loading referrals...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={styles.container}>
      <h1>My Referrals</h1>
      {/* <ul>
        {referrals.length > 0 ? (
          referrals.map((referral, index) => (
            <li key={index}>
              {referral.username || 'Unknown User'} - Points Earned: {referral.pointsEarned}
            </li>
          ))
        ) : (
          <p className={styles.referral}>No referrals found.</p>
        )}
      </ul> */}
      <p className={styles.referral}>
        Referral Link: <a href={`https://t.me/Eco01_bot?start=${telegramId}`}>https://t.me/Eco01_bot?start={telegramId}</a>
      </p>
    </div>
  );
};

export default Referrals;
