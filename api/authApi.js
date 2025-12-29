// export async function userLogIn(email, password) {
//     try {
//         let sendSignInRequest = await fetch(`/sign-in`, {
//             method: 'POST',
//             headers: {'Content-Type': 'application/json'},
//             body: JSON.stringify({email, password}),
//         });
//         if (!sendSignInRequest.ok) {
//             throw new Error('Failed to get data');
//         }
//         return await sendSignInRequest.json();
//     } catch (error) {
//         // console.log(error);
//         throw error;
//     }
// }

export async function userLogIn(email, password) {
    try {
        let sendSignInRequest = await fetch(`/sign-in`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password}),
        });

        let parsedJson;
        try{
            parsedJson = await sendSignInRequest.json();
        }
        catch (error) {
            parsedJson = null;
        }

        if (!sendSignInRequest.ok) {
          return {
                success: false,
                status: sendSignInRequest.status,
                statusText: sendSignInRequest.statusText,
                message: parsedJson?.message || `Error ${sendSignInRequest.status}`,
                token: null,
                user: null,
            }
        }
        // return parsedJson;
        return {
            success: true,
            status: sendSignInRequest.status,
            responseCode: sendSignInRequest.statusText,
            message: parsedJson?.message || `Ok`,
            token: parsedJson?.token,
            user: parsedJson?.user,
        }
    } catch (error) {
        // console.log(error);
        throw error;
    }
}

// export async function userSignUp(name,email, password, confirmPassword) {
//     try {
//         let sendSignUpRequest = await fetch(`/sign-up`, {
//             method: 'POST',
//             headers: {'Content-Type': 'application/json'},
//             body: JSON.stringify({name, email, password, confirmPassword}),
//         });
//         if (!sendSignUpRequest.ok) {
//             throw new Error('Failed to get data');
//         }
//         // console.log(await sendGetRequest.json())
//         return await sendSignUpRequest.json();
//     } catch (error) {
//         console.log(error);
//         throw error;
//     }
// }

export async function userSignUp(name,email, password, confirmPassword) {
    try {
        let sendSignUpRequest = await fetch(`/sign-up`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name, email, password, confirmPassword}),
        });
        let parsedJsonBody;
        try {
            parsedJsonBody = await sendSignUpRequest.json();
        }
        catch (error) {
            parsedJsonBody = null;
        }
        if (!sendSignUpRequest.ok) {
            return {
                success: false,
                status: sendSignUpRequest.status,
                statusText: sendSignUpRequest.statusText,
                message: parsedJsonBody?.message || `Error ${sendSignUpRequest.status}`,
                token: null,
                user: null,
            }
        }
        return {
            success: true,
            status: sendSignUpRequest.status,
            statusText: sendSignUpRequest.statusText,
            message: parsedJsonBody?.message || `Ok`,
            token: parsedJsonBody?.token,
            user: parsedJsonBody?.user,
        };
    } catch (error) {
        // console.log(error);
        throw error;
    }
}