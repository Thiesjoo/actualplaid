const Conf = require("conf");
const config = require("dotenv").config;
config();

const ACTUAL_SERVER_URL = process.env.ACTUAL_SERVER_URL || "";
const ACTUAL_SERVER_PASSWORD = process.env.ACTUAL_SERVER_PASSWORD || "";

const APP_PORT = process.env.APP_PORT || 3000;

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID || "";
const PLAID_SECRETS = {
    "development": process.env.PLAID_SECRET_DEVELOPMENT,
    "sandbox": process.env.PLAID_SECRET_SANDBOX,
};

const PLAID_ENV = process.env.PLAID_ENV || "sandbox";
const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || "transactions").split(
    ","
);
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || "US").split(",");
const PLAID_LANGUAGE = (process.env.PLAID_LANGUAGE || "en")

const APP_CWD_OVERRIDE = process.env.APP_CWD_OVERRIDE || "";
const APP_IS_READONLY = process.env.APP_IS_READONLY || false;

function getAppConfigFromEnv() {
    const appConfig = {
        APP_PORT,
        PLAID_CLIENT_ID,
        PLAID_SECRETS,
        PLAID_ENV,
        PLAID_PRODUCTS,
        PLAID_LANGUAGE,
        PLAID_COUNTRY_CODES,
        ACTUAL_SERVER_URL,
        ACTUAL_SERVER_PASSWORD,
    }

    // Assert that all required environment variables are set
    Object.entries(appConfig).forEach(([key, value]) => {
        if (!value) {
            throw new Error(`Missing environment variable: ${key}`);
        }
    })

    return appConfig
}


function getConf(username) {
    const appConfig = getAppConfigFromEnv();
    const key = `${username}_${appConfig.PLAID_ENV}`;

    const configForConf = {
        configName: key,
        
    }
    if (APP_CWD_OVERRIDE) {
        configForConf.cwd = APP_CWD_OVERRIDE;
    }

    const tmp = new Conf(configForConf);

    if (APP_IS_READONLY) {
        tmp.set = () => {
            console.warn("Attempted to set config in read-only mode, changes are not saved", arguments)
        }
    }

    tmp.set("user", key);
    return tmp;
}

module.exports = {
    getAppConfigFromEnv,
    getConf
}