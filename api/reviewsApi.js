

export async function getAllCompanies() {
    try {
        let sendGetCompaniesRequest = await fetch(`/get-companies`);
        let parsedJsonBody;
        try{
            parsedJsonBody = await sendGetCompaniesRequest.json();
        }
        catch {
            return {
                success: false,
                status: sendGetCompaniesRequest.status,
                statusText: sendGetCompaniesRequest.statusText,
                text: "Couldn't parse the companies response",
                items: [],
            };
        }
        if (!sendGetCompaniesRequest.ok) {
            // throw new Error('Failed to get data'); // instead of this
           return  {
               success: false,
               status: sendGetCompaniesRequest.status,
               statusText: sendGetCompaniesRequest.statusText,
               items: [],
            }
        }
        // console.log(await sendGetRequest.json())
        // return await sendGetCompaniesRequest.json(); // instead of this
        // console.log(parsedJsonBody);
        return {
            success: true,
            status: sendGetCompaniesRequest.status,
            statusText: sendGetCompaniesRequest.statusText,
            // items: parsedJsonBody?.allCompanies, // 1st option - object
            items: parsedJsonBody, // 2nd option - array
        }
    } catch {
        return {
            success: false,
            status: null,
            statusText: '',
            text: "Couldn't load companies",
            items: [],
        };
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

export async function getReviews(page, limit, company = null, sort = null, search = null) {
    let sendGetRequest;
    try {
        let url = `/get-reviews?page=${page}&limit=${limit}`;

        // checking if company parameter was passed
        if(company && company !=="all") url += `&company=${encodeURIComponent(company)}`;
        if(sort && sort !=="no_sort") url+= `&sort=${sort}`;
        if(search) url += `&search=${search}`;

        sendGetRequest = await fetch(url);
        if (!sendGetRequest.ok) {
            return {
                success: false,
                status: sendGetRequest.status,
                text: `Server responded with an error ${sendGetRequest.status}`,
                items: null,
            }
        }

        let parsedResponse;
        try{
            parsedResponse = await sendGetRequest.json();
        }
        catch {
            return {
                success: false,
                status: sendGetRequest.status,
                text: `Failed to parse server response`,
                items: null,
            }
        }
        // console.log(await sendGetRequest.json())
        return {
            success: true,
            status: sendGetRequest.status,
            text: sendGetRequest.statusText,
            ...parsedResponse,
        };
    }
    catch {
        return {
            success: false,
            status: null,
            text: 'Network error, try again',
            items: null,
        };
    }
}

// export async function submitReview(data) {
//     try {
//         let sendRequest = await fetch('/submit-review', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${localStorage.getItem('token')}`
//             },
//             body: JSON.stringify(data),
//         });
//         let json = await sendRequest.json();
//         return {ok: sendRequest.ok, status: sendRequest.status, json};
//     }
//     catch (error) {
//         throw new Error('Failed to send the data');
//     }
// }

export async function submitReview(data) {
    try {
        let token = localStorage.getItem('token');
        let sendRequest = await fetch('/submit-review', {
            method: 'POST',
            // headers: {
            //     'Content-Type': 'application/json',
            //     'Authorization': `Bearer ${localStorage.getItem('token')}`
            // },
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify(data),
        });

        if(!sendRequest.ok) {
            return {
                success: false,
                status: sendRequest.status,
                text: `Server responded with an error ${sendRequest.status}`,
                items: null,
            }
        }

        let parsedResponse;
        try{
            parsedResponse = await sendRequest.json();
        }
        catch {
            return {
                success: false,
                status: sendRequest.status,
                text: `Failed to parse server response`,
                items: null,
            }
        }

        return {
            success: true,
            status: sendRequest.status,
            text: sendRequest.statusText,
            parsedResponse,
        };
    }
    catch {
        return {
            success: false,
            status: null,
            text: "Couldn't submit the review",
            items: null,
            parsedResponse: {},
        };
    }
}
export async function sendDeleteRequest(closestReviewItemId) {
    try {
        let sendRequest = await fetch(`/delete-review/${closestReviewItemId}`, {
            method: 'DELETE',
            headers: {'Content-type': 'application/json'}
        });

        if (!sendRequest.ok) {
            return {
                success: false,
                ok: false,
                status: sendRequest.status,
                text: sendRequest.statusText || "The delete request wasn't successful",
                data: null,
            };
        }
        return {
            success: true,
            ok: true,
            status: sendRequest.status,
            text: sendRequest.statusText,
            data: sendRequest.json(),
        };
    }
    catch {
        return {
            success: false,
            ok: false,
            status: null,
            text: "Couldn't delete the review",
            data: null,
        };
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
            return {
                success: false,
                ok: false,
                status: sendPutRequest.status,
                text: sendPutRequest.statusText || "The update request wasn't successful",
            };
        }
        return {
            success: true,
            ok: true,
            status: sendPutRequest.status,
            text: sendPutRequest.statusText,
        };
    }
    catch {
        return {
            success: false,
            ok: false,
            status: null,
            text: "Couldn't update the review",
        };
    }
}
