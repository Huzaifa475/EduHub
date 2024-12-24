const asyncHandler = (requestHandler) => {
    return (res, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    }
}

export default asyncHandler;  