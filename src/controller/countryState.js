const logger = require("../helper/logger");
const successMessages = require("../helper/successMessages");
const commonHelper = require("../helper/commonHelper")
const errorMessages = require("../helper/errorMessages")


const getCountryDropDown = async (req, res) => {
    try {
        // logger.infoLogger.info(errorMessages.ENTERED_GET_COUNTRY_API)

        let details = {
            tableName: "countries",
            columnName: "id AS value, name AS label",
            otherCondition: "ORDER BY name ASC"
        }

        let getCountry = await commonHelper.searchData(details)
        if (getCountry.length > 0) {
            logger.infoLogger.info(successMessages.GET_COUNTRY_SUCCESSFULL)
            res.status(200).send({ status: 200, message: successMessages.GET_COUNTRY_SUCCESSFULL, data: getCountry, error: false })
        } else {
            logger.infoLogger.info(errorMessages.NO_DATA_FOUND)
            res.status(200).send({ status: 200, message: errorMessages.NO_DATA_FOUND, data: getState, error: false })
        }
    } catch (error) {
        console.log(error)
        logger.errorLogger.error(`Internal server error : ${error}`)
        res.status(500).send({ status: 500, message: errorMessages.SERVER_ERROR, data: [], error: true })
    }
}

const getStateByCountryId = async (req, res) => {
    try {
        console.log(req.query)
        // logger.infoLogger.info(errorMessages.ENTERED_GET_COUNTRY_API)
        let { country_id } = req.query
        let message = '';
        if (!country_id) {
            message += errorMessages.COUNRY_ID_ID_REQUIRED
        }

        if (message) {
            logger.errorLogger.error(`Validation error: ${message}`)
            return res.status(400).send({ status: 400, message: message, data: [], error: true })
        }

        let details = {
            tableName: "states",
            columnName: "id as value,name as label",
            whereCondition: `AND country_id = ${country_id}`,
            otherCondition: "ORDER BY name ASC"
        }

        let getState = await commonHelper.searchData(details)

        if (getState.length > 0) {
            logger.infoLogger.info(successMessages.GET_STATE_SUCCESSFULL)
            res.status(200).send({ status: 200, message: successMessages.GET_STATE_SUCCESSFULL, data: getState, error: false })
        } else {
            logger.infoLogger.info(errorMessages.NO_DATA_FOUND)
            res.status(200).send({ status: 200, message: errorMessages.NO_DATA_FOUND, data: getState, error: false })
        }

    } catch (error) {
        console.log(error)
        logger.errorLogger.error(`Internal server error : ${error}`)
        res.status(500).send({ status: 500, message: errorMessages.INTERNAL_SERVER_ERROR, data: [], error: true })
    }
}

const getCityByStateId = async (req, res) => {
    try {
        // logger.infoLogger.info(errorMessages.ENTERED_GET_CITY_API)
        let { state_id } = req.query
        let message = '';
        if (!state_id) {
            message += errorMessages.STATE_ID_ID_REQUIRED
        }

        if (message) {
            logger.errorLogger.error(`Validation error: ${message}`)
            return res.status(400).send({ status: 400, message: message, data: [], error: true })
        }

        let details = {
            tableName: "cities",
            columnName: "id as value,name  as label",
            whereCondition: `AND state_id = ${state_id}`,
            otherCondition: "ORDER BY name ASC"
        }

        let getCity = await commonHelper.searchData(details)

        if (getCity.length > 0) {
            logger.infoLogger.info(successMessages.GET_CITY_SUCCESSFULL)
            res.status(200).send({ status: 200, message: successMessages.GET_CITY_SUCCESSFULL, data: getCity, error: false })
        } else {
            logger.infoLogger.info(errorMessages.NO_DATA_FOUND)
            res.status(200).send({ status: 200, message: errorMessages.NO_DATA_FOUND, data: getCity, error: false })
        }

    } catch (error) {
        console.log(error)
        logger.errorLogger.error(`Internal server error : ${error}`)
        res.status(500).send({ status: 500, message: errorMessages.INTERNAL_SERVER_ERROR, data: [], error: true })
    }
}

const getCountryCodes = async (req, res) => {
    try {

        let bodyData = req.body

        let details = {
            tableName: "countries",
            columnName: " CONCAT('(',phonecode,')',' ',name) AS labels, CONCAT('(',phonecode,')',' ',name) AS value "
        }

        let getCountryCodesTask = await commonHelper.searchData(details);

        return res.status(200).send({
            status: 200,
            message: successMessages.DATA_FETCH_SUCCESFULL,
            data: getCountryCodesTask,
            error: false
        });

    } catch (error) {
        console.log(error);
        logger.errorLogger.error(errorMessages.INTERNAL_SERVER_ERROR);
        return res.status(500).send({
            status: 500,
            message: errorMessages.INTERNAL_SERVER_ERROR,
            data: [],
            error: true
        });
    }
}

module.exports = {
    getCountryDropDown,
    getStateByCountryId,
    getCityByStateId,
    getCountryCodes
}