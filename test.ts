import { createScrapeJob } from '@server/services/application.services';
import { createTask, createJob } from '@scheduler/scheduler';

const data = {
	website: 'AMAZON',
	productId: 1,
	productUrl:
		'https://www.amazon.com/AmazonBasics-Matte-Keyboard-QWERTY-Layout/dp/B07WJ5D3H4/ref=sr_1_1_ffob_sspa?dib=eyJ2IjoiMSJ9.R8S3hPZYQHddcgNhieVzSlK347I7kM1oQYB0ECPPuxf3h3CROTepNynBsHTUUpb9g07bOEmbFOKU-7wRzlBzVy1UtecMg-RUjGwJAZWXpxtSnemt9kRZGKmW3X6VL99fEFh56x3Y_hk7rZxx05sH3BJSHZ6DcJqLIYcoc5qIARb7TArHL0qCIwuHp39LHvRA8wA9pTvcuwoAbskPay3XNmpULY3kV7D6JoeCP_cNJVs.RvRlyUH2ZQtLDZFMS1wTdccJezGCj7s7oNY0MjZfQbU&dib_tag=se&keywords=keyboard&qid=1719855520&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1',
};

const taskFunction = () => createScrapeJob(data);

const task = createTask('test', taskFunction);

const job = createJob(task, '8 seconds', 1);
