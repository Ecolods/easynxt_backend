const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // SQL Server specific errors
    if (err.name === 'ConnectionError') {
        return res.status(503).json({
            success: false,
            message: 'Database connection error',
            error: err.message
        });
    }

    if (err.name === 'RequestError') {
        return res.status(500).json({
            success: false,
            message: 'Database request error',
            error: err.message
        });
    }

    // Default error
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
};

module.exports = errorHandler;