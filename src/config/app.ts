export const config = {
  page: {
    default_limit: 20,
    max_limit: 100,
  },
  TablePostgres: {
    user: "users",
    books: "books",
    ratings: "rating",
    categories: "categories",
    suppliers: "suppliers",
  },
  s3Bucket: "shopbook",
  s3BucketForder: "images/",
  s3Url: `https://shopbook.s3.ap-southeast-1.amazonaws.com/images/`,
};
