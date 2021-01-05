const advancedResults = (model, populate) => async (req, res, next) => {
    // Selecting select field to select specific fields
    const {select, sort, limit = 10, page = 1, ...requestQuery} = req.query;

    // Create operators ($gt, $gte, etc...)
    const queryStr = JSON.stringify(requestQuery).replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        match => `$${match}`,
    );

    // Total counts and skip index for pagination

    const startIndex = (page - 1) * limit;
    const total = await model.countDocuments();

    let query = model
        .find(JSON.parse(queryStr))
        .skip(startIndex)
        .limit(+limit);

    // Select query

    if (select) query = query.select(select.split(',').join(' '));

    // Sort query

    if (sort) query = query.sort(sort);
    else query = query.sort('-createdAt');

    // Populating another models

    if (populate) query = query.populate(populate);

    // Executing query

    const resource = await query;

    // Calculate page count

    const pageCount = total / limit < 1 ? 0 : Math.ceil(total / limit);

    req.advancedResults = {
        success: true,
        currentPage: +page,
        pageSize: +limit,
        pageCount,
        count: resource.length,
        data: resource,
    };

    next();
};

module.exports = advancedResults;
