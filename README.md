# Readme Tutorial Testing

Repository for testing [dashplatform.readme.io](https://dashplatform.readme.io/docs/tutorials-introduction) JavaScript tutorials.

[![SDK Version](https://img.shields.io/github/package-json/dependency-version/thephez/readme-tutorial-testing/dash)](https://github.com/thephez/readme-tutorial-testing/blob/main/package.json)
[![Node.js CI](https://github.com/thephez/readme-tutorial-testing/workflows/Node.js%20CI/badge.svg)](https://github.com/thephez/readme-tutorial-testing/actions?query=workflow%3A%22Node.js+CI%22)

## Install

```
npm install
```

## Usage

Create an `.env` file that sets `WALLET_MNEMONIC` to a valid wallet mnemonic that you will fund and
`SYNC_START_HEIGHT` to the height at which to begin the wallet sync process. See
[.env.example](./.env.example) for an example `.env` file.

Once the wallet has been funded, run the following command:

``` shell
npm run test
```

## Contributing

PRs accepted.

## License

MIT © thephez