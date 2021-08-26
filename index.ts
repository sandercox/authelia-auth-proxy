import express, { request } from 'express';
import axios, { Method, AxiosResponse } from 'axios';

const app = express();
const port = process.env.PORT || 3000;
const authelia = process.env.AUTHELIA || "http://authelia:9091";

app.get('/', async (req, res) => {

    try {
        var response = await axios({
            url: `${authelia}`,
            method: req.method as Method,
            headers: req.headers,
            params: req.params,
            data: req.body,
            maxRedirects: 0,
        });

        res.status(response.status);
        res.header(response.headers);
        res.send(response.data);
        return;
    } catch(err) {
        var response = err.response as AxiosResponse;

        if(response)
        {
            res.status(response.status);
            res.header(response.headers);
            res.send(response.data);
        }
        else
        {
            res.status(500);
            res.send("Internal error - is the authelia server reachable?");
        }
        return;
    }
})

app.listen(port, () => {
    console.log(`Proxy running on ${port}`)
})
