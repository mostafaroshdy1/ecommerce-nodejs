import express from 'express';
import { connectToDB } from './src/utils/db.mjs';
import { ExpressError } from './src/utils/ExpressError.mjs';
import { AuthRoutes } from './src/Routes/Auth.Routes.mjs';
import { UserRoutes } from './src/Routes/User.Routes.mjs';
import { checkUser } from './src/Middleware/Auth.Middleware.mjs';

import productRouter from './src/Routes/product.route.mjs';
import orderRoutes from './src/Routes/order.route.mjs';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config();

import { router as cartRoutes } from './src/Routes/Cart.mjs';

import { router as profileRoutes } from './src/Routes/profile.route.mjs';

connectToDB();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// app.use('/users', routeName);
// app.use('/etc', routeName);
// app.use('/etc', routeName);
app.use(AuthRoutes);
app.use(checkUser);

app.use('/User', UserRoutes);
app.use('/products', productRouter);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/profile', profileRoutes);

//  Any Invalid routes
app.all('*', (req, res, next) => {
	next(new ExpressError('Page Not Found', 404));
});

// Error handling middleware
app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = 'Oh No, Something Went Wrong';
	return res.status(statusCode).json(err.message);
});

app.listen(PORT, () => {
	console.log('http://localhost:' + PORT);
});

import redis from 'redis';
import { catchAsync } from './src/utils/catchAsync.mjs';

// const carts = {
//   email: [
//     {
//       productId: 5,
//       name: "Iphone",
//       price: 210000,
//       qty: 2,
//       img: "url",
//     },
//   ],
// };
// async function redisConnect() {
//   const client = redis.createClient();
//   await client.connect();
//   await client.del("myKey", JSON.stringify(carts));
//   console.log(JSON.parse(await client.get("myKey")));
// }

// redisConnect();
