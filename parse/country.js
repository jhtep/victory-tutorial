//
// COVID stats by country
//

const parse = require('csv-parse/lib/sync');
const fs = require('fs-extra');

const pop = require('./world-population/pop2018.json');
const pop_by_country = {};
pop.forEach((item) => {
  pop_by_country[item.country_name] = item;
});
const Country_Region_to_country_name = {
  US: 'United States',
  Iran: 'Iran, Islamic Rep.',
  Venezuela: 'Venezuela, RB',
  Bahamas: 'Bahamas, The',
  Brunei: 'Brunei Darussalam',
  Burma: 'Myanmar',
  'Congo (Brazzaville)': 'Congo, Rep.',
  'Congo (Kinshasa)': 'Congo, Rep.',
  Czechia: 'Czech Republic',
  Egypt: 'Egypt, Arab Rep.',
  Gambia: 'Gambia, The',
  'Korea, South': 'Korea, Rep.',
  Kyrgyzstan: 'Kyrgyz Republic',
  Laos: 'Lao PDR',
  Russia: 'Russian Federation',
  'Saint Kitts and Nevis': 'St. Kitts and Nevis',
  'Saint Lucia': 'St. Lucia',
  'Saint Vincent and the Grenadines': 'St. Vincent and the Grenadines',
  Slovakia: 'Slovak Republic',
  Syria: 'Syrian Arab Republic',
  Yemen: 'Yemen, Rep.',
};

// set_population: country_name missing Diamond Princess
// set_population: country_name missing Eritrea
// set_population: country_name missing Holy See
// set_population: country_name missing MS Zaandam
// set_population: country_name missing Taiwan*
// set_population: country_name missing Western Sahara

// sums[0] {"Confirmed":869170,"Deaths":49954,"Country_Region":"US"}
// "country_name": "United States",

// sums[7] {"Confirmed":87026,"Deaths":5481,"Country_Region":"Iran"}
// "country_name": "Iran, Islamic Rep.",

const file_date = '04-23-2020';
const daily_dir = './COVID-19/csse_covid_19_data/csse_covid_19_daily_reports/';
const cvs_inpath = daily_dir + file_date + '.csv';
const outpath_summary = './stats/' + file_date + '.json';
const outpath_detail = './stats/' + file_date + '-details.json';

// './COVID-19/csse_covid_19_data/csse_covid_19_daily_reports/03-23-2020.csv';
// './COVID-19/csse_covid_19_data/csse_covid_19_daily_reports/03-21-2020.csv';
// './COVID-19/csse_covid_19_data/csse_covid_19_daily_reports/01-22-2020.csv';

const input = fs.readFileSync(cvs_inpath);
const records = parse(input, {
  columns: true,
  skip_empty_lines: true,
});

// const nrecords = records.filter((item, index) => index < 4);
const renames = {
  'Province/State': 'Province_State',
  'Country/Region': 'Country_Region',
};
const sums_country = {};
const stats_init = { Confirmed: 0, Deaths: 0 };
const sums_total = Object.assign({}, stats_init);

function calc(sums, item) {
  for (let prop in stats_init) {
    let val = item[prop];
    if (!val) val = 0;
    sums[prop] += parseInt(val);
  }
}

function rename_item(item) {
  for (let prop in renames) {
    const nprop = renames[prop];
    const val = item[prop];
    if (val) item[nprop] = val;
  }
}

function find_population(item) {
  let cname = Country_Region_to_country_name[item.Country_Region];
  if (!cname) cname = item.Country_Region;
  let ncountry = pop_by_country[cname];
  if (!ncountry) {
    console.log('set_population: country_name missing', cname);
    return 0;
  }
  return ncountry.population;
  // console.log('set_population: item', item);
}

function process_item(item, index) {
  rename_item(item);
  item.source_index = index;
  let stats = sums_country[item.Country_Region];
  if (!stats) {
    stats = Object.assign({}, stats_init);
    stats.Country_Region = item.Country_Region;
    sums_country[item.Country_Region] = stats;
    stats.population = find_population(item);
  }
  calc(stats, item);
  calc(sums_total, item);
}

records.forEach(process_item);

// { 'Province/State': 'Hubei',
// 'Country/Region': 'China',
// 'Last Update': '2020-03-21T10:13:08',
// Confirmed: '67800',
// Deaths: '3139',
// Recovered: '58946',
// Latitude: '30.9756',
// Longitude: '112.2707',
// source_index: 0 }

// { FIPS: '36031',
// Admin2: 'Essex',
// Province_State: 'New York',
// Country_Region: 'US',
// Last_Update: '2020-04-22 00:00:00',
// Lat: '44.11630765',
// Long_: '-73.77297842',
// Confirmed: '22',
// Deaths: '0',
// Recovered: '0',
// Active: '22',
// Combined_Key: 'Essex, New York, US' }

console.log('\n', cvs_inpath);
console.log('records[0]', records[0]);
console.log('sums_total', sums_total);
console.log('\n');

const sums = Object.values(sums_country);
sums.sort((item1, item2) => item2.Deaths - item1.Deaths);
sums.forEach((item) => {
  item.per_1000 = {};
  for (let prop in stats_init) {
    item.per_1000[prop] = (item[prop] / item.population) * 1000;
    // item.per_population[prop] = item[prop] / item.population;
    // item.per_population[prop] = item[prop] / (item.population / 1000);
  }
});
console.log('sums.length', sums.length, '\n');

for (let index = 0; index < 20; index++) {
  console.log('sums[' + index + ']', JSON.stringify(sums[index]));
}
// for (let index = sums.length - 20; index < sums.length; index++) {
//   console.log('sums[' + index + ']', JSON.stringify(sums[index]));
// }

console.log(outpath_summary, '\n');

fs.writeJsonSync(outpath_summary, sums, { spaces: 2 });
fs.writeJsonSync(outpath_detail, records, { spaces: 2 });

// sums[0] {"Confirmed":869170,"Deaths":49954,"Country_Region":"US"}
// "country_name": "United States",

// sums[7] {"Confirmed":87026,"Deaths":5481,"Country_Region":"Iran"}
// "country_name": "Iran, Islamic Rep.",

// sums[1] {"Confirmed":189973,"Deaths":25549,"Country_Region":"Italy"}
// sums[2] {"Confirmed":213024,"Deaths":22157,"Country_Region":"Spain"}
// sums[3] {"Confirmed":159460,"Deaths":21889,"Country_Region":"France"}
// sums[4] {"Confirmed":139246,"Deaths":18791,"Country_Region":"United Kingdom"}
// sums[5] {"Confirmed":42797,"Deaths":6490,"Country_Region":"Belgium"}
// sums[6] {"Confirmed":153129,"Deaths":5575,"Country_Region":"Germany"}

// sums[8] {"Confirmed":83884,"Deaths":4636,"Country_Region":"China"}
// sums[9] {"Confirmed":35921,"Deaths":4192,"Country_Region":"Netherlands"}
// sums[10] {"Confirmed":50036,"Deaths":3331,"Country_Region":"Brazil"}
// sums[11] {"Confirmed":101790,"Deaths":2491,"Country_Region":"Turkey"}
// sums[12] {"Confirmed":43286,"Deaths":2241,"Country_Region":"Canada"}
// sums[13] {"Confirmed":16755,"Deaths":2021,"Country_Region":"Sweden"}
// sums[14] {"Confirmed":28496,"Deaths":1549,"Country_Region":"Switzerland"}
// sums[15] {"Confirmed":11633,"Deaths":1069,"Country_Region":"Mexico"}
// sums[16] {"Confirmed":22353,"Deaths":820,"Country_Region":"Portugal"}
// sums[17] {"Confirmed":17607,"Deaths":794,"Country_Region":"Ireland"}
// sums[18] {"Confirmed":23077,"Deaths":721,"Country_Region":"India"}
// sums[19] {"Confirmed":7775,"Deaths":647,"Country_Region":"Indonesia"}
