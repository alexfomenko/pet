export async function updateProfileData(data) {
    //1 - check if the server answered with 200, 400, 500
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
        if(!sendUpdateRequest.ok) {
            return {
                success: false,
                status: sendUpdateRequest.status,
                text: "Invalid json from the server",
                items: null,
            }
        }
       // 2 - check if we can parse the body
        let parsedResponseBody;
        try{
            parsedResponseBody = await sendUpdateRequest.json();
        }
        catch (error){
            return {
                success: false,
                status: sendUpdateRequest.status,
                text: sendUpdateRequest.statusText,
                items: null,
            }
        }
        // 3 - if we can parse the body successfully, send the response
        return {
            success: true,
            status: sendUpdateRequest.status,
            text: sendUpdateRequest.statusText,
            ...parsedResponseBody,
        }
    }
    catch (error) {
        throw new Error('Failed to send data');
    }
}
//
//
// ## Структура эндпоинта
//
// **1. TRY 1 - Сам запрос** — fetch с методом, заголовками, телом:
// ```js
// let response = await fetch('/url', {
//     method: "POST",
//     headers: { ... },
//     body: JSON.stringify(data),
// });
// ```
//
// **2. Проверка статуса** — сервер ответил с ошибкой:
//     ```js
// if (!response.ok) {
//     return { success: false, status: response.status, ... }
// }
// ```
//
//     **3.TRY 2 - Парсинг тела** — сервер ответил ок, но тело может быть сломано:
//     ```js
// try {
//     parsedBody = await response.json();
// } catch (error) {
//     return { success: false, text: 'Invalid JSON', ... }
// }
// ```
//
//     **4. Возврат результата** — всё прошло успешно:
//     ```js
// return { success: true, ...parsedBody }
// ```
//
//     **5. Внешний catch** — запрос вообще не ушёл (нет сети, сервер недоступен):
// ```js
// catch (error) {
//     throw new Error('Failed to send request')
// }
// ```
//
// ---
//
//     По сути это цепочка проверок от грубых ошибок к мелким:
//
//     ```
// сеть упала → статус плохой → JSON сломан → всё ок
// ```
