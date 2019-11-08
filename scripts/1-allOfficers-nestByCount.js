const fs = require('fs');
const mkdirp = require('mkdirp');
const d3 = require('d3');

const force_data = d3.csvParse(
    fs.readFileSync('../web-data/Master010419v3.csv', 'utf-8')
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
    .key(d=> d['officerid'])
    .rollup(function(leaves) { return leaves.length; })
    .entries(lessForce_data);

const sortedData = nestedData.sort((a,b)=>{
    return (b.value-a.value)
}); // get the rankes

const found = lessForce_data.find( f=> f.officerid==sortedData[0].key );
console.log(found);

const addSidArr = [];
for(var j=62; j>=1;j--){
    const newDataset = sortedData.filter(d=>d.value==j);
    const addSid = newDataset.map((t,i)=>{
        addSidArr.push({
            'key': t.key,
            'value': t.value,
            'sId': i
        });
    });
}

const dataOutput = d3.csvFormat(addSidArr);
fs.writeFileSync('../explore-data/officer_by_count010419v3.csv', dataOutput);



