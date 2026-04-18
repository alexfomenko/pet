export function renderReviewsProfile() {
    return `         
         <div class="reviews-body">
                <div class="reviews-toolbar card">
                    <label for="sorting">
                    <select id="sorting">
                        <option>Sort by</option>
                        <option>Newest</option>
                        <option>Oldest</option>
                    </select>
                    </label>
                </div>
                <div class="reviews-list">

<!--                    ARTICLE-->
                    <article class="review card">

                        <!--                            Review head-->
                        <div class="review-head">
                            <div class="company">
                                <div class="company-about">Kedi Company</div>
                            </div>

                            <div class="stars">
                                <div class="stars-back">
                                    <div class="star"></div>
                                    <div class="star"></div>
                                    <div class="star"></div>
                                    <div class="star"></div>
                                    <div class="star"></div>
                                </div>
                                <div class="stars-front" style="width: 70%;">
                                    <div class="star"></div>
                                    <div class="star"></div>
                                    <div class="star"></div>
                                    <div class="star"></div>
                                    <div class="star"></div>
                                </div>


                            </div>

                        </div>

                        <!--                            Review body-->
                        <p class="review-text" contenteditable="true">Сильная команда и спокойная коммуникация. Процессы понятные, есть пространство для роста.
                            Нагрузку иногда нужно балансировать, но в целом впечатления очень хорошие.</p>

                        <!--                            Review footer-->

                        <div class="review-footer">
                            <div class="date">January 15</div>
                            <div class="review-footer-buttons">
                                <button class="edit-review-btn ghost-btn">Edit</button>
                                <button class="delete-review-btn ghost-btn">Delete</button>
                            </div>
                        </div>
                    </article>
<!--                    ARTICLE END-->

                </div>
                <div class="reviews-pagination"></div>
            </div>
`;
}
