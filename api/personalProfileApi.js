export async function updateProfileData(data) {
    //1 - check if the request was actually sent
    try{
        console.log('token:', localStorage.getItem('token'));
        let sendUpdateRequest = await fetch('/profile', {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data),
        });

        //2 - check if the server answered with 200, 400, 500
        if(!sendUpdateRequest.ok) {
            return {
                success: false,
                status: sendUpdateRequest.status,
                text: `Server responded with an error ${sendUpdateRequest.status}`,
                items: null,
            }
        }
       // 3 - check if we can parse the body
        let parsedResponseBody;
        try{
            parsedResponseBody = await sendUpdateRequest.json();
        }
        catch (error){
            return {
                success: false,
                status: sendUpdateRequest.status,
                text: "Failed to parse server response",
                items: null,
            }
        }
        // 4 - if we can parse the body successfully, send the response
        return {
            success: true,
            status: sendUpdateRequest.status,
            text: sendUpdateRequest.statusText,
            ...parsedResponseBody,
        }
    }
    catch (error) {
        return {
            success: false,
            status: null,
            text: "Network error, try again",
            items: null,
        }
    }
}
// ## Структура эндпоинта
// **1. TRY 1 - Сам запрос** — fetch с методом, заголовками, телом:
// ```js
// let response = await fetch('/url', {
//     method: "POST",
//     headers: { ... },
//     body: JSON.stringify(data),
// });
// **2. Проверка статуса** — сервер ответил с ошибкой:
//     ```js
// if (!response.ok) {
//     return { success: false, status: response.status, ... }
// }
//     **3.TRY 2 - Парсинг тела** — сервер ответил ок, но тело может быть сломано:
//     ```js
// try {
//     parsedBody = await response.json();
// } catch (error) {
//     return { success: false, text: 'Invalid JSON', ... }
// }
//     **4. Возврат результата** — всё прошло успешно:
//     ```js
// return { success: true, ...parsedBody }
//     **5. Внешний catch** — запрос вообще не ушёл (нет сети, сервер недоступен):
// ```js
// catch (error) {
//     throw new Error('Failed to send request')
// }
// ---
//     По сути это цепочка проверок от грубых ошибок к мелким:
// сеть упала → статус плохой → JSON сломан → всё ок

export async function getOwnProfileData() {
    // 1
    try{
        let sendGetProfileRequest = await fetch('/profile', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        // 2
        if(!sendGetProfileRequest.ok) { //check 200, 400, 500
            return {
                success: false,
                status: sendGetProfileRequest.status,
                text: `Server responded with an error ${sendGetProfileRequest.status}`, //200, 400 ...
                items: null,
            }
        }
  //  3
        let parsedJsonBody;
        try{
            parsedJsonBody = await sendGetProfileRequest.json();
        }
        catch (error) {
            return {
                success: false,
                status: sendGetProfileRequest.status,
                text: "Failed to parse server response",
                items: null,
            }
        }
        // 4
        return {
            success: true,
            status: sendGetProfileRequest.status,
            text: sendGetProfileRequest.statusText,
            ...parsedJsonBody,
        }

    }
    catch (error) {
        throw new Error('Failed to send data');
    }
}

//todo where to get userId - dataset
export async function getProfileData(userId) {
    try {
        let url = `/users/${userId}`;
        let sendGetProfileRequest = await fetch(url);

        if (!sendGetProfileRequest.ok) {
            return {
                success: false,
                status: sendGetProfileRequest.status,
                text: sendGetProfileRequest.statusText,
                items: null,
            }
        }

        let parsedJson;
        try{
            parsedJson = await sendGetProfileRequest.json();
        }
        catch (error){
            return {
                success: false,
                status: sendGetProfileRequest.status,
                text: "Failed to parse server response",
                items: null,
            }
        }

        return {
            success: true,
            status: sendGetProfileRequest.status,
            text: sendGetProfileRequest.statusText,
            ...parsedJson,
        }
    }
    catch(error) {
            throw new Error("Failed to send data");
    }
}

export async function getUserReviews() {
    let userReviews;
    try{
       userReviews = await fetch('/profile/reviews', {
           method: "GET",
           headers: {
               'Content-type': 'application/json',
               "Authorization": `Bearer ${localStorage.getItem('token')}`
           }
       });

       if(!userReviews.ok){
           return {
               success: false,
               status: userReviews.status,
               text: `Server responded with an error ${userReviews.status}`,
               items: null,
           }
       }

        let parsedResponse;
        try{
            parsedResponse = await userReviews.json();
        }
        catch (error) {
            return {
                success: false,
                status: userReviews.status,
                text: "Failed to parse the response",
                items: null,
            }
        }

        return {
            success: true,
            status: userReviews.status,
            text: userReviews.statusText,
            ...parsedResponse,
        }
    }

    catch (error){
        return {
            success: false,
            status: null,
            text: "Network error, try again",
            items: null,
        }
    }
}

export async function uploadProfileAvatar(formData) { //todo update endpoint in case json will be sent

    // const formData = new FormData();
    // formData.append('avatar', file);
    // (file) instead of formData

    //1 - check if the request was actually sent
    try{
        console.log('token:', localStorage.getItem('token'));
        let sendUpdateRequest = await fetch('/profile/avatar', {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData,
            // body: file,
            //content type is set by browser
        });

        //2 - check if the server answered with 200, 400, 500
        if(!sendUpdateRequest.ok) {
            return {
                success: false,
                status: sendUpdateRequest.status,
                text: `Server responded with an error ${sendUpdateRequest.status}`,
                avatarUrl: null,
            }
        }
        // 3 - check if we can parse the body
        let parsedResponseBody;
        try{
            parsedResponseBody = await sendUpdateRequest.json();
        }
        catch (error){
            return {
                success: false,
                status: sendUpdateRequest.status,
                text: "Failed to parse server response",
                avatarUrl: null,
            }
        }
        // 4 - if we can parse the body successfully, send the response
        return {
            success: true,
            status: sendUpdateRequest.status,
            text: sendUpdateRequest.statusText,
            ...parsedResponseBody,
        }
    }
    catch (error) {
        return {
            success: false,
            status: null,
            text: "Network error, try again",
            avatarUrl: null,
        }
    }
}

//todo
// deleteProfileAvatar()
// validateAvatarFile(file)
// PUT    /profile/avatar
// DELETE /profile/avatar
// GET    /uploads/avatars/:filename

// Серверный процесс:
//     Проверить token
//       ↓
// Принять файл, максимум 5 MB
//       ↓
// Проверить настоящий формат изображения
//       ↓
// Обрезать по центру и уменьшить до 512×512
//       ↓
// Сохранить как UUID.webp
//       ↓
// Записать avatarUrl в пользователя
//       ↓
// Вернуть { avatarUrl }
