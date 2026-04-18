export function renderProfileTabs(){
    return `
                <nav class="profile-tabs">
                <a class="tab" onclick="location.hash='profile'">Profile</a>
                <a class="tab" onclick="location.hash='reviews'">My reviews</a>
            </nav>
`
}

// export function renderProfileTabs(activeTab = 'reviews') {
//     const tabs = [
//         { id: 'reviews',       label: 'Мои отзывы' },
//         { id: 'favorites',     label: 'Избранное'  },
//         { id: 'settings',      label: 'Настройки'  },
//         { id: 'notifications', label: 'Уведомления'},
//     ];
//
//     return `
//     <div class="profile-tabs">
//       ${tabs.map(tab => `
//         <button class="tab ${tab.id === activeTab ? 'tab--active' : ''}"
//                 data-tab="${tab.id}">
//           ${tab.label}
//         </button>
//       `).join('')}
//     </div>
//   `;
// }