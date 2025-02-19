function getInternalError(error) {
    return { 
        success: false, 
        message: error.message ?? `Something went wrong` 
    };
}

module.exports = {
    getInternalError
}