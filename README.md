<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>
<h1 align="center">
  Medusa Feature Displays
</h1>

<p align="center">A plugin that fetches the current exchange rates for every store currency every 2 hours.</p>

## Compatibility
This plugin is compatible with versions >1.20.6 of `@medusajs/medusa`

Probably also works with earlier versions 1.20 and 1.19 versions

## Requirements
This plugin requires you have the Medusajs' Admin.
[@medusajs/admin](https://medusajs.com/admin/)

## Getting Started

Installation
```bash
  yarn add medusa-plugin-currency-exchange-rates
  OR
  npm install medusa-plugin-currency-exchange-rates
```

Add to ```.env``` and Replace ```<YOUR_API_KEY>``` with your API Key that you can obtain from [exchangeratesapi.io](https://exchangeratesapi.io/)
```bash
  EXCHANGERATESAPI_API_KEY=<YOUR_API_KEY>
```

Add to ```medusa-config.js```
```bash
  ///...other plugins
  {
    resolve: `medusa-plugin-currency-exchange-rates`,
    options: {
      enableUI: true,
      apiKey: process.env.EXCHANGERATESAPI_API_KEY
    },
  },
```

Run Database Migrations
```bash
  npx medusa migrations run
```

Start the server
```bash
  medusa develop
```

## Roadmap
Once the ```medusajs v2.0``` is released and stable, I will migrate this plugin to the newest version. This will probably be around end of this year, worst case next year.

## Quick Notes
- The Rates are fetched every even 2nd hour (0:00, 2:00, 4:00, ...) 24 hours a day - so 12 times in a day.
- I recommend you purchase the Basic Plan for 10$, as it allows you to fetch exchange rates for ~28 currencies throughout a whole month.
- Unfortunately, the Free Tier only allows for HTTP fetch requests and limits monthly request to 250, therefore I have not implemented functionality for it. It also limits you to only be able to fetch the rates for the Euro.