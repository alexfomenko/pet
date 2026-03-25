import {calculateGrades} from "../api/reviewsApiV2.js";

export async function showGradeRows(company) {
    // let company = document.querySelector('.company-name').textContent;
    let request = await calculateGrades(company);
    let avgGrade = request.avgRating;
    let grades = request.ratings;

    let gradeAvg = document.querySelector(".grade-avg");
    gradeAvg.textContent = avgGrade;

    //
    let progressFrontAll = document.querySelectorAll(".progress-front");

    let gradePctAll = document.querySelectorAll(".grade-pct");

    for (let i= 0; i < grades.length; i++) {
        progressFrontAll[i].style.width = `${Math.round(grades[i].percentage)}%`;
        gradePctAll[i].textContent = `${Math.round(grades[i].percentage)}%`;
    }
}