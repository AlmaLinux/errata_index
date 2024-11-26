# AlmaLinux Errata Index
__AlmaLinux Errata Index__ is a simple web application that displays the errata information published for AlmaLinux distributions.
It is the source code running at https://errata.almalinux.org.
It consumes the data exported from the AlmaLinux Build System and provides an interface to consult, search and explore the erratas.

The web application has been created using [Vue.js](https://vuejs.org/) and uses the [Quasar Framework](https://quasar.dev/).

## Set up and run the code
* You need to install the dependencies running: `npm install`
* To compile and hot-reload during development, run: `npm run serve`
* To compile and minify the web application for production, run: `npm run build`
* Lint the code by running: `npm run lint`

To customize the configuration, check _Vue.js_ [Configuration Reference](https://cli.vuejs.org/config/).

For development purposes, you would like to add the required data into the _public_ folder, this data consists in:
* _errata.json_: Raw data of erratas
* _Errata pages_: Automatically and static generated errata pages. You don't need to fetch them all, but only a few of them

i.e.: For AlmaLinux 8, you can fetch them from [here](https://errata.almalinux.org/8/)

## Contributing
Any question? Found a bug? File an [issue](https://github.com/AlmaLinux/errata_index/issues).
Do you want to contribute with source code?
1. Fork the repository on Github
2. Create a new feature branch
3. Write your change
4. Submit a pull request

### Style Guidelines

When making any style-related changes to this project, please ensure they align with the [AlmaLinux BrandBook](https://github.com/AlmaLinux/almalinux.org/blob/master/static/branding/AlmaLinux%20BrandBook.pdf). 
