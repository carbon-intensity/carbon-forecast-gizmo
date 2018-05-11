const isPostcodeReal = (postcode) => {
    return fetch(`https://api.postcodes.io/postcodes/${postcode}`)
        .then( (response) => {
            console.log(response)
            if (response.ok) {
                    if (response.status >= 200 && response.status < 400) {
                        return response.json();
                    }
            }
        })
        .then( (response) => {
            if (response.status === 200) {
                return {
                    result: true,
                    outcode: response.result.outcode
                }
            }
            else {
                return false;
            }
        })
        .catch( (error) => {
            console.warn(error);
        });
};

export default isPostcodeReal;
