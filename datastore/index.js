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
  var data;
  var id;
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      console.log('error occurred!');
      callback(err, null);
    }
    data = files.map((name)=>{
      id = name.split('.')[0];
      return {id, text:id};
    })
    callback(null, data)
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, id+'.txt'), (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, {id, text:text.toString()});
    }
  });
};

exports.update = (id, text, callback) => {
  fs.writeFile(path.join(exports.dataDir, id+'.txt'), text, (err) => {
    if (err) {
      callback(new Error('File write failed',id,' ',text));
    } else {
      callback(null, text);
    }
  })
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
