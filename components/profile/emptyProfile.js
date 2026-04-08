export function renderEmptyProfile(){
    return `
                    <div class="empty-state">
                    <div class="empty-icon-box">
                        <div class="empty-icon">📝</div>
                    </div>

                    <h2 class="empty-title">
                        Add more data<br />
                        about yourself
                    </h2>

                    <button class="fill-btn btn" onclick="location.hash='fill'">Fill in your profile</button>
                </div>
`
}