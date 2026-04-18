export function renderProfileHeader(){
    return `           
            <div class="profile-header card">
                <div class="company-about">
                    <img src="https://www.osh.by/wp-content/uploads/2023/12/1041436899_0_206_2905_1840_1920x0_80_0_0_c7022893b761781d76fe592010d14bd2.jpg" alt="photo" width="200" height="100">
                    <div class="account-data">
                        <h1 class="person-name">Oleh Shevtsov</h1>
                        <p class="person-title">Software Developer</p>
                        <span class="person-email">olehshevtsov@gmail.com</span>
                    </div>
                </div>
                        <button class="edit-btn btn">Edit</button>
            </div>`
}

// export function renderProfileHeader(user) {
//     return `
//     <div class="profile-header">
//       <img class="profile-avatar" src="${user.avatar}" alt="avatar">
//       <div class="profile-info">
//         <h2>${user.name}</h2>
//         <p>${user.role}</p>
//         <span class="profile-email">${user.email}</span>
//       </div>
//       <button class="btn-edit">Редактировать ▾</button>
//     </div>
//   `;
// }