const fs = require('fs');
const mkdirp = require('mkdirp');
const d3 = require('d3');

const priestData = d3.csvParse(
    fs.readFileSync('../explore-data/NJPriests/NJ_bad_priests_geocode - OriginalSheetWithGeo.csv', 'utf-8')
);

const churchAddress = d3.csvParse(
    fs.readFileSync('../explore-data/NJPriests/churchAddressIndex.csv', 'utf-8')
);

const standardizedAddress = d3.csvParse(
    fs.readFileSync('../explore-data/NJPriests/updated_standardized_Address0215.csv', 'utf-8')
);

console.log(priestData[0]);
console.log(standardizedAddress[0]);

// const parsedChurchAddress = churchAddress.map( church =>{
//     if ( !church['Change to:'] ){
//         church['Change to:'] = church['Row Labels']
//     }
//     return church;
// });

const updatedPriestData = priestData.map( priest =>{
    //priest ['updateChurchName'] = removeLastComma( priest.church ) ;
    standardizedAddress.forEach( addr =>{
        //if( addr['Change to:'] ){
        if( removeLastComma( priest.church ) == removeLastComma (addr['Row Labels']) ){
            priest ['updateChurchName'] = addr['updateChurchName'];
            priest ['lat'] = +addr['Latitude'];
            priest ['lng'] = +addr['Longitude'];
        }

        //}
    });
    return priest;
});

console.log(updatedPriestData);
//console.log(updatedPriestData[0], updatedPriestData[10], updatedPriestData[100]);
//priestData



function removeLastComma( str ) {
    if( str.slice(-2) == ', '){
        return str.substring (0, str.length-2 )
    } else if ( str.slice(-1) == ',' ){
        return str.substring (0, str.length-1 )
    }else {
        return str;
    }
}

//
// let newData=[];
// priestData.forEach( priest=>{
//     const churches = priest['Churches'];
//     if(churches){
//         const churchArr = churches.split(', ');
//         churchArr.forEach( church =>{
//             newData.push({
//                 'lastName': priest['Last_name'],
//                 'firstName': priest['First_name_MI'],
//                 'diocese': priest['Diocese'],
//                 'church': parserChurch(church),
//                 'born': priest['Year Born'],
//                 'ordained': priest['Year Ordained'],
//                 'victim': priest['Victim Number'],
//                 'status': priest['Status']
//             })
//         })
//     } else{
//         newData.push({
//             'lastName': priest['Last_name'],
//             'firstName': priest['First_name_MI'],
//             'diocese': priest['Diocese'],
//             'church': priest['Churches'],
//             'born': priest['Year Born'],
//             'ordained': priest['Year Ordained'],
//             'victim': priest['Victim Number'],
//             'status': priest['Status']
//         })
//     }
//
// });
//
// function parserChurch (str){
//     const newStr = str.split(' (');
//     const townStr = (newStr.length>1)? (newStr[1]).replace(')', '') : '';
//     const addStr = (townStr)? (', '+townStr) : '';
//     const address = newStr[0] + addStr;
//     return address;
// }
// console.log(newData[0]);

const dataOutput = d3.csvFormat(updatedPriestData);
fs.writeFileSync('../NJPriests/updatedPriestData0215v1.csv', dataOutput);

// console.log(parsedNestedData[0])
// const json = JSON.stringify(parsedNestedData);
// fs.writeFile('../explore-data/top1000-officers-cases.json', json, 'utf8', (d)=>{
//     console.log(d)
// });
//

