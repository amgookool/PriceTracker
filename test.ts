// 154.16.146.46:80
import axios, { type AxiosProxyConfig, type AxiosRequestConfig, type RawAxiosRequestHeaders } from 'axios';
import { getRandomUserAgent } from '@scraper/configs.tracker';
import * as cheerio from 'cheerio';

const headers = {
	Accept:
		'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
	'User-Agent': getRandomUserAgent(),
} as RawAxiosRequestHeaders;

const proxy = {
	host: 'p.webshare.io',
	port: 80,
	auth: {
		username: 'rmuvompm-rotate',
		password: '504337i30fcr',
	},
	protocol: 'http',
} as AxiosProxyConfig;

const requestConfig = {
	headers: headers,
	method: 'GET',
	proxy: proxy,
} as AxiosRequestConfig;

const axiosAmazonClient = axios.create(requestConfig);

const getAmazonProductPage = async (url: string) => {
	try {
		const response = await axiosAmazonClient.get(url);
		return response.data as string;
	} catch (error) {
		console.error(error);
	}
};

const amazonFile = './Amazon-AirPods.html';
const file = Bun.file(amazonFile);
const text = await file.text();

const amazonUrl = 'https://www.amazon.com/dp/B0D1WXVQTN';
const amazonUrl2 = 'https://www.amazon.com/dp/B0C2BMNHW2';

const googleUrl = 'http://httpbin.org/ip';

const scrapeProduct = async (html: string) => {
	const $ = cheerio.load(html);
	const productTitle = $('span#productTitle').text().trim();
	const imageWrapper = $('div#imgTagWrapperId');
	const priceWrapper = $('div#corePrice_feature_div');
	const imageLink = imageWrapper.find('img').attr('src') as string;
	const price = parseFloat(priceWrapper.find('span.a-offscreen').text().slice(1));
	return {
		productTitle,
		imageLink,
		price,
	};
};

const pageData = await getAmazonProductPage(amazonUrl);
console.log(pageData);
// const result = await scrapeProduct(pageData as string);

// console.log(result);
