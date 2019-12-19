const sheetbaseTemplate = require('@sheetbase/app-scripts/ayedocs-plugin/sheetbase.template');

module.exports = {
  fileRender: {
    'README.md': sheetbaseTemplate(true)
  }
};
