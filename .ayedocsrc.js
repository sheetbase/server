const sheetbaseTemplate = require('@sheetbase/app-scripts/ayedocs-plugins/sheetbase.template');

module.exports = {
  fileRender: {
    'README.md': sheetbaseTemplate(true)
  }
};
