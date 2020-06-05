export default {
  createRegister: function(results) {
    var items = []
    for (var counter = 0; counter <= results.length - 1; counter++) {
      var addItem = {}
      addItem.value = results[counter].name
      addItem.text = results[counter].name
      addItem.id = results[counter].id
      items.push(addItem)
    }
    return items
  }, // end createRegister
  createFilter: function(queryString) {
    return (link) => {
      return (link.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
    }
  } // end createFilter

}
export function getColor(text) {
  const colours = ['#8BC34A', '#f44336', '#E91E63', '#673AB7', '#3F51B5', '#2196F3', '#009688', '#FF9800', '#FF5722']
  if (!text) {
    return colours[0]
  } else {
    var sum = 0
    for (var i = 0; i < text.length; i++) {
      sum += text.charCodeAt(i)
    }
    return colours[sum % colours.length]
  }
}

export function unFlatten(data) {
  var result = {}
  for (var i in data) {
    var keys = i.split('$')
    keys.reduce(function(r, e, j) {
      return r[e] || (r[e] = isNaN(Number(keys[j + 1])) ? (keys.length - 1 === j ? data[i] : {}) : [])
    }, result)
  }
  return result
}

export function flatten(ob) {
  var toReturn = {}

  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue

    if ((typeof ob[i]) === 'object' && ob[i] !== null) {
      var flatObject = flatten(ob[i])
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue

        toReturn[i + '$' + x] = flatObject[x]
      }
    } else {
      toReturn[i] = ob[i]
    }
  }
  return toReturn
}

export function timeSinceMinutes(date1, date2) {
  var text = '-'

  if (date1 && date2) {
    var diff = date1 - date2
    var minutes = Math.floor((diff / 1000) / 60)

    if (minutes) {
      text = minutes + '  m'
    }
  }

  return text
}

export function dateFormatterToString(rawDate) {
  var text = '-'
  if (rawDate) {
    var date = new Date(rawDate)
    text = date.toLocaleDateString() + ' ' + timeFormatter(date)
  }
  return text
}

export function timeFormatter(d) {
  var h = addZero(d.getHours())
  var m = addZero(d.getMinutes())
  return h + ':' + m
}

export function addZero(i) {
  if (i < 10) {
    i = '0' + i
  }
  return i
}
