const errorHandler = (response, error, errorData=null, message, status) => {
    const { errorMessage, errorStatus } = getErrorMessage(error);

    const msg = errorData ? {
        success: false,
        message: message || errorMessage,
        errors: errorData
    } :
    {
        success: false,
        message: message || errorMessage
    };

    return response.status(status || errorStatus).json(msg);
};

const getErrorMessage = (error) => {
    let errorMessage;
    let errorStatus;

    if (error && error.name) {

        switch(error.name) {
            case 'UserNotFoundException':
                errorStatus = 404;
                errorMessage = error.message;
                break;
            case 'PasswordMisMatchException':
                errorStatus = 400;
                errorMessage = error.message;
                break;
            default:
                errorStatus = 500;
                errorMessage = 'server error';
        }
    } else {
        errorStatus = 500;
        errorMessage = 'server error';
    }

    return {
        errorMessage,
        errorStatus
    };
}
module.exports = errorHandler;
