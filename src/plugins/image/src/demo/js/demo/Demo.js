/**
 * Demo.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/*eslint no-console:0 */

define(
  'tinymce.plugins.image.demo.Demo',

  [
    'tinymce.plugins.image.Plugin',
    'global!tinymce'
  ],

  function (Plugin, tinymce) {
    return function () {

      tinymce.init({
        selector: "textarea.tinymce",
        theme: "modern",
        plugins: "image code preview",
        toolbar: "image code preview",
        height: 600
      });
    };
  }
);