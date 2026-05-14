export function renderCompletedProfile(user){
    let company = user?.company ?? '-';
    let city = user?.city ?? '-';
    let bio = user?.bio ?? '-';

    return `
<div class="profile-body card">
       <div class="completed-state">
                                <div class="success-banner">
                                    <strong>The profile has been filled out</strong>
                                </div>
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

// I'm a Frontend Developer with 5 years of experience developing web interfaces. I specialize in React, TypeScript, and modern UI solutions. I love creating fast and user-friendly interfaces.