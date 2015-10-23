# ALPS Server

NOTE: This is a prototype as a proof of concept.

Profiles copied from https://github.com/alps-io/imports

## Usage

First, install the needed packages.

```sh
npm install
```

Next, run the transform script to transform all files to HTML. The command below will replace the current ALPS URLs with
the development one.

```sh
node bin/transform http://127.0.0.1:3000/profile
```

Last, run the server and navigate to <http://127.0.0.1:3000>.

```sh
node app.js
```

## Formats

You can browse the site in your browser and request `text/xml` to get the relevant XML files. You may also add `.xml` on
the end of each URL as a way of linking actual XML documents.
