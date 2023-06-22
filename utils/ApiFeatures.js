
class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((el) => delete queryObj[el]);

        // Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );
        this.query = this.query.find(JSON.parse(queryStr)); //ezzel lehet szűrni az adatok között

        return this;
    }
    sorting() {
        if (this.queryString.sort) {
            let sortBy = JSON.stringify(this.queryString.sort).replaceAll(',', ' ');
            this.query = this.query.sort(JSON.parse(sortBy)); //lekérdezés rendezése
        } else {
            this.query = this.query.sort("-createdAt")
        }
        return this;
    }
    fieldLimiting() {
        if (this.queryString.fields) {
            let fields = this.queryString.fields.replaceAll(',', ' ');
            this.query = this.query.select(fields)
        } else {
            //default field limiting
            this.query = this.query.select('-__v') //minus sign means not including(excluded) 
        }
        return this;
    }
    pagination() {
        let page = Number(this.queryString.page) || 1;
        let limit = Number(this.queryString.limit) || 100;
        let skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }

}
module.exports = APIFeatures;