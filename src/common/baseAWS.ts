const os = require("os");
import { config } from "@config/app";
import * as AWS from "aws-sdk";
const s3 = new AWS.S3({});

export async function uploadFile(
  buffer: any,
  bucket: string,
  contentType: string,
  key: string
) {
  const bucketParams = {
    Body: buffer,
    Bucket: bucket,
    ContentType: contentType,
    Key: key,
  };
  await s3.putObject(bucketParams).promise();
}

export function deleteObject(bucket: string, key: string) {
  const bucketParams = {
    Bucket: bucket,
    Key: key,
  };
  return s3.deleteObject(bucketParams).promise();
}

export function GetObjectURl(key: string) {
  return config.s3Url + key;
}
