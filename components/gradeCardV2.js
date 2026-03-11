import {calculateGrades} from "../api/reviewsApiV2.js";



//
// export function showGradeRows() {
//     let asideBlock = document.querySelector(".aside");
//
//     let card = document.createElement("div");
//     card.classList.add("card");
//
//     let total = document.createElement("div");
//     total.classList.add("total");
//     total.textContent = "Total";
//     card.appendChild(total);
//
//     let gradeAvg = document.createElement("div");
//     gradeAvg.classList.add("grade-avg");
//     gradeAvg.textContent = ""; //TODO to add from response
//     card.appendChild(gradeAvg);
//
//     //LINES WITH GRADES START
//     let grades = document.createElement("div");
//     grades.classList.add(".grades");
//     card.appendChild(grades);
//
//     for(let i = 5; i > 0; i--) {
//         // grade row
//         let gradeRow = document.createElement("div");
//         gradeRow.classList.add("grade-row");
//         grades.appendChild(gradeRow);
//
//         //grade row num
//         let gradeRowNum = document.createElement("div");
//         gradeRowNum.classList.add("grade-num");
//         gradeRowNum.textContent = `${i}`;
//         gradeRow.appendChild(gradeRowNum);
//
//         //grade row progress-bar
//         let progressBar = document.createElement("div");
//         progressBar.classList.add("progress-bar");
//         gradeRow.appendChild(progressBar);
//
//
//
//
//     }
//
//
//
//
//
//     asideBlock.appendChild(card);
// }



export async function showGradeRows(company) {
    // let company = document.querySelector('.company-name').textContent;
    let request = await calculateGrades(company);
    console.log(request);
    let avgGrade = request.avgRating;
    console.log(avgGrade)
    let grades = request.ratings;
    console.log(grades)
    console.log(grades.length)


    let gradeAvg = document.querySelector(".grade-avg");
    gradeAvg.textContent = avgGrade;

    //
    let progressFrontAll = document.querySelectorAll(".progress-front");

    let gradePctAll = document.querySelectorAll(".grade-pct");

    for (let i= 0; i < grades.length; i++) {
        progressFrontAll[i].style.width = `${grades[i].percentage}%`;
        gradePctAll[i].textContent = `${grades[i].percentage}%`;
    }
}