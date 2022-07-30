import path, { resolve } from "path";
import dotenv from "dotenv";
import { dataEnv } from "../config/env.config.js";
import { fileURLToPath } from "url";
import { getProduc } from "../models/products.model.js";
import { PutObjectCommand, S3Client, GetObjectCommand } from "@aws-sdk/client-s3";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const data = dotenv.config({
  path: path.resolve(__dirname, `../environments/.env.${process.env.NODE_ENV}`),
});


const s3 = new S3Client({
  credentials: {
    accessKeyId: dataEnv.parsed.ACCESS_KEY,
    secretAccessKey: dataEnv.parsed.SECRET_ACCESS_KEY
  },
  region: dataEnv.parsed.BUCKET_REGION
});



const produc_view = async function (req, res) {
  getProduc.products
    .findAll()
    .then((r) => {
      res.send(r);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

const bucketName = dataEnv.parsed.BUCKET_NAME


const produc_create = async function (req, res, upload) {
  upload.single("name");

  const params = {
    Bucket: bucketName,
    Key: req.file.originalname,
    Body: req.file.buffer,
    ContentType: req.file.mimetype
  }



  const command = new PutObjectCommand(params)

  await s3.send(command)
  console.log(params.ContentType)

  var urlsss = `https://csdb203140.s3.us-west-1.amazonaws.com/${params.Key}`;

  console.log(urlsss);



  getProduc.products.create(
    {
      name: urlsss,
      nameProduc: req.body.nameProduc,
      description: req.body.description,
      price: req.body.price,
      amount: req.body.amount,
    },
    {
      fields: ["name", "nameProduc", "description", "price", "amount"],
    }
  )
    .then((img) => {
      res.send(img);
    })
    .catch((err) => {
      console.log(err);
    });

};
const Product_update = (req, res) => {

  const id = req.body.id;
  const nameProduc = req.body.nameProduc;
  const description = req.body.description;
  const price = req.body.price;
  const amount = req.body.amount;
  getProduc.products
    .findOne({ where: { id: id } })
    .then((product) => {
      product.update({nameProduc: nameProduc, description: description, price: price, amount: amount })
      res.status(200).json({ successfully: 'Datos Actualizados' });
    })
    .catch((err) => {
      console.log(err);
    })
};

const Product_delete = async function (req, res) {
  const id = req.body.id;
  getProduc.products
    .destroy({ where: { id: id } })
    .then((r) => {
      res.status(200).json({ message: "Deleted successfully" });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};



export const producController = {
  produc_create,
  Product_update,
  produc_view,
  Product_delete,

};

