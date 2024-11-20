# BTA Project: Coin-age Proof-of-Stake (PoS) Mechanism

**Project Directory:**  
`bta_1\bta\bta\BTA-PROJECT\frontend\frontend`

## Overview  
This project is a graphical user interface (GUI) that demonstrates the **Coin-age Proof-of-Stake (PoS)** mechanism in a blockchain environment. It enables users to visualize staking, coin-age accumulation, and block creation in real time. The interactive interface provides a comprehensive simulation for understanding PoS concepts.

---

## Features  

### Must-Have Features  
1. **Staking Simulation**  
   - Real-time simulation for users to stake coins.  
   - Adjustable staking amounts.  
   - Visual representation of staking power changes based on stake duration.  

2. **Blockchain Visualization**  
   - A visual representation of the blockchain with dynamic block creation.  
   - Each block displays:  
     - Staker's address  
     - Staked amount  
     - Coin-age  
     - Block creation time  

---

## Technologies Used  
- **Frontend Framework**: React.js  
- **Styling**: CSS (integrated within components)  
- **Graph Representation**: React-graph-vis  

---

## Folder Structure  

```plaintext
bta_1\bta\bta\BTA-PROJECT\frontend\frontend
├── src
│   ├── components
│   │   ├── CoinAgePoS.js  # Main component for the GUI
│   │   └── MinerList.js   # Handles miner-related logic and UI
│   ├── App.js             # Entry point for the React application
│   ├── index.js           # React DOM rendering
│   └── styles.css         # Styling for the application
├── public
│   └── index.html         # Main HTML file
└── package.json           # Dependencies and project metadata

```



## Installation Instructions
git clone <repository-url>
cd bta_1\bta\bta\BTA-PROJECT\frontend\frontend


---

## Install Dependencies
Ensure you have Node.js installed, then run:   npm install

---

### Start the Development Server
Launch the React application: npm start

---
### Access the Application
Open your browser and navigate to:

http://localhost:3000
