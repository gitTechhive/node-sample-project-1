const sql = require('../config/dbConfig');

const getChartData = (data) => {
    return new Promise((resolve, reject) => {

        // console.log(data)
        let query = 'Select id,chart_type as chartType,value from charts';

        // console.log(query)
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
