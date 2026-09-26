export function renderCompletedProfile(user, canEdit = true){
    let company = user?.company ?? '-';
    let city = user?.city ?? '-';
    let bio = user?.bio ?? '-';
    if (!user || user.id == null) {
        return `<p class="empty-profile">No account registered for the user</p>`;
    }

    return `
<div class="profile-body card">
       <div class="completed-state">
                                ${canEdit ? `<div class="success-banner">
                                    <strong>The profile has been filled out</strong>
                                    <button type="button" id="edit-profile" class="btn">Edit</button>
                                </div>` : ''}
                                <div class="done-layout">
                                    <div class="about-card card">
                                        <h3>About yourself</h3>
                                        <p> ${bio} </p>
                                    </div>

                                    <div class="side-stack">
                                        <div class="mini-card card">
                                            <span>${company}</span>
                                            <strong>${city}</strong>
                                        </div>
                                        <div class="mini-card card">
                                            <span>City</span>
                                            <strong>Istanbul</strong>
                                        </div>
                                    </div>

                                </div>

                            </div>
                            </div>
    `
}

export function handleEditCompletedProfile () {
    let editProfileBtn = document.getElementById('edit-profile');
    if (!editProfileBtn) return;
    editProfileBtn.addEventListener('click', () => {
        location.hash = 'fill';
    })
}
