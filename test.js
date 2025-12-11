// let array = ['iiii', 'aa', 'rrr', 'tt', 'iiii', 'iiii', 'iiii', 'tt', 'ooo', 'tt', 'aa']
// let object1 = {
//     'aa': 2,
//     'tt': 1,
// };
// function findDuplicates(array) {
//     let object2 = {};
//     for (let item1 of array) {
//         let duplicates = true;
//         for (let item2 of array) {
//             if (item1 === item2) {
//                 duplicates = true;
//             }
//         }
//         if(duplicates === true && !object2.hasOwnProperty(item1)) {
//             object2[item1] = 1;
//         }
//         else {
//             object2[item1] += 1
//         }
//     }
//     return object2;
// }
//
// console.log(findDuplicates(array))

// function findUnique(array) {
//     let array2 = [];
//     for (let item1 of array) {
//         let count = 0;
//         for (let item2 of array) {
//             if (item1 === item2) {
//                count++;
//             }
//         }
//         if(count === 1) {
//             array2.push(item1);
//         }
//     }
//     return array2;
// }
//
// console.log(findUnique(array))

// let string = 'kedi';
//
// function check(string) {
//     let newString = [];
//     for (let i = string.length-1; i >= 0; i--) {
//         newString.push(string[i])
//     }
//     return newString.join('');
// }
//
// console.log(check(string))

// let object1 = {
//     name: "kuskkow",
//     year: 1,
// };
//
// function copyObject(object1) {
//    // let object2 = Object.assign(object1);
//    //  let object2 ={...object1};
//     let object2 ={};
//     for (let key in object1) {
//         object2[key] = object1[key];
//     }
//    return object2;
// }
//
// console.log(copyObject(object1))

let object1 = {
    name: "kuskkow",
    year: {
        born: 1992,
        graduated: 2000,
    },
};

function deepCopyObject(object1) {
    // let object2 =JSON.parse(JSON.stringify(object1));
    // let object2 =structuredClone(object1);
    if (typeof object1 !== "object" || object1 === null) {
        return object1;
    }

    if(Array.isArray(object1)) {
        return object1.map(item => deepCopyObject(item))
    }
    let object2 = {};
    for (let key in object1) {
        object2[key] = deepCopyObject(object1[key])
    }
    return object2;
}

console.log(deepCopyObject(object1))