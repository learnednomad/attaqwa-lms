export default ({ env }) => {
  const uploadProvider = env('UPLOAD_PROVIDER', 'local');

  const uploadConfig =
    uploadProvider === 'aws-s3'
      ? {
          provider: 'aws-s3',
          providerOptions: {
            s3Options: {
              credentials: {
                accessKeyId: env('S3_ACCESS_KEY_ID'),
                secretAccessKey: env('S3_ACCESS_SECRET'),
              },
              endpoint: env('S3_ENDPOINT'), // e.g., http://minio:9000 (internal on Coolify)
              region: env('S3_REGION', 'us-east-1'),
              forcePathStyle: true, // Required for MinIO
              params: {
                Bucket: env('S3_BUCKET', 'uploads-public'),
              },
            },
            baseUrl: env('S3_BASE_URL'), // e.g., https://cdn.learnednomad.com
            prefix: env('S3_PREFIX', ''),
          },
        }
      : {
          provider: 'local',
        };

  // Email provider — nodemailer over SMTP. Works with any SMTP service:
  // Resend (smtp.resend.com:465 user=resend pass=re_xxx), SendGrid, Postmark,
  // Mailgun, SES SMTP, Gmail App Password, etc. If SMTP_HOST is unset the
  // plugin falls back to sendmail which doesn't exist in alpine — so we no-op
  // the email plugin in that case and let inquiries land in Strapi admin only.
  const smtpHost = env('SMTP_HOST');
  const emailConfig = smtpHost
    ? {
        provider: 'nodemailer',
        providerOptions: {
          host: smtpHost,
          port: env.int('SMTP_PORT', 465),
          secure: env.bool('SMTP_SECURE', true),
          auth: {
            user: env('SMTP_USER'),
            pass: env('SMTP_PASS'),
          },
        },
        settings: {
          defaultFrom: env('EMAIL_FROM', 'noreply@masjidattaqwaatlanta.org'),
          defaultReplyTo: env(
            'EMAIL_REPLY_TO',
            env('EMAIL_FROM', 'noreply@masjidattaqwaatlanta.org')
          ),
        },
      }
    : null;

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
    ...(emailConfig ? { email: { config: emailConfig } } : {}),
  };
};
