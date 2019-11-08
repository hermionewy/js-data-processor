const fs = require('fs');
const mkdirp = require('mkdirp');
const d3 = require('d3');

const force_data = d3.csvParse(
    fs.readFileSync('../web-data/Master010419v3.csv', 'utf-8')
);

const nestedByCount = d3.csvParse(
    fs.readFileSync('../explore-data/officer_by_count010419v3.csv', 'utf-8')
);
console.log(nestedByCount[0]);
console.log(force_data[0]);

const lessForce_data = nestedByCount.map(function (d) {
    return {
        'officerid': d.key,
        'sId': d.sId,
        'count': d.value,
        'dept': getDept(d),
        'name': getName(d)
    }
});
//
function getDept(d) {
    const found = force_data.find( f=> f.officerid == d.key );
    return found['Town_county'];
}
function getName(d) {
    const found = force_data.find( f=> f.officerid == d.key );
    return found['Officer_1_first']+' '+ found['Officer_1_last']
}
//
// console.log(lessForce_data[0]);

const dataOutput = d3.csvFormat(lessForce_data);
fs.writeFileSync('../explore-data/all-officer-with-sid-010419v3.csv', dataOutput);

// console.log(parsedNestedData[0])
// const json = JSON.stringify(parsedNestedData);
// fs.writeFile('../explore-data/top1000-officers-cases.json', json, 'utf8', (d)=>{
//     console.log(d)
// });
//

