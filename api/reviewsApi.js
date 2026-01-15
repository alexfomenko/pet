

export async function getAllCompanies() {
    try {
        let sendGetCompaniesRequest = await fetch(`/get-companies`);
        let parsedJsonBody;
        try{
            parsedJsonBody = await sendGetCompaniesRequest.json();
        }
        catch (error) {
            parsedJsonBody = null;
        }
        if (!sendGetCompaniesRequest.ok) {
            // throw new Error('Failed to get data'); // instead of this
           return  {
               success: false,
               status: sendGetCompaniesRequest.status,
               statusText: sendGetCompaniesRequest.statusText,
               items: null,
            }
        }
        // console.log(await sendGetRequest.json())
        // return await sendGetCompaniesRequest.json(); // instead of this
        console.log(parsedJsonBody);
        return {
            success: true,
            status: sendGetCompaniesRequest.status,
            statusText: sendGetCompaniesRequest.statusText,
            // items: parsedJsonBody?.allCompanies, // 1st option - object
            items: parsedJsonBody, // 2nd option - array

        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// export async function getReviews(page, limit, company = null) {
//     try {
//         let sendGetRequest = await fetch(`/get-review?page=${page}&limit=${limit}`);
//         if (!sendGetRequest.ok) {
//             throw new Error('Failed to get data');
//         }
//         // console.log(await sendGetRequest.json())
//         return await sendGetRequest.json();
//     } catch (error) {
//         console.log(error);
//         throw error;
//     }
// }

// export async function getReviews(page, limit, company = null) {
//     try {
//         let url = `/get-review?page=${page}&limit=${limit}`;
//
//         // checking if company parameter was passed
//         if(company && company !=="all") url += `&company=${encodeURIComponent(company)}`;
//
//         let sendGetRequest = await fetch(url);
//         if (!sendGetRequest.ok) {
//             throw new Error('Failed to get data');
//         }
//         // console.log(await sendGetRequest.json())
//         return await sendGetRequest.json();
//     } catch (error) {
//         console.log(error);
//         throw error;
//     }
// }

export async function getReviews(page, limit, company = null, sort = null) {
    try {
        let url = `/get-review?page=${page}&limit=${limit}`;

        // checking if company parameter was passed
        if(company && company !=="all") url += `&company=${encodeURIComponent(company)}`;
        if(sort && sort !=="no_sort") url+= `&sort=${sort}`; // added

        let sendGetRequest = await fetch(url);
        if (!sendGetRequest.ok) {
            throw new Error('Failed to get data');
        }
        // console.log(await sendGetRequest.json())
        return await sendGetRequest.json();
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function sendPostRequest(data) {
    try {
        let sendRequest = await fetch('/submit-review', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        });
        let json = await sendRequest.json();
        return {ok: sendRequest.ok, status: sendRequest.status, json};
    }
    catch (error) {
        throw new Error('Failed to send the data');
    }
}

export async function sendDeleteRequest(closestReviewItemId) {
    try {
        let sendRequest = await fetch(`/delete-review/${closestReviewItemId}`, {
            method: 'DELETE',
            headers: {'Content-type': 'application/json'}
        });

        if (!sendRequest.ok) {
            // closestReviewRow.remove();
            throw new Error("The delete request wasn't successful.")
        }
        return {ok: sendRequest.ok, status: sendRequest.status, data: sendRequest.json()};
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

export async function sendUpdateRequest(closestReviewRowId, data) {
    try {
        let sendPutRequest = await fetch(`/update-review/${closestReviewRowId}`, {
            method: 'PUT',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(data)
        });
        if(!sendPutRequest.ok) {
            throw new Error(`An error ${sendPutRequest.status} occurred while updating data ${sendPutRequest.statusText}`)
        }
        return sendPutRequest;
    }
    catch (error) {
        console.log(error);
        throw new Error("An error occurred while updating data")
    }
}