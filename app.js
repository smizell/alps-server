var fs = require('fs');
var path = require('path');

var _ = require('lodash');
var async = require('async');
var express = require('express');
var jade = require('jade');

var profileDir = path.resolve(__dirname, 'profiles');
var templateDir = path.resolve(__dirname, 'templates');

var sources = {
  'schema.org': 'Schema.org'
}

// ----------------------------------------------------------------------------
// Routes

var app = express();

// TODO: Handle errors

app.get('/', function(req, res) {
  var template = jade.compileFile(path.resolve(templateDir, 'index.jade'));
  res.send(template());
});

app.get('/profiles/:source', function(req, res) {
  var source = req.params.source;
  var directory = path.resolve(profileDir, source);
  var template = jade.compileFile(path.resolve(templateDir, 'source.jade'));

  fs.readdir(directory, function(error, files) {
    var profileUrls = {};
    async.each(files, function(file, callback) {
      var profile = file.split('.')[0];
      if (!_.endsWith(profile, '-final') && path.extname(file) === '.xml') {
        var profileName = profile.split('.')[0];
        profileUrls[profileName] = profileUrl(source, profile);
      }
      callback();
    }, function(error) {
      res.send(template({
        source: sources[source],
        profiles: profileUrls
      }));
    });
  });
});

app.get('/profiles/:source/:profile.xml', function (req, res) {
  var source = req.params.source;
  var profile = req.params.profile;
  var directory = path.resolve(profileDir, source);

  var xmlResponse = getXml(directory, profile, function(error, xml) {
    res.set('Content-Type', 'text/xml');
    res.send(xml);
  });

  xmlResponse();
});

app.get('/profiles/:source/:profile', function (req, res) {
  var source = req.params.source;
  var profile = req.params.profile;
  var directory = path.resolve(profileDir, source);

  res.format({
    xml: getXml(directory, profile, function(error, xml) {
      res.send(xml);
    }),
    html: getHtml(directory, profile, function(error, html) {
      res.send(html);
    })
  })
});

// ----------------------------------------------------------------------------
// Initializing Server


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});

// ----------------------------------------------------------------------------

function getFilename(directory, profile, extension) {
  return path.resolve(directory, profile + '-final.' + extension);
}

function profileUrl(directory, profile) {
  return '/profiles/' + directory + '/' + profile
}

function getXml(directory, profile, callback) {
  var filename = getFilename(directory, profile, 'xml');
  var data = fs.readFileSync(filename, 'utf8');

  return function() {
    callback(null, data);
  }
}

function getHtml(directory, profile, callback) {
  var filename = getFilename(directory, profile, 'html');
  var data = fs.readFileSync(filename, 'utf8');
  var template = jade.compileFile(path.resolve(templateDir, 'profile.jade'));

  return function() {
    callback(null, template({
      profile: data
    }));
  }
}
