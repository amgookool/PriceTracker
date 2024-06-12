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

// const proxy = {} as AxiosProxyConfig;

const requestConfig = {
  headers: headers,
  method: "GET",
  // proxy: proxy,
} as AxiosRequestConfig;

const axiosNewggClient = axios.create(requestConfig);

const getNeweggProductPage = async (url: string) => {
  try {
    const response = await axiosNewggClient.get(url);
    return response.data as string;
  } catch (error) {
    console.error(error);
  }
};

const scrapeProduct = async (html: string) => {
  const $ = cheerio.load(html);
  const productTitle = $("h1.product-title").text();
  const imageElements = $("img.product-view-img-original");
  const imageLink = imageElements.attr("src") as string;
  
  // const imageWrapper = $("div#imgTagWrapperId");
  // const priceWrapper = $("div#corePrice_feature_div");
  // const imageLink = imageWrapper.find("img").attr("src") as string;
  // const price = parseFloat(
  //   priceWrapper.find("span.a-offscreen").text().slice(1)
  // );
  return {
    productTitle,
    imageLink,
  //   price,
  };
};

export const scrapeNeweggProduct = async (url: string) => {
  const html = (await getNeweggProductPage(url)) as string;
  return await scrapeProduct(html);
};


const newEggUrl = "https://www.newegg.com/amd-ryzen-5-7600x-ryzen-5-7000-series/p/N82E16819113770";
const newEggFile = "newegg.html";

const htmlFile = Bun.file(newEggFile)
const htmlString = await htmlFile.text();
scrapeProduct(htmlString);


const main = async () => {
  const html = await getNeweggProductPage(newEggUrl);
  console.log(html);
};

// main();