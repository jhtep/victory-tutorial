const fs = require('fs-extra');

// ./world-population/world-population.json

const path = './world-population/world-population.json';
const outpath = './world-population/pop2018.json';

// "country_name": "Afghanistan",
// "value": 37172386.0,

const input = fs.readJsonSync(path);
const out = [];
input.forEach((item) => {
  if (item.fields.year == '2018') {
    const country_name = item.fields.country_name;
    const population = item.fields.value;
    out.push({ country_name, population });
  }
});
out.sort((item1, item2) =>
  item1.country_name.localeCompare(item2.country_name)
);
fs.writeJsonSync(outpath, out, { spaces: 2 });
console.log('outpath', outpath);
console.log('out.length', out.length);
