import { getUsersFavoriteProducts } from '@server/services/application.services';

const res = await getUsersFavoriteProducts(1);

console.log(res);
