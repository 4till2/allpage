1. Clone [NextAuth example](https://github.com/nextauthjs/next-auth-example) into [Vercel](https://vercel.com/yserkez/linksonlinks)
2. Swap all imports of `next-auth/client` to `next-auth/react`
3. Change `Providers` to specific providers: Ie. `import Twitter from next-auth/providers/twitter` instead of `import Providers from next-auth/providers`
4. Install and configure [Prisma adapter](https://next-auth.js.org/adapters/prisma)
5. Install peer dependency `nodemailer`
6. Create two Heroku dev postgres instances. A) Database B) [Shadow Database for development](https://data.heroku.com/datastores/97531c0c-4817-498d-98bc-c347e31fcf4b#)
7. Create [email server](https://app.mailgun.com/app/sending/domains/sandbox7ddbe9e51d7348fcbc0ed0a22c3c1a1a.mailgun.org)
8. Create test [email receiver](https://testmail.app/console#quickstart)
9. Delete `.next` restart server, and clear page cache to fix `ChunkLoadError: Loading chunk node_modules_next_dist_client_dev_noop_js failed.`
10. Create global [prisma client](/db-client.js) to fix [to many instances of prisma](https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices)
11. Connect to aws s3 for image uploading [](https://github.com/leerob/nextjs-aws-s3)
12. `body` headers matter when sending to next/api since it uses bodyParser ```headers: new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    }),```
13. 
