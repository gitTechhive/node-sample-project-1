const chartModel = require('../model/chartModel');
const successMessage = require('../helper/successMessages')
const commonHelper = require('../helper/commonHelper')
const errorMessage = require('../helper/errorMessages');
const logger = require('../helper/logger');
const { json } = require('body-parser');

const getChartData = async (req, res) => {
    try {

        const token = req.headers.authorization;
        let userDetail = await commonHelper.getDetails(token);

        if (typeof userDetail === "string") {
            userDetail = JSON.parse(userDetail);
        }

        let getData = await chartModel.getChartData();
        let data = {
            chartData: getData,
            totalCustomer: 240,
            totalCustomerPer: 40,
            activeNow: 20,
            activeNowPer: 40,
            totalMember: 50,
            totalMemberPer: 20,
            myBalance: 500,
            myBalancePer: 20
        }
        if (getData.length > 0) {
            logger.infoLogger.info(successMessage.GET_DATA_SUCCESSFULL)
            res.status(200).json({ status: 200, message: successMessage.GET_DATA_SUCCESSFULL, data: data, error: false })
        } else {
            logger.infoLogger.info(successMessage.NO_DATA_FOUND)
            res.status(200).json({ status: 200, message: successMessage.NO_DATA_FOUND, data: [], error: false })
        }
    } catch (error) {
        console.log(error);
        logger.errorLogger.error(errorMessage.INTERNAL_SERVER_ERROR);
        return res.status(500).send({
            status: 500,
            message: errorMessage.INTERNAL_SERVER_ERROR,
            data: [],
            error: true
        });
    }
}


module.exports = {

    getChartData
}