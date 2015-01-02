// Generated by CoffeeScript 1.8.0
(function() {
  var measureHerokuHeaders, safeParseInt;

  safeParseInt = function(val) {
    var e;
    try {
      return parseInt(val, 10);
    } catch (_error) {
      e = _error;
      return null;
    }
  };

  measureHerokuHeaders = function(librato, req) {
    var val;
    if ((val = safeParseInt(req.headers['x-heroku-dynos-in-use'])) != null) {
      librato.measure('heroku.dynos', val);
    }
    if ((val = safeParseInt(req.headers['x-heroku-queue-depth'])) != null) {
      librato.measure('heroku.queueDepth', val);
    }
    if ((val = safeParseInt(req.headers['x-heroku-queue-wait-time'])) != null) {
      return librato.measure('heroku.queueWaitTime', val);
    }
  };

  module.exports = function(librato) {
    return function(_arg) {
      var requestCountKey, requestWaitTimeKey, responseTimeKey, statusCodeKey, _ref;
      _ref = _arg != null ? _arg : {}, requestCountKey = _ref.requestCountKey, responseTimeKey = _ref.responseTimeKey, statusCodeKey = _ref.statusCodeKey, requestWaitTimeKey = _ref.requestWaitTimeKey;
      return function(req, res, next) {
        var end, val;
        req._libratoStartTime = new Date;
        if (req._librato != null) {
          return next();
        }
        req._librato = true;
        librato.increment(requestCountKey != null ? requestCountKey : 'requestCount');
        if ((req.headers['x-request-start'] != null) && ((val = safeParseInt(req.headers['x-request-start'])) != null)) {
          librato.measure(requestWaitTimeKey != null ? requestWaitTimeKey : 'requestWaitTime', new Date().getTime() - val);
        }
        if (req.headers['x-heroku-dynos-in-use'] != null) {
          measureHerokuHeaders(librato, req);
        }
        end = res.end;
        res.end = function(chunk, encoding) {
          res.end = end;
          res.end(chunk, encoding);
          librato.timing(responseTimeKey != null ? responseTimeKey : 'responseTime', new Date - req._libratoStartTime);
          return librato.increment("" + (statusCodeKey != null ? statusCodeKey : 'statusCode') + "." + (Math.floor(res.statusCode / 100)) + "xx");
        };
        return next();
      };
    };
  };

}).call(this);

//# sourceMappingURL=middleware.js.map