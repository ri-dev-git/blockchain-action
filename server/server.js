//Config express
const express = require("express");
const dotenv = require("dotenv");

const nftRoutes = require("./routes/nftRoutes.js");
const tokenController = require('./routes/token.js');
const mongoose = require("mongoose");
const cors = require("cors");


dotenv.config();

const app = express();

// configuration cors
const corsOptions = {
  origin: ["http://localhost:5173", "https://api.coingecko.com/"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// middleware pour parser le json
app.use(express.json());

// middleware pour logger les requetes
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/nft", nftRoutes);
app.use("/api/transfer-tokens", tokenController);


//connect to db et lancement du server
mongoose
  .connect(process.env.MONG_URI)
  .then(() => {
    // listen requests
    console.log(`connected to db`);
  })
  .catch((error) => {
    // console.log(error);
  });

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
