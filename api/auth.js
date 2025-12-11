export async function userLogIn(email, password) {
    try {
        let sendSignInRequest = await fetch(`/sign-in`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password}),
        });
        if (!sendSignInRequest.ok) {
            throw new Error('Failed to get data');
        }
        // console.log(await sendGetRequest.json())
        return await sendSignInRequest.json();
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function userSignUp(name,email, password, confirmPassword) {
    try {
        let sendSignUpRequest = await fetch(`/sign-up`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name, email, password, confirmPassword}),
        });
        if (!sendSignUpRequest.ok) {
            throw new Error('Failed to get data');
        }
        // console.log(await sendGetRequest.json())
        return await sendSignUpRequest.json();
    } catch (error) {
        console.log(error);
        throw error;
    }
}