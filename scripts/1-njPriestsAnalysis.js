const fs = require('fs');
const mkdirp = require('mkdirp');
const d3 = require('d3');

const priestData = d3.csvParse(
    fs.readFileSync('../explore-data/NJ Credibly Accused Priests Catholic Dioceses Feb14.csv', 'utf-8')
);
console.log(priestData[0]);
let newData=[];
priestData.forEach( priest=>{
    const churches = priest['Churches'];
    if(churches){
        const churchArr = churches.split(', ');
        churchArr.forEach( church =>{
            newData.push({
                'lastName': priest['Last_name'],
                'firstName': priest['First_name_MI'],
                'diocese': priest['Diocese'],
                'church': parserChurch(church),
                'born': priest['Year Born'],
                'ordained': priest['Year Ordained'],
                'victim': priest['Victim Number'],
                'status': priest['Status']
            })
        })
    } else{
        newData.push({
            'lastName': priest['Last_name'],
            'firstName': priest['First_name_MI'],
            'diocese': priest['Diocese'],
            'church': priest['Churches'],
            'born': priest['Year Born'],
            'ordained': priest['Year Ordained'],
            'victim': priest['Victim Number'],
            'status': priest['Status']
        })
    }

});

function parserChurch (str){
    const newStr = str.split(' (');
    const townStr = (newStr.length>1)? (newStr[1]).replace(')', '') : '';
    const addStr = (townStr)? (', '+townStr) : '';
    const address = newStr[0] + addStr;
    return address;
}
console.log(newData[0]);

const dataOutput = d3.csvFormat(newData);
fs.writeFileSync('../NJPriests/NJPriestsDataParsedFeb14v2.csv', dataOutput);

// console.log(parsedNestedData[0])
// const json = JSON.stringify(parsedNestedData);
// fs.writeFile('../explore-data/top1000-officers-cases.json', json, 'utf8', (d)=>{
//     console.log(d)
// });
//

