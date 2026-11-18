# DAFU 大福

An English and Simplified Chinese restaurant-group site for visitors planning where to eat in Genting Highlands. Astro renders content from EmDash and runs on Cloudflare Workers with D1 and R2.

## Run locally

Use Node.js 24, or Node.js 22.23.4 or newer.

```sh
npm ci
npm run build
npm run preview
```

Open the preview URL printed by Astro. The EmDash setup wizard is at `/_emdash/admin`. It imports the starter content during first-time setup. For an authenticated development session, run `npm run dev` and use the local setup link printed by EmDash. The project contains no credentials.

## Edit the site

- **Site pages** holds the homepage, brand story, and main page introductions. Edit the English and Chinese fields together and publish the revision.
- **Restaurants** holds the three concepts, their menu highlights, links to complete menus, main images, and featured dishes. Publish a restaurant to add it to the directory. Use Position to order the cards.
- **Outlets** holds the address, hours, contact fields, and Google Maps destination for each outlet. Set Restaurant to the corresponding restaurant slug. Multiple outlets can use the same slug.
- **Promotions & news** holds announcements and offers. For dated offers, enter the last valid day in Ends as YYYY-MM-DD in Malaysian time.
- Upload approved WebP food and venue photography in the EmDash Media library, then select it on the corresponding page or restaurant entry. Add descriptive alternative text to photos that convey information.

## Cloudflare test deployment

The Worker is `test-dafu-restaurant-astro` in the confirmed `Eason CF Main` account. The Wrangler configuration records the site’s dedicated D1 database and session namespace. The Media binding uses the site’s dedicated R2 bucket.

- [Restaurant site](https://test-dafu-restaurant-astro.easondev.workers.dev/)
- [EmDash admin](https://test-dafu-restaurant-astro.easondev.workers.dev/_emdash/admin)
- [First administrator setup](https://test-dafu-restaurant-astro.easondev.workers.dev/_emdash/admin/setup)

The first administrator registers a passkey with their own browser and email address. First-time setup is protected by the Worker’s `DAFU_SETUP_PASSWORD` secret. Use the launch credentials provided separately. There are no credentials in this project.

The four 1K Seedream 5.5 images are illustrative. The live entries use EmDash media backed by R2. Optimized WebP files in `public/media` also supply the initial local preview. For a fresh deployment, upload those files in the EmDash Media library and select them in the corresponding page and restaurant entries.

Use `npm run deploy` with the configured Cloudflare credentials to publish code changes. The build packages the Astro Worker into one module for upload. Provision the first-time setup secret when creating a new Worker.

The test deployment is in EmDash staging mode. It includes a sitemap, titles and descriptions, canonical and alternate-language links, and restaurant structured data. The final keyword mapping needs DAFU’s selected list of 30 terms.

The existing entries use public listings for the Seafood and Congee outlets. Confirm full menus, direct contacts, Sing Bar’s outlet details, and any Klang Valley outlets with DAFU before publishing those particulars.

Sources

- [Resorts World Genting seafood outlet and member offer](https://www.rwgenting.com/en/genting-rewards/promotions/grc-x-tai-fook-seafood-dai-pai-dong.html)
- [Resorts World Genting SkyAvenue directory](https://www.rwgenting.com/en/things-to-do/shopping/skyavenue-complex.html)
- [Visit Genting congee outlet listing](https://visitgenting.com/shop/dafu-congee-at-skyavenue-genting)
