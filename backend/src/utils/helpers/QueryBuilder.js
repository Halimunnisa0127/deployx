class QueryBuilder {
  /**
   * @param {Object} query - Mongoose query object (e.g., User.find())
   * @param {Object} queryString - Express request query object (req.query)
   */
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString || {};
    this.meta = {};
  }

  /**
   * 1. Filtering Helper & Search
   * Supports specific fields like status, owner, etc.
   * Also supports regex search across defined searchable fields.
   */
  filter(searchableFields = []) {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    
    // Remove metadata fields from standard filtering
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering for operators like >=, <=, etc.
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in|ne)\b/g, (match) => `$${match}`);
    const parsedQuery = JSON.parse(queryStr);

    // Apply regex search if requested
    if (this.queryString.search && searchableFields.length > 0) {
      const searchRegex = new RegExp(this.queryString.search, 'i');
      parsedQuery.$or = searchableFields.map((field) => ({ [field]: searchRegex }));
    }

    this.query = this.query.find(parsedQuery);
    return this;
  }

  /**
   * 2. Sorting Helper
   * Supports comma separated sorting like sort=name,-createdAt
   */
  sort(defaultSort = '-createdAt') {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort(defaultSort);
    }
    return this;
  }

  /**
   * Projection Helper
   * Supports returning specific fields like fields=name,email
   */
  project() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // Exclude mongoose version key by default
    }
    return this;
  }

  /**
   * 3. Pagination Helper
   * Handles limit, skip, and metadata counts
   */
  async paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Retrieve the total document count based on the applied filters
    const totalItems = await this.query.model.countDocuments(this.query.getFilter());
    const totalPages = Math.ceil(totalItems / limit) || 1;

    this.query = this.query.skip(skip).limit(limit);

    // Attach pagination metadata
    this.meta = {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return this;
  }

  /**
   * Execute the final composed query and return results with metadata
   */
  async execute() {
    // If paginate hasn't been called, call it defaultly before execution
    if (!this.meta.page) {
      await this.paginate();
    }
    
    const data = await this.query;
    return {
      data,
      meta: this.meta,
    };
  }
}

module.exports = QueryBuilder;
