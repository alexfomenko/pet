export function renderFillProfile(){
    return `
                    <div class="fill-state">
                    <div class="fill-state-header">
                        <h1>Fill out your profile</h1>
                    </div>

                    <div class="fill-state-body">
                        <label class="fill-state-label">
                            <span>Company</span>
                            <input type="text" placeholder="For example, Kedi Company">
                        </label>

                        <label class="fill-state-label">
                            <span>City</span>
                            <input type="text" placeholder="For example, Istanbul">
                        </label>

                        <label class="fill-state-label fill-state-label-full">
                            <span>About yourself</span>
                            <textarea placeholder="Tell about your experience, specialization, interests"></textarea>
                        </label>
                    </div>

                    <div class="fill-state-footer">
                        <button class="ghost-btn" onclick="location.hash='empty'">Cancel</button>
                        <button class="btn" onclick="location.hash='completed'">Save and continue</button>
                    </div>

                </div>
`
}