const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    items[id] = text;
    // make a new file with content the text, and filename id
    fs.writeFile(exports.dataDir+'/'+id+'.txt', text, (err)=>{
      if (err) {
        console.log('Error saving new todo');
      } else {
        callback(null, { id, text }); 
      }
    });
  });
};

exports.readAll = (callback) => {
  var ids;
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      console.log('read all failed!');
    } else {
      console.log(files[0]);
      console.log(files[0].split('.'));
      ids = files.map((val)=> val.split('.')[0]);
      console.log('succeeded!', ids);
      callback(null, ids);
    }
  });

  // var data = _.map(items, (text, id) => {
  //   // console.log('current text: ' + text, 'current id: ' + id);
  //   return { id, text };
  // });
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
