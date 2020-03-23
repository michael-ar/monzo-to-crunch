const fs = require('fs');
const csv = require('csvtojson');
const { parse } = require('json2csv');

const csvFilePath = `${__dirname}/input.csv`;
const previousBalance = process.argv[2];

if (!previousBalance) {
  console.log('pass in previous balance arg');
  process.exit(1);
}

const padNumber = number => (number < 10 ? `0${number}` : number);
const parseCreated = input => {
  const date = new Date(input);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${padNumber(day)}-${padNumber(month)}-${year}`;
};

let balance = parseFloat(previousBalance);
let transformed = [];

csv({
  colParser: {
    created: parseCreated,
    balance: () => balance,
  },
})
  .fromFile(csvFilePath)
  .subscribe(line => {
    balance += parseFloat(line.Amount);
    transformed.push({ ...line, balance: balance.toFixed(2) });
  })
  .then(x => {
    const csv = parse(transformed, { fields: Object.keys(transformed[0]) });
    fs.writeFileSync(`${__dirname}/output.csv`, csv);
  });
