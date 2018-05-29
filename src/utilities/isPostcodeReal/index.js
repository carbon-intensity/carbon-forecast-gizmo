const isPostcodeReal = (postcode) => {
    return fetch(`https://api.postcodes.io/postcodes/${postcode}`)
        .then( (response) => {
            if (response.ok === true) {
                if (response.status >= 200 && response.status < 400) {
                    return response.json();
                }
                else {
                    throw new Error('Response status not >= 200 and < 400')
                }
            }
            else {
                throw new Error('Response not ok')
            }
        })
        .then( (response) => {
            if (response.status === 200) {
                return {
                    result: true,
                    outcode: response.result.postcode
                }
            }
            else {
                return false;
            }
        })
        .catch( (error) => {
            console.warn(error);
            return false;
        });
};

export default isPostcodeReal;
