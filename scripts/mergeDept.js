const fs = require('fs');
const mkdirp = require('mkdirp');
const d3 = require('d3');

const dept_slug = d3.csvParse(
    fs.readFileSync('../web-data/dept_slug.csv', 'utf-8')
);

const uof_dept = d3.csvParse(
    fs.readFileSync('../web-data/UOF_dept_geocoding.csv', 'utf-8')
);
console.log(dept_slug[0]);
console.log(uof_dept[0]);
const newArr = [];
uof_dept.forEach(t=>{
    const dept = t.location;
    const obj = dept_slug.find( i=> i['Town_county']==dept );
    if(obj){
        newArr.push( {
            'location': dept,
            'lat': +t.lat,
            'lng': +t.lng,
            'value': +t.value,
            'slug': obj['slug_pd']
        })
    } else{
        newArr.push( {
            'location': dept,
            'lat': +t.lat,
            'lng': +t.lng,
            'value': +t.value,
            'slug': ''
        })
    }
});
console.log(newArr[0]);
console.log(newArr[1]);
const dataOutput = d3.csvFormat(newArr);
fs.writeFileSync('../explore-data/all-officer-with-sid-slug-111418v1.csv', dataOutput);

// console.log(parsedNestedData[0])
// const json = JSON.stringify(parsedNestedData);
// fs.writeFile('../explore-data/top1000-officers-cases.json', json, 'utf8', (d)=>{
//     console.log(d)
// });
//

