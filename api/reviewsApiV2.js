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
                items: null,
            }
        }
        let parsedJsonResponse;
        try {
            parsedJsonResponse = await sendRequest.json();
        }
        catch (error) {
            console.log(`Failed to parse response body: ${error}`)
        }
        return {
            success: true,
            status:sendRequest.status,
            text: sendRequest.statusText,
            items: parsedJsonResponse.items,
        }
    }
    catch (error) {
        throw error;
    }
}

// GET /api/companies/:id/reviews/stats
export async function calculateGrades(company) {
    let url = `/companies/${company}/reviews/stats`
    let sendRequest = await fetch(url);

    if(!sendRequest) {
        return {
            avgRating: null,
            ratings: null,
        }
    }

    let parsedJson;
    try {
        parsedJson = await sendRequest.json();
    }
    catch (error) {
        console.log(`Failed to parse response body: ${error}`)
    }

    return {
        avgRating: parsedJson.avgRating,
        ratings: parsedJson.ratings, // []
    }
}