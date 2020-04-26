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

const file_date = '04-24-2020';
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
const prop_renames = {
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
  for (let prop in prop_renames) {
    const nprop = prop_renames[prop];
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

console.log('records[0]', records[0]);
console.log('sums_total', sums_total);

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
console.log('sums.length', sums.length);

for (let index = 0; index < 20; index++) {
  console.log('sums[' + index + ']', JSON.stringify(sums[index]));
  // console.log('sums[' + index + ']', sums[index]);
}
// for (let index = sums.length - 20; index < sums.length; index++) {
//   console.log('sums[' + index + ']', JSON.stringify(sums[index]));
// }

console.log(cvs_inpath);
console.log(outpath_summary, '\n');

fs.writeJsonSync(outpath_summary, sums, { spaces: 2 });
fs.writeJsonSync(outpath_detail, records, { spaces: 2 });

// sums[0] {"Confirmed":869170,"Deaths":49954,"Country_Region":"US","population":327167434,"per_1000":{"Confirmed":2.6566519453766904,"Deaths":0.15268634591546787}}
// sums[1] {"Confirmed":189973,"Deaths":25549,"Country_Region":"Italy","population":60431283,"per_1000":{"Confirmed":3.143620167720086,"Deaths":0.42277771928158464}}
// sums[2] {"Confirmed":213024,"Deaths":22157,"Country_Region":"Spain","population":46723749,"per_1000":{"Confirmed":4.559223190758944,"Deaths":0.4742128034289372}}
// sums[3] {"Confirmed":159460,"Deaths":21889,"Country_Region":"France","population":66987244,"per_1000":{"Confirmed":2.380453209867837,"Deaths":0.32676370444498354}}
// sums[4] {"Confirmed":139246,"Deaths":18791,"Country_Region":"United Kingdom","population":66488991,"per_1000":{"Confirmed":2.0942715163176415,"Deaths":0.28261821569829504}}
// sums[5] {"Confirmed":42797,"Deaths":6490,"Country_Region":"Belgium","population":11422068,"per_1000":{"Confirmed":3.7468696561778483,"Deaths":0.5681983332615425}}
// sums[6] {"Confirmed":153129,"Deaths":5575,"Country_Region":"Germany","population":82927922,"per_1000":{"Confirmed":1.8465312563843093,"Deaths":0.06722705532160808}}
// sums[7] {"Confirmed":87026,"Deaths":5481,"Country_Region":"Iran","population":81800269,"per_1000":{"Confirmed":1.0638840319706038,"Deaths":0.06700466963012065}}
// sums[8] {"Confirmed":83884,"Deaths":4636,"Country_Region":"China","population":1392730000,"per_1000":{"Confirmed":0.060229908165976176,"Deaths":0.00332871410826219}}
// sums[9] {"Confirmed":35921,"Deaths":4192,"Country_Region":"Netherlands","population":17231017,"per_1000":{"Confirmed":2.084670916406153,"Deaths":0.24328221601777772}}
// sums[10] {"Confirmed":50036,"Deaths":3331,"Country_Region":"Brazil","population":209469333,"per_1000":{"Confirmed":0.23887028847320577,"Deaths":0.015902089113922945}}
