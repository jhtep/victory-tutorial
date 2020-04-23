import React from 'react';
import ReactDOM from 'react-dom';
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryStack,
} from 'victory';

const data2012 = [
  { quarter: 1, earnings: 10000 },
  { quarter: 2, earnings: 10000 },
  { quarter: 3, earnings: 10000 },
  { quarter: 4, earnings: 10000 },
];

const data2013 = [
  { quarter: 1, earnings: 15000 },
  { quarter: 2, earnings: 12500 },
  { quarter: 3, earnings: 19500 },
  { quarter: 4, earnings: 13000 },
];

const data2014 = [
  { quarter: 1, earnings: 11500 },
  { quarter: 2, earnings: 13250 },
  { quarter: 3, earnings: 20000 },
  { quarter: 4, earnings: 15500 },
];

const data2015 = [
  { quarter: 1, earnings: 18000 },
  { quarter: 2, earnings: 13250 },
  { quarter: 3, earnings: 15000 },
  { quarter: 4, earnings: 12000 },
];

// https://github.com/FormidableLabs/victory/blob/master/packages/victory-core/src/victory-theme/grayscale.js

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Victory Tutorial</h1>
        <VictoryChart
          // adding the material theme provided with Victory
          theme={VictoryTheme.material}
          // theme={VictoryTheme.grayscale}
          // domainPadding will add space to each side of VictoryBar to
          // prevent it from over>lapping the axis
          domainPadding={20}
        >
          <VictoryAxis
            // tickValues specifies both the number of ticks and where
            // they are placed on the axis
            tickValues={[1, 2, 3, 4]}
            tickFormat={['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4']}
          />
          <VictoryAxis
            dependentAxis
            // tickFormat specifies how ticks should be displayed
            tickFormat={(x) => `$${x / 1000}k`}
          />
          <VictoryStack>
            <VictoryBar data={data2012} x={'quarter'} y={'earnings'} />
            <VictoryBar data={data2013} x={'quarter'} y={'earnings'} />
            <VictoryBar data={data2014} x={'quarter'} y={'earnings'} />
            <VictoryBar data={data2015} x={'quarter'} y={'earnings'} />
          </VictoryStack>
        </VictoryChart>
      </div>
    );
  }
}

const app = document.getElementById('app');

ReactDOM.render(<App />, app);
