# Yewno Widget Primo Studio Addon

## Overview

Add the Yewno Graph Widget to your Primo facet group.

![Yewno Widget](https://github.com/yewno/primo-addon/tree/primo-facet-addon/yewno-primo-facet-addon.png?raw=true)

### Usage

#### Adding the Package to your view in `primo-explore`

run the following command from within your view's main directory to add it as a dependency.

```bash
$ npm install --save-dev yewno-primo-facet-addon
```

this should add the following line to your `package.json` file...

```json
"yewno-primo-facet-addon": "^0.0.2"
```

and add the contents of this repository (at that npm version) into a `node_modules/yewno-primo-facet-addon`
  directory for your current view. the presence of this package should mean that the package was successfully
  installed and added to your project.

#### Installing/Importing it

from here you'll have to edit your `main.js` (or `config.module.js`) file to import the package, and
  add `yewnoPrimoFacetAddon` to the dependencies inside of your 'viewCustom' module. 

```js
import 'yewno-primo-facet-addon';
angular.module('viewCustom', ['angularLoad', 'yewnoPrimoFacetAddon']);
```
