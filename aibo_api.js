const hostname = 'public.api.aibo.com';
const deviceId = process.env.deviceId;
const timeout = 10;
const args = process.argv.slice(2);
const got = require('got');

(async (apiName, arguments) => {
    const url = `https://${hostname}/v1/devices/${deviceId}/capabilities/${apiName}/execute`;
    const headers = {
        'Authorization': `Bearer ${process.env.accessToken}`,
        'Content-Type': 'application/json',
    }
    const data = { json: { arguments: arguments }, responseType: 'json', headers: headers };

    console.log(url);
    console.dir(headers);
    try {
        const response = await got.post(url, data);
        console.log(response.body.data);
    } catch (error) {
        console.log(error.response.body)
    }
	//=> '{"hello":"world"}'
})(args[0], JSON.parse(args[1]));
