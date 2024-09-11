const sql = require('../config/dbConfig');
/**
 * Retrieves chart data from the charts table.
 * @param {Object} data - Not used in the current query but can be extended for future needs.
 * @returns {Promise<Array>} Promise resolving to an array of chart data objects containing id, chartType, and value.
 */
const getChartData = (data) => {
    return new Promise((resolve, reject) => {

        let query = 'Select id,chart_type as chartType,value from charts';
        sql.query(query, (err, res) => {
            if (err) {
                console.log(err);
                reject(err)
            } else {
                resolve(res)
            }
        })
    })
}



module.exports = {
    getChartData
}
