// const sheetbaseTemplate = require('@sheetbase/app-scripts/ayedocs-plugin/sheetbase.template');
const sheetbaseRoutingTemplate = require('../../app-scripts/ayedocs-plugin/sheetbase-routing.template');

module.exports = {
  fileRender: {
    // 'README.md': sheetbaseTemplate(true)
    'TEST.md': sheetbaseRoutingTemplate()
  }
};
