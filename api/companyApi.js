export async function getCompanyReviews(company, page, limit, filter, sort) {
    try{
        // let url = `get-review?page=${page}&limit=${limit}`;
        let url = `/companies/${company}/reviews?page=${page}&limit=${limit}`;

        if(filter && filter!== "no_filter") url += `&filter=${filter}`;
        if(sort && sort!=="no_sort") url+= `&sort=${sort}`;
        // console.log(url);
        let sendRequest = await fetch(url);

        if(!sendRequest.ok) {
            return {
                success: false,
                status:sendRequest.status,
                text: sendRequest.statusText,
                items: [],
                pagesTotalNumber: 0,
                reviewsTotalNumber: 0,
            }
        }
        let parsedJsonResponse;
        try {
            parsedJsonResponse = await sendRequest.json();
        }
        catch {
            return {
                success: false,
                status: sendRequest.status,
                text: "Couldn't parse the company reviews response",
                items: [],
                pagesTotalNumber: 0,
                reviewsTotalNumber: 0,
            };
        }
        return {
            success: true,
            status:sendRequest.status,
            text: sendRequest.statusText,
            ...parsedJsonResponse,
        }
        // без spread — вручную
        // return {
        //     success: true,
        //     items: parsedJsonResponse.items,
        //     pagesTotalNumber: parsedJsonResponse.pagesTotalNumber,
        //     reviewsTotalNumber: parsedJsonResponse.reviewsTotalNumber,
        // }
    }
    catch {
        return {
            success: false,
            status: null,
            text: "Couldn't load company reviews",
            items: [],
            pagesTotalNumber: 0,
            reviewsTotalNumber: 0,
        };
    }
}

// GET /api/companies/:id/reviews/stats
export async function calculateGrades(company) {
    try {
        let url = `/companies/${company}/reviews/stats`
        let sendRequest = await fetch(url);

        if(!sendRequest.ok) {
            return {
                success: false,
                status: sendRequest.status,
                text: sendRequest.statusText,
                avgRating: null,
                ratings: [],
            }
        }

        let parsedJson;
        try {
            parsedJson = await sendRequest.json();
        }
        catch {
            return {
                success: false,
                status: sendRequest.status,
                text: "Couldn't parse the company grades response",
                avgRating: null,
                ratings: [],
            };
        }

        return {
            success: true,
            status: sendRequest.status,
            text: sendRequest.statusText,
            avgRating: parsedJson.avgRating,
            ratings: parsedJson.ratings,
        }
    }
    catch {
        return {
            success: false,
            status: null,
            text: "Couldn't load company grades",
            avgRating: null,
            ratings: [],
        }
    }
}

export async function getCompanyAboutData(company) {
    let sendRequest;
    try{
        let url = `/companies/${encodeURIComponent(company)}`;
        sendRequest = await fetch(url);
        if(!sendRequest.ok) {
            return {
                success: false,
                status: sendRequest.status,
                text: sendRequest.statusText,
                item: null,
            }
        }

        let parsedJson;
        try{
            parsedJson = await sendRequest.json();
        }
        catch {
            return {
                success: false,
                status: sendRequest.status,
                text: "Couldn't parse the server response",
                item: null,
            }
        }

        return {
            success: true,
            status: sendRequest.status,
            text: sendRequest.statusText,
            ...parsedJson,
        }
    }
    catch {
       return {
           success: false,
           status: null,
           text: "Couldn't send the request",
           item: null,
       }
    }
}
