const fs = require('fs')

if (process.argv.length < 3) {
  throw new Error('Please specify a file')
}

const file = `dist/js/${process.argv[2]}`
const isMin = file.indexOf('min.js') !== -1
if (!fs.existsSync(file)) {
  throw new Error('File not found')
}

const contentFile = fs.readFileSync(file)
fs.readFile('package.json', (err, data) => {
  if (err) {
    throw err
  }

  const pkg = JSON.parse(data)
  const year = new Date().getFullYear()

  const header = `/*!
 * Bootstrap v${pkg.version} (${pkg.homepage})
 * Copyright 2011-${year} ${pkg.author}
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */
  `

const stampTop =`${header}
if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\\'s JavaScript requires jQuery. jQuery must be included before Bootstrap\\'s JavaScript.')
}

(function ($) {
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] >= 4)) {
    throw new Error('Bootstrap\\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0')
  }
})(jQuery);

(function () {
`
  const stampEnd = `})()`
  var content
  
  if (!isMin) {
    content = `${stampTop}${contentFile}${stampEnd}`
  } else {
    content = `${header}${contentFile}`
  }
  fs.writeFileSync(file, content)
})
