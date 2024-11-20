import React, { useState, useEffect } from 'react';
import { Graph } from 'react-d3-graph';

function CoinAgePoS() {
  const [numMiners, setNumMiners] = useState(0);
  const [miners, setMiners] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [calculating, setCalculating] = useState(false);
  const [tooltipData, setTooltipData] = useState(null); // State for tooltip data
  const [tooltipTimeout, setTooltipTimeout] = useState(null); // To manage the 5-second delay

  // Handle number of miners change
  const handleNumMinersChange = (e) => {
    const num = Number(e.target.value);
    setNumMiners(num);

    const newMiners = Array.from({ length: num }, (_, i) => ({
      id: `miner${i + 1}`,
      stakedAmount: 0,
      coinAge: 0,
      blockCreated: false,
    }));
    setMiners(newMiners);
  };

  // Handle miner input change
  const handleMinerInputChange = (index, value) => {
    const updatedMiners = miners.map((miner, i) =>
      i === index ? { ...miner, stakedAmount: Number(value) } : miner
    );
    setMiners(updatedMiners);
  };

  // Start the simulation if valid data is provided
  const startSimulation = () => {
    if (miners.every((miner) => miner.stakedAmount > 0)) {
      setSimulationRunning(true);
      setTimeElapsed(0);
    } else {
      alert('Please enter valid initial coin values for each miner.');
    }
  };

  // Stop the simulation
  const stopSimulation = () => {
    setSimulationRunning(false);
    alert('Simulation Stopped');
  };

  // Update coin age every second while simulation is running
  useEffect(() => {
    if (simulationRunning) {
      const coinAgeInterval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
        updateCoinAgeAndCheckBlockCreation();
      }, 1000);

      return () => clearInterval(coinAgeInterval);
    }
  }, [simulationRunning, miners]);

  // Update coin age and check for block creation
  const updateCoinAgeAndCheckBlockCreation = () => {
    const updatedMiners = miners.map((miner) => {
      if (miner.blockCreated) return miner; // Skip if block is already created for this miner

      let newCoinAge = miner.coinAge + miner.stakedAmount;

      // Check if the miner's coin age reaches 61
      if (newCoinAge >= 61) {
        createBlock(miner);
        return { ...miner, coinAge: 0, blockCreated: true }; // Reset coin age after block creation
      }

      return { ...miner, coinAge: newCoinAge }; // Continue calculating coin age
    });

    setMiners(updatedMiners);
  };

  // Create a new block and attach it to the miner who created it
  const createBlock = (miner) => {
    setCalculating(true);

    // Simulate a delay for block creation
    setTimeout(() => {
      setCalculating(false);
      const previousBlockHash = blocks.length > 0 ? blocks[blocks.length - 1].blockHash : "0";
      const newBlock = {
        id: `Block ${blocks.length + 1}`,
        minerId: miner.id, // Link the block to the miner who created it
        stakedAmount: miner.stakedAmount,
        coinAge: miner.coinAge,
        blockHash: generateHash(),
        previousBlockHash,
        nonce: Math.floor(Math.random() * 100000),
        merkleRoot: generateHash(),
        timestamp: new Date().toLocaleString(),
      };

      setBlocks((prevBlocks) => [...prevBlocks, newBlock]);

      // Automatically reset and continue calculation after block creation
      setMiners((prevMiners) =>
        prevMiners.map((prevMiner) =>
          prevMiner.id === miner.id
            ? { ...prevMiner, coinAge: 0, blockCreated: false }
            : prevMiner
        )
      );
    }, 2000); // 2 seconds delay for animation
  };

  // Generate a random block hash
  const generateHash = () => Math.random().toString(36).substring(2, 15);

  const getNodeColor = (index) => {
    const colors = ['#ff4c4c', '#ffcc00', '#4cff4c', '#4c4cff', '#cc00ff'];
    return colors[index % colors.length];
  };

  // Set up graph data
  const data = {
    nodes: [
      ...miners.length > 0
        ? miners.map((miner, index) => ({
            id: miner.id,
            label: `${miner.id} - Age: ${miner.coinAge}`,
            color: miner.blockCreated ? '#333' : getNodeColor(index),
            size: 500,
          }))
        : [{ id: 'Miner 1', label: 'Miner 1', color: '#ff4c4c', size: 500 }],
      ...blocks.length > 0
        ? blocks.map((block) => ({
            id: block.id,
            label: `${block.id} - ${block.timestamp}`,
            color: '#999',
            size: 300,
          }))
        : [{ id: 'Block 1', label: 'Block 1', color: '#999', size: 300 }],
    ],
    links: [
      ...blocks.map((block) => ({
        source: block.minerId,
        target: block.id,
        color: '#666',
      })),
    ],
  };

  // Handle hover event to display tooltip with block details
  const handleNodeMouseOver = (nodeId) => {
    const block = blocks.find((block) => block.id === nodeId);
    if (block) {
      setTooltipData(block); // Set tooltip data when hovering over a block node
    }
  };

  // Handle mouse out event to hide the tooltip after 5 seconds
  const handleNodeMouseOut = () => {
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout); // Clear any existing timeout
    }
    const timeout = setTimeout(() => {
      setTooltipData(null); // Hide the tooltip after 5 seconds
    }, 5000);

    setTooltipTimeout(timeout); // Save the timeout reference to clear it later
  };

  const config = {
    node: {
      color: '#ff4c4c',
      size: 150,
      highlightStrokeColor: 'red',
      labelProperty: 'label',
      fontColor: '#ffffff', // Set text color to white
    },
    link: {
      highlightColor: '#ff6666',
      renderLabel: true,
    },
    directed: false,
    focusZoom: 1,
    d3: {
      gravity: -300,
      disableLinkForce: false,
    },
    width: 1000, // Increased width for better visibility
    height: 800, // Increased height for better visibility
  };

  return (
    <div
      style={{
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        backgroundColor: '#121212',
        color: '#ff4c4c',
        overflowY: 'auto',
        height: '100vh',
      }}
    >
      <h1
        style={{
          color: '#ffcc00',
          fontSize: '2.5em',
          textShadow: '2px 2px 8px rgba(255, 255, 255, 0.2)',
          marginBottom: '20px',
        }}
      >
        Coin-age Proof-of-Stake Simulation
      </h1>

      <label>
        <span
          style={{
            fontSize: '1.2em',
            color: '#4cff4c',
            marginRight: '10px',
          }}
        >
          Number of Miners:
        </span>
        <input
          type="number"
          value={numMiners}
          onChange={handleNumMinersChange}
          style={{
            marginLeft: '10px',
            padding: '5px',
            borderRadius: '5px',
            border: '1px solid #444',
            backgroundColor: '#1f1f1f',
            color: '#ff4c4c',
          }}
        />
      </label>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px',
          overflowY: 'auto',
          maxHeight: '400px',
        }}
      >
        {miners.map((miner, index) => (
          <div
            key={miner.id}
            style={{
              border: '1px solid #333',
              padding: '10px',
              marginTop: '10px',
              backgroundColor: '#1f1f1f',
              borderRadius: '5px',
              display: 'inline-block',
              width: '200px',
              color: '#ffcc00',
            }}
          >
            <h3
              style={{
                color: '#ffcc00',
                fontSize: '1.4em',
                textShadow: '1px 1px 4px rgba(255, 255, 255, 0.2)',
                marginBottom: '10px',
              }}
            >
              {miner.id}
            </h3>
            <label>
              Initial Coins for {miner.id}:
              <input
                type="number"
                value={miner.stakedAmount}
                onChange={(e) => handleMinerInputChange(index, e.target.value)}
                style={{
                  marginLeft: '5px',
                  padding: '5px',
                  borderRadius: '5px',
                  border: '1px solid #444',
                  backgroundColor: '#1f1f1f',
                  color: '#ff4c4c',
                }}
              />
            </label>

            <div style={{ marginTop: '10px' }}>
              <p style={{ color: '#4cff4c' }}>Coin Age: {miner.coinAge}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={startSimulation}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#ff4c4c',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '1.1em',
          transition: 'background-color 0.3s',
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#ff6666')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#ff4c4c')}
      >
        Start Simulation
      </button>

      <button
        onClick={stopSimulation}
        style={{
          marginTop: '10px',
          padding: '10px 20px',
          backgroundColor: '#444',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginLeft: '10px',
          fontSize: '1.1em',
          transition: 'background-color 0.3s',
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#555')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#444')}
      >
        Stop Simulation
      </button>

      {calculating && (
        <p
          style={{
            color: '#ffcc00',
            fontSize: '18px',
            marginTop: '20px',
            textShadow: '2px 2px 6px rgba(255, 255, 0, 0.3)',
          }}
        >
          Calculating Block...
        </p>
      )}

      {/* Tooltip for block information */}
      {tooltipData && (
        <div
          style={{
            position: 'absolute',
            backgroundColor: '#333',
            color: '#fff',
            padding: '10px',
            borderRadius: '5px',
            top: '10px',
            left: '10px',
            width: '300px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
          }}
        >
          <h3
            style={{
              color: '#ffcc00',
              textShadow: '1px 1px 4px rgba(255, 255, 255, 0.2)',
            }}
          >
            Block Details
          </h3>
          <p>ID: {tooltipData.id}</p>
          <p>Miner ID: {tooltipData.minerId}</p>
          <p>Staked Amount: {tooltipData.stakedAmount}</p>
          <p>Coin Age: {tooltipData.coinAge}</p>
          <p>Block Hash: {tooltipData.blockHash}</p>
          <p>Previous Block Hash: {tooltipData.previousBlockHash}</p>
          <p>Nonce: {tooltipData.nonce}</p>
          <p>Merkle Root: {tooltipData.merkleRoot}</p>
          <p>Timestamp: {tooltipData.timestamp}</p>
        </div>
      )}

      <Graph
        id="graph"
        data={data}
        config={config}
        style={{
          marginTop: '40px',
          border: '1px solid #444',
          borderRadius: '5px',
          padding: '20px',
          backgroundColor: '#1f1f1f',
        }}
        onMouseOverNode={handleNodeMouseOver}  // Mouse over node event
        onMouseOutNode={handleNodeMouseOut}    // Mouse out node event to trigger 5-second tooltip hide
      />
    </div>
  );
}

export default CoinAgePoS;
