const got = require('got');
const {HttpsProxyAgent} = require('hpagent');

const basePath = 'https://public.api.aibo.com/v1';
const deviceId = process.env.deviceId;
const timeout = 10;
const args = process.argv.slice(2);

async function request(url, method, arguments) {
    const headers = {
        'Authorization': `Bearer ${process.env.accessToken}`,
        'Content-Type': 'application/json',
    }
    const data = {
        method: method,
        responseType: 'json',
        headers: headers,
        agent: {
            https: new HttpsProxyAgent({
                keepAlive: true,
                keepAliveMsecs: 1000,
                maxSockets: 256,
                maxFreeSockets: 256,
                scheduling: 'lifo',
                proxy: 'http://localhost:8888',
                rejectUnauthorized: false
            })
        }
    };

    if (arguments) {
        data.json =  {
            arguments: arguments
        }
    }

    console.log(url);
    try {
        const response = await got(url, data);
        return response;
    } catch (error) {
        return error.response;
    }
}


(async (apiName, arguments) => {
    const url = `${basePath}/devices/${deviceId}/capabilities/${apiName}/execute`;
    const { body } = await request(url, 'POST', arguments);
    const { executionId } = body;
    const resultUrl = `${basePath}/executions/${executionId}`;
    let t = 0;
    while (t < timeout) {
        const {body} = await request(resultUrl, 'GET', null);
        console.log(body.status);
        if (body.status === 'SUCCEEDED') {
            process.exit(0);
        }
        if (body.status === 'FAILED') {
            process.exit(1);
        }
        t++;
    }
    process.exit(2);
})(args[0], JSON.parse(args[1]));

