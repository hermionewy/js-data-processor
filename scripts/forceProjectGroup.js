const fs = require('fs');
const mkdirp = require('mkdirp');
const d3 = require('d3');

const force_data = d3.csvParse(
    fs.readFileSync('../web-data/Master92818v3.csv', 'utf-8')
);

const nestedData = d3.nest()
    .key(d=> d['officerid'])
    .rollup(function(leaves) { return leaves.length; })
    .entries(force_data);

const sortedData = nestedData.sort((a,b)=>{
    return (b.value-a.value)
});

const tops = sortedData.slice(0, 1000);

const topIDs=getTopIDs(tops); //get top officers' ids

const subDataset = getTopDataByIDs(topIDs, force_data);
const unique = [...new Set(subDataset.map(item => item['county']))]; // top 1000 officers are from 146 towns, 20 counties


const nested = d3.nest()
    .key( d=> d['officerid'])
    .key( d=> d['year']).sortKeys(d3.ascending)
    .entries(subDataset);

const parsedNestedData = parseNestData(nested);

// const dataOutput = d3.csvFormat(subDataset);
// fs.writeFileSync('../explore-data/top1000-officers-cases.csv', dataOutput);

// console.log(parsedNestedData[0])
// const json = JSON.stringify(parsedNestedData);
// fs.writeFile('../explore-data/top1000-officers-cases.json', json, 'utf8', (d)=>{
//     console.log(d)
// });
//
// getYearlyAverageData(force_data);

// group by townCounty, then caseid
console.log('Nested by town and case number: ');
const nestByTownAndCaseNum = d3.nest()
    .key(d=> d['Town_county'])
    .key(d=> d['Case_report_no'])
    .rollup(d=>d.length)
    .entries(force_data);
var arr=[];
nestByTownAndCaseNum.forEach( d=>{
    arr.push({
        'key': d.key,
        'value': d.values.length
    })
});
arr.sort((a, b)=> (b.value-a.value) );
const sum = arr.reduce( (acc, num) => {
    return acc+num.value
}, 0);
//Camden 1778/41897 = 4.24% cases
console.log(sum);
console.log(arr);


function getYearlyAverageData(data) {
    const officerIds = [...new Set(data.map(item => item.officerid))];
    const dataset = getTopDataByIDs(officerIds, force_data);
    const nestedByYear = d3.nest()
        .key( d=> d['year']).sortKeys(d3.ascending)
        .rollup( leaves => leaves.length/officerIds.length)
        .entries(dataset);

}


function parseNestData(data) {
    let parsedData = [];
    data.forEach( d=>{
        let arr = [
            {'key':2012, 'count': 0, values: []},
            {'key':2013, 'count': 0, values: []},
            {'key':2014, 'count': 0, values: []},
            {'key':2015, 'count': 0, values: []},
            {'key':2016, 'count': 0, values: []},
        ];
        const nestByYear = d.values;

        nestByYear.forEach( y => {
            switch(y.key) {
                case '2012':
                    arr[0].values = y.values;
                    arr[0].count = y.values.length;
                    break;
                case '2013':
                    arr[1].values = y.values;
                    arr[1].count = y.values.length;
                    break;
                case '2014':
                    arr[2].values = y.values;
                    arr[2].count = y.values.length;
                    break;
                case '2015':
                    arr[3].values = y.values;
                    arr[3].count = y.values.length;
                    break;
                case '2016':
                    arr[4].values = y.values;
                    arr[4].count = y.values.length;
                    break;
            }
        });
        const allforce = nestByYear.reduce( (acc, currentValue) => (acc + currentValue.values.length), 0 );
        parsedData.push({
            'key': d.key,
            'count': allforce,
            'values': arr
        })
    })
    return parsedData
}

function getTopDataByIDs(ids, data) {
    let arr = [];
    data.forEach((d,i)=>{
        if(ids.indexOf(d['officerid'])>-1){
            d['year'] = parseYear(d['Incident_date']);
            arr.push({
                "year": d['year'],
                "county": d['County'],
                "town": d['Town'],
                "incidentDate": d['Incident_date'],
                "incidentTime": d['Incident_time'],
                "city": d['Location_city'],
                "officerName": (d['Officer_1_first'] + ' ' +d['Officer_1_last']),
                "officerid": d['officerid'],
                "location": d['Location_detail'],
                "type": d['Incident_type'],
                "officerSex": d['Officer_1_sex'],
                "officerRace": d['Officer_1_race'],
                "townCounty": d['Town_county']
            })
        }
    });
    return arr
}

function parseDate(str) {
    const arr = str.split('/');
    const m = +arr[0],
        d = +arr[1],
        y = (+arr[2])<20? (+arr[2]+2000) : (+arr[2]);

}
function parseYear(str) {
    //4/14/2012
    const arr = str.split('/');
    const m = +arr[0],
        d = +arr[1],
        y = (+arr[2])<20? (+arr[2]+2000) : (+arr[2]);
    return y
}

function getTopIDs(data){
    let arr=[];
    data.forEach((d)=>{
        if (d.key!=''){
            arr.push(d.key)
        }
    });
    return arr
}
