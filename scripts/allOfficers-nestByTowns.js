const fs = require('fs');
const mkdirp = require('mkdirp');
const d3 = require('d3');

const force_data = d3.csvParse(
    fs.readFileSync('../web-data/Master121218v1.csv', 'utf-8')
);

// const nestedByCount = d3.csvParse(
//     fs.readFileSync('../explore-data/nested-by-count.csv', 'utf-8')
// );

const lessForce_data = force_data.map(function (d) {
    return {
        'officerid': d.officerid,
        'first': d['Officer_1_first'],
        'last': d['Officer_1_last'],
        'dept': d['Town_county']
    }
});

const nestedData = d3.nest()
    .key(d=> d['dept'])
    .rollup(function(leaves) { return leaves.length; })
    .entries(lessForce_data);

const sortedData = nestedData.sort((a,b)=>{
    return (b.value-a.value)
}); // get the rankes


const dataOutput = d3.csvFormat(sortedData);
fs.writeFileSync('../explore-data/dept_by_count121218v1.csv', dataOutput);



