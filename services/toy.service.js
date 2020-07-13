const fs = require('fs')
const toys = require('../data/db.json')
module.exports = {
    query,
    remove,
    getById,
    save,
}
function query(filterBy) {
//console.log(filterBy);
let filteredToys = toys
    if (filterBy.name) {
         filteredToys = filteredToys.filter(toy => {
            return toy.name.includes(filterBy.name)
        })
    }
    if (filterBy.type) {
         filteredToys = filteredToys.filter(toy => {
            return toy.type === filterBy.type
        })
    }
    if (filterBy.inStock) {
         filteredToys = filteredToys.filter(toy => {
            return toy.inStock.toString() === filterBy.inStock
        })
    }

    return Promise.resolve(filteredToys)
}



function remove(toyId) {
   // console.log('in remove')
    const idx = toys.findIndex(toy => toy._id === toyId)
    if (idx >= 0) toys.splice(idx, 1)
    _saveToysToFile()
    return Promise.resolve();
}

function getById(toyId) {
    const toy = toys.find(toy => toy._id == parseInt(toyId))
    return Promise.resolve(toy);
}

function save(toy) {
    if (toy._id) {
        const idx = toys.findIndex(currToy => currToy._id === toy._id)
        toys.splice(idx, 1, toy);
    } else {
        toy._id = _makeId();
        toy.createdAt = Date.now(),
            toys.unshift(toy);
    }
    _saveToysToFile()
    return Promise.resolve(toy)
}

function _saveToysToFile() {
    fs.writeFileSync('data/toy.json', JSON.stringify(toys, null, 2));
}

function _makeId(length = 5) {
    var txt = '';
    var possible = '0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

// function _makeId(length = 5) {
//     var txt = '';
//     var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     for (var i = 0; i < length; i++) {
//         txt += possible.charAt(Math.floor(Math.random() * possible.length));
//     }
//     return txt;
// }

