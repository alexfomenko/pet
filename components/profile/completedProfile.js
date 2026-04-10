export function renderCompletedProfile(){
    return `
       <div class="completed-state">
                                <div class="success-banner">
                                    <strong>The profile has been filled out</strong>
                                </div>
                                <div class="done-layout">
                                    <div class="about-card card">
                                        <h3>About yourself</h3>
                                        <p>About me
                                            I'm a Frontend Developer with 5 years of experience developing web interfaces. I specialize in React, TypeScript, and modern UI solutions. I love creating fast and user-friendly interfaces.</p>
                                    </div>

                                    <div class="side-stack">
                                        <div class="mini-card card">
                                            <span>Company</span>
                                            <strong>Kedi</strong>
                                        </div>
                                        <div class="mini-card card">
                                            <span>City</span>
                                            <strong>Istanbul</strong>
                                        </div>
                                    </div>

                                </div>

                            </div>
    `

}