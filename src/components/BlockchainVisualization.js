import React from 'react';
import { Graph } from 'react-d3-graph';

const BlockchainVisualization = ({ miners }) => {
  const graphData = {
    nodes: miners.map((miner) => ({
      id: miner.address,
      label: miner.address,
      style: { fill: '#00f' },
    })),
    links: [],
  };

  // Create links between miners based on blockchain generation
  miners.forEach((miner) => {
    miner.blocks.forEach((block, index) => {
      // Add links between the miners (edges)
      miners.forEach((otherMiner) => {
        if (miner !== otherMiner) {
          graphData.links.push({
            source: miner.address,
            target: otherMiner.address,
            label: `Block #${block.blockNumber}`,
            style: { stroke: '#f00' },
          });
        }
      });
    });
  });

  const myConfig = {
    node: {
      color: 'lightblue',
      size: 300,
      fontSize: 12,
      fontWeight: 'normal',
      highlightStrokeColor: 'blue',
    },
    link: {
      highlightColor: 'blue',
      renderLabel: true,
      labelProperty: 'label',
    },
  };

  return (
    <div>
      <h2>Blockchain Visualization</h2>
      <Graph
        id="graph-id"
        data={graphData}
        config={myConfig}
        style={{ width: '100%', height: '600px' }}
      />
    </div>
  );
};

export default BlockchainVisualization;
