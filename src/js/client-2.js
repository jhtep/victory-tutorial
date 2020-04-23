import React from 'react';
import ReactDOM from 'react-dom';
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryStack,
} from 'victory';

const data = [
  { quarter: 1, earnings: 13000 },
  { quarter: 2, earnings: 16500 },
  { quarter: 3, earnings: 14250 },
  { quarter: 4, earnings: 19000 },
];

class App extends React.Component {
  render() {
    return (
      <VictoryChart>
        <VictoryBar data={data} x="quarter" y="earnings" />
      </VictoryChart>
    );
  }
}

const app = document.getElementById('app');

ReactDOM.render(<App />, app);
