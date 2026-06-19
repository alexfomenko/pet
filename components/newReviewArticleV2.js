export function renderReviewsV2(reviews) {
    let reviewsContainer = document.querySelector('.content-reviews');
    reviewsContainer.innerHTML = "";
    // console.log(reviewsContainer);
    reviews.forEach((review) => {
        let article = document.createElement('article');
        article.classList.add('review', 'card');

        // head
        let reviewHead = document.createElement('div');
        reviewHead.classList.add('review-head');
        article.appendChild(reviewHead);

        //head-1 LOGO
        let person = document.createElement('div');
        person.classList.add('person');
        reviewHead.appendChild(person);

        //head-1-logo
        let personLogo = document.createElement('div');
        personLogo.classList.add('person-logo');
        personLogo.textContent = ""; // TO BE ADDED
        person.appendChild(personLogo);

        //head-1-data
        let personData = document.createElement('div');
        personData.classList.add('person-data');
        person.appendChild(personData);

        //head-1-data-personDataName
        let personDataName = document.createElement('a');
        personDataName.classList.add('person-name');
        let userName = localStorage.getItem('userName') || "Anonymous";
        personDataName.textContent = `${review.userName}` || userName;
        personDataName.href = `/html/personalProfile?userId=${review.userId}`;
        personData.appendChild(personDataName);

        //head-1-data-personDataAbout
        let personDataAbout = document.createElement('div');
        personDataAbout.classList.add('person-about');
        personDataAbout.textContent = ""; // TO BE ADDED
        personData.appendChild(personDataAbout);

        //head-2 STARS
        let stars = document.createElement('div');
        stars.classList.add('stars');
        reviewHead.appendChild(stars);

        let starsBack = document.createElement('div');
        starsBack.classList.add('stars-back');
        stars.appendChild(starsBack);

        for(let i=0; i < 5; i++){
            let star =  document.createElement('div');
            star.classList.add('star');
            starsBack.appendChild(star);
        }

        let starsFront = document.createElement('div');
        starsFront.classList.add('stars-front');
        stars.appendChild(starsFront);

        for(let i=0; i < 5; i++){
            let star =  document.createElement('div');
            star.classList.add('star');
            starsFront.appendChild(star);
        }

        let percentage = (review.rating / 5) * 100;
        starsFront.style.width = percentage + '%';
        //

        // body
        let reviewText = document.createElement('p');
        reviewText.classList.add('review-text');
        reviewText.textContent = review.review;
        article.appendChild(reviewText);

        //footer
        let reviewFooter = document.createElement('div');
        reviewFooter.classList.add('review-footer');
        article.appendChild(reviewFooter);

        //footer - date

        let reviewFooterDate = document.createElement('div');
        reviewFooterDate.classList.add('date');

        reviewFooterDate.textContent =  new Date(review.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
        reviewFooter.appendChild(reviewFooterDate);

        //
        reviewsContainer.appendChild(article);
    })
}
