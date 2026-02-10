export default ({ env }) => {
  const uploadProvider = env('UPLOAD_PROVIDER', 'local');

  const uploadConfig =
    uploadProvider === 'aws-s3'
      ? {
          provider: 'aws-s3',
          providerOptions: {
            s3Options: {
              accessKeyId: env('S3_ACCESS_KEY_ID'),
              secretAccessKey: env('S3_ACCESS_SECRET'),
              endpoint: env('S3_ENDPOINT'), // e.g., http://minio:9000 (internal on Coolify)
              region: env('S3_REGION', 'us-east-1'),
              s3ForcePathStyle: true,
              signatureVersion: 'v4',
            },
            bucket: env('S3_BUCKET', 'uploads-public'),
            baseUrl: env('S3_BASE_URL'), // e.g., https://cdn.learnednomad.com
            prefix: env('S3_PREFIX', ''),
            acl: env.bool('S3_PRIVATE', false) ? 'private' : 'public-read',
          },
        }
      : {
          provider: 'local',
        };

  return {
    'users-permissions': {
      enabled: true,
      config: {
        jwtSecret: env('JWT_SECRET'),
      },
    },
    upload: {
      config: uploadConfig,
    },
  };
};
