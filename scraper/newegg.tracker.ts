import axios, {
    type AxiosProxyConfig,
    type AxiosRequestConfig,
    type RawAxiosRequestHeaders,
} from "axios";
import * as cheerio from "cheerio";
import { getRandomUserAgent } from "./configs.tracker";

const headers = {
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "User-Agent": getRandomUserAgent(),
} as RawAxiosRequestHeaders;

const proxy = {} as AxiosProxyConfig;

const requestConfig = {
  headers: headers,
  method: "GET",
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

const scrapeProduct = async (html: string) => {
  const $ = cheerio.load(html);
  const productTitle = $("span#productTitle").text();
  const imageWrapper = $("div#imgTagWrapperId");
  const priceWrapper = $("div#corePrice_feature_div");
  const imageLink = imageWrapper.find("img").attr("src") as string;
  const price = parseFloat(
    priceWrapper.find("span.a-offscreen").text().slice(1)
  );
  return {
    productTitle,
    imageLink,
    price,
  };
};

export const scrapeAmazonProduct = async (url: string) => {
  const html = (await getAmazonProductPage(url)) as string;
  return await scrapeProduct(html);
};
