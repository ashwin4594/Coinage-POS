import React from 'react';

const Header = () => {
  return (
    <header style={headerStyle}>
      <h1>Coin-age Proof-of-Stake</h1>
      <nav>
        <a href="#staking">Staking</a>
        <a href="#visualization">Blockchain Visualization</a>
      </nav>
    </header>
  );
};

const headerStyle = {
  backgroundColor: '#282c34',
  padding: '10px',
  textAlign: 'center',
  color: 'white',
};

export default Header;
