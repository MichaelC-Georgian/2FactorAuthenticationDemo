//JSON Object that contains my global configuration values
const configuration = {
    //Our database connection, as this is sent with starter code and the phone numbers are stored in plain text,
    // its recommended you use your own MongoDB or login to this one through compass and remove your personal details once done.
    'db':'mongodb+srv://Admin:1234@cluster0.njvl2.mongodb.net/SMS2FA',

    //Step 1: Get your Vonage API Keys and secret by registering at https://dashboard.nexmo.com/
};

module.exports = configuration;