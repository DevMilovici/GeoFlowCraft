function getInternalError(error) {
    return { 
        success: false, 
        error: error.message ?? `Something went wrong` 
    };
}

module.exports = {
    getInternalError
}