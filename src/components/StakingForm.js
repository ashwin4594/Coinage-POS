import React, { useState } from 'react';

const StakingForm = () => {
  const [stakeAmount, setStakeAmount] = useState('');

  const handleChange = (e) => {
    setStakeAmount(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`You have staked ${stakeAmount} coins!`);
  };

  return (
    <div id="staking" style={formStyle}>
      <h2>Stake Your Coins</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Enter amount to stake:
          <input
            type="number"
            value={stakeAmount}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Stake</button>
      </form>
    </div>
  );
};

const formStyle = {
  marginTop: '20px',
  textAlign: 'center',
};

export default StakingForm;
