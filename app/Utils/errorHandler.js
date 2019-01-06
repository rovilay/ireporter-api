const errorHandler = (response, message='server error', status=500, errorData=null) => {
    const msg = errorData ? {
        success: false,
        message,
        errors: errorData
    } :
    {
        success: false,
        message
    };

    return response.status(status).json(msg);
};
module.exports = errorHandler;
