import React from 'react';
import ReactDOM from 'react-dom';
import { VictoryPie, VictoryContainer } from 'victory';
import material from './material';

const nslice = 6;

const items = [
  {
    Confirmed: 905333,
    Deaths: 51949,
    Country_Region: 'US',
    population: 327167434,
    per_1000: {
      Confirmed: 2.767185562851589,
      Deaths: 0.15878414108905473,
    },
  },
  {
    Confirmed: 192994,
    Deaths: 25969,
    Country_Region: 'Italy',
    population: 60431283,
    per_1000: {
      Confirmed: 3.1936108323233845,
      Deaths: 0.4297277620268297,
    },
  },
  {
    Confirmed: 219764,
    Deaths: 22524,
    Country_Region: 'Spain',
    population: 46723749,
    per_1000: {
      Confirmed: 4.7034753140207135,
      Deaths: 0.4820674813572858,
    },
  },
  {
    Confirmed: 159952,
    Deaths: 22279,
    Country_Region: 'France',
    population: 66987244,
    per_1000: {
      Confirmed: 2.3877978917896665,
      Deaths: 0.33258570840740964,
    },
  },
  {
    Confirmed: 144640,
    Deaths: 19567,
    Country_Region: 'United Kingdom',
    population: 66488991,
    per_1000: {
      Confirmed: 2.17539772862548,
      Deaths: 0.29428932076890746,
    },
  },
  {
    Confirmed: 44293,
    Deaths: 6679,
    Country_Region: 'Belgium',
    population: 11422068,
    per_1000: {
      Confirmed: 3.877844187234746,
      Deaths: 0.5847452492841051,
    },
  },
  {
    Confirmed: 154999,
    Deaths: 5760,
    Country_Region: 'Germany',
    population: 82927922,
    per_1000: {
      Confirmed: 1.8690809592455482,
      Deaths: 0.06945790827846861,
    },
  },
];

let other_stat = 0;
const pie_data = [];
//   { x: 'Cats', y: 35 },
//   { x: 'Dogs', y: 40 },
//   { x: 'Birds', y: 55 },
//   { x: 'Cow', y: 55 },
// ];
items.forEach((item, index) => {
  if (index < nslice) {
    pie_data.push({ x: item.Country_Region, y: item.Confirmed });
  } else {
    other_stat += item.Confirmed;
  }
});
pie_data.push({ x: 'Other', y: other_stat });
// const colors = ['tomato', 'orange', 'gold', 'cyan', 'navy'];
// built in color scales: "grayscale", "qualitative", "heatmap", "warm", "cool", "red", "green", "blue".
// const colors = 'qualitative';

const yellow200 = '#FFF59D';
const deepOrange600 = '#F4511E';
const lime300 = '#DCE775';
const lightGreen500 = '#8BC34A';
const teal700 = '#00796B';
const cyan900 = '#006064';
const red = '#FF0000';
const colors = [
  cyan900,
  teal700,
  lightGreen500,
  lime300,
  yellow200,
  deepOrange600,
  red,
];

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>COVID-19 Total World Confirmed</h1>
        <VictoryPie
          // width="200"
          // animate={{ duration: 2000 }}
          colorScale={colors}
          theme={material}
          // containerComponent={<VictoryContainer height={350} />}
          data={pie_data}
        />
        <VictoryPie
          // width="200"
          // animate={{ duration: 2000 }}
          colorScale={colors}
          theme={material}
          // containerComponent={<VictoryContainer height={350} />}
          data={pie_data}
        />
      </div>
    );
  }
}

const app = document.getElementById('app');

ReactDOM.render(<App />, app);
