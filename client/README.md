# Syncopate Client

## Requirements
- [node](https://nodejs.org/) v10.17.x or newer
- [yarn](https://classic.yarnpkg.com/en/docs/install)

## Initial Setup
To get started just install the node packages with
`yarn install`
You may also want to add the ESLint plugin to VSCode in order to see any errors before you build

## Development Server
Hosted on [localhost:3000](localhost:3000)
Run `yarn start` to start the development server

## Build
You can build the project with
`yarn build`
For production build, use
`yarn build:prod`

## Documentation and Testing

### Docs
You can generate docs from the comments with
`yarn docs`
This will generate a site in /docs with the availble documentation

### Lint
A report of all linting errors and warnings can be generated with
`yarn lint`
The output will be an html file called eslint_report.html

### Test
The test suite can be run with
`yarn test`
Coverage report will be outputted to /coverage