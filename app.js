import express from "express";
import { connectToDB } from "./src/utils/db.mjs";
import { ExpressError } from "./src/utils/ExpressError.mjs";
import { UserRoutes } from "./src/Routes/User.Routes.mjs";
import cookieParser from "cookie-parser";

connectToDB();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
// app.use('/users', routeName);
// app.use('/etc', routeName);
// app.use('/etc', routeName);

app.use(UserRoutes);

app.get("/read-cookies", (req, res) => {
  const cookie = req.cookies;
  res.status(200).json({ cookie });
});

//  Any Invalid routes
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

//Error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong";
  return res.status(statusCode).json(err.message);
});

app.listen(PORT, () => {
  console.log("http://localhost:" + PORT);
});
