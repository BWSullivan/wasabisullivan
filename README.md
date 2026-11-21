This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Use Node.js 26. If you use nvm, run `nvm install` and `nvm use` from the project directory. Run `npm ci` to install the locked dependencies.

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Publishing photos

1. In the Cloudinary Media Library, batch-upload full-resolution images into `Japan2023` or `Eclipse2024`. Use a preset that keeps the original dimensions.
2. Check that the images have public delivery and that their public IDs start with `Japan2023/` or `Eclipse2024/`. In Cloudinary’s Dynamic Folders mode, configure the upload preset to use the asset folder as the public ID prefix. In Fixed Folders mode, the folder is already part of the public ID. [Cloudinary upload presets](https://cloudinary.com/documentation/upload_presets)
3. Optionally set the `alt` contextual field on each photo to describe it for screen readers.

The galleries refresh their photo lists on a one-minute cache interval. A new upload to either existing album appears without a code change or redeploy. Visitors see responsive previews, can zoom to the original pixel dimensions, and can download the full-resolution file.

To load galleries locally, set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in your ignored `.env.local` file. A `CLOUDINARY_URL` connection string also works. Keep these values server-side.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
