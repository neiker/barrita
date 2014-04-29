Barrita
=================

This is a minimalist solution to replace native scrollbars. No more "big features" will be added, so, if this don't cover your needs, I highly recommend [perfect-scrollbar](https://github.com/noraesae/perfect-scrollbar). 

Install
-------

You can choose one of these options:

- [Download the latest release.](https://github.com/neiker/barrita/archive/master.zip)
- Clone the repository: ```git clone https://github.com/neiker/barrita.git ```
- Or just use [Bower](http://bower.io/): ```bower install barrita```


How to Use it
----------

Basic usage:
```javascript
$('#scrolleable').barrita();
```

Manually update scrollbar size on each load image event:
```javascript
var $scrolleable = $("#scrolleable");
$scrolleable.barrita({resize: 'manual'});
$scrolleable.find('img').on('load', function (e) { 
    $scrolleable.barrita('resize');
});
```

Listen to positionChange event:
```javascript
var $scrolleable = $("#scrolleable");
$scrolleable.barrita({hoverTimeout: 0});
$scrolleable.on('barrita:positionChange', function(e, data) {
    console.log(data);
});
```

For better understanding see index.html source.

Optional parameters
-------------------
### resize
Listen to content/wrapper size changes and adapt scrollbar. I suggest to use 'manual' as value here to improve performance, and then, manually call resize action when you need it (window/wrapper resize, new content, show/hide content, etc).
**Default: auto**

### hoverTimeout
Remove 'hover' class from element after x ms than mouseout event was triggered. Use 'false' to avoid this behavior and never hide the scrollbar or 0 to immediately hide it.
**Default: 500**

Events
-------------------
### barrita:init
**Params:** barrita instance.

### barrita:positionChange
**Params:** Object cointaining: scrollTop (int), onTop (bool) and onBottom (bool) properties.

### barrita:destroy


Actions
-------------------
### destroy
Restore original element.
```javascript
$("#scrolleable").barrita('destroy');
```

### resize
Recalculate bar size.
```javascript
$("#scrolleable").barrita('resize');
```

### setPosition
Set scrollTop property.
```javascript
$("#scrolleable").barrita('setPosition', 600);
```

### addContent
Add content to the scrolled element.
```javascript
$("#scrolleable").barrita('addContent', "<h1>Some title</h1>h1>");
```

### setContent
Empty the scrolled element and sets a new content.
```javascript
$("#scrolleable").barrita('setContent', "<h1>Some title</h1>h1>");
```

Dependencies 
----------
### Required
- [jQuery](https://github.com/jquery/jquery)

### Optional
- [es5-shim](https://github.com/es-shims/es5-shim) (Only if you want to support IE6/7/8)

TODO
--------
- Improve personalization options.
- Better browser compatibility.

Contributing
--------
If you have any suggestion or improve, feel free of make a pull request with your changes or contact me on twitter ([@neiker](http://twitter.com/neiker)) if you have a great idea but you are too lazy to code it.

Please, respect basic code style guidelines: 

- 4 spaces indentation
- Use descriptive variable and method names
- Remove trailing whitespace
- Use curly braces for single-line control flow statements
- (try to) respect max [cyclomatic complexity](http://www.elijahmanor.com/control-the-complexity-of-your-javascript-functions-with-jshint/)
- Dont't forgot to writte optional semicolons. 

Just use ```grunt jshint``` to check if you don't break any of these rules. Also, you will find useful ```grunt build``` (prod compile) and ```grunt``` (dev compile + watch).

About <del>me</del> my english skills
--------
They sucks, I know it. 

License
-------

The MIT License (MIT)

Copyright (c) 2014 Javier Alejandro Alvarez <neiker@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.