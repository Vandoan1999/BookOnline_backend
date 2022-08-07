import { Router } from "express";
import { ResponseBuilder } from "../ultis/response-builder";
import * as AWS from "aws-sdk";
import { upload } from "@common/multer";
const router = Router();
const url = {
  get: "/",
};
const s3 = new AWS.S3({});

router.post(url.get, upload.single("file"), async (req: any, res) => {
  const bucketParams = {
    Body: req.file.buffer,
    Bucket: "shopbook",
    ContentType: req.file.mimetype,
    Key: `images/${req.file.originalname}`,
  };
  await s3.putObject(bucketParams).promise();
  res.json(new ResponseBuilder().withSuccess().build());
});

router.get(url.get, upload.single("file"), async (req: any, res) => {
  const bucketParams = {
    Bucket: "shopbook",
    Key: `images/0.922810108853827demo.png`,
  };
  const result = await s3.headObject(bucketParams).promise();
  console.log(result);
  const result1 = await s3.deleteObject(bucketParams).promise();
  console.log(result1);

  res.json(new ResponseBuilder().withSuccess().build());
});

router.delete(url.get, upload.single("file"), async (req: any, res) => {
  const bucketParams = {
    Bucket: "shopbook",
    Key: `images/demo.png`,
  };

  await s3.deleteObject(bucketParams).promise();
  res.json(new ResponseBuilder().withSuccess().build());
});

export default router;
