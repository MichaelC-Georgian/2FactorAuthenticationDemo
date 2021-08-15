//JSON Object that contains my global configuration values
const configuration = {
    'db':'mongodb+srv://Admin:1234@cluster0.njvl2.mongodb.net/SMS2FA',

    //Step 1: Get your Vonage API Keys and secret by registering at https://dashboard.nexmo.com/
    'vonage':{
        'apiKey' : '164fed3f',
        'apiSecret' : 'GC5MjA249p3i5mbW'
    }
};

module.exports = configuration;