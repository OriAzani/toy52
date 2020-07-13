
const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    remove,
    update,
    add
}
async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    console.log('criteria',criteria);

    var prop = (filterBy._sort === 'price') ? 'price' : 'name';
    var order = (filterBy._order === 'desc') ? -1 : 1;
    var sortBy = { [prop]: order }
    const collection = await dbService.getCollection('toy')
    try {
        const toys = await collection.find(criteria).sort(sortBy).toArray();
        return toys
    } catch (err) {
        console.log('ERROR: cannot find toys')
        throw err;
    }
}


async function getById(toyId) {
    const collection = await dbService.getCollection('toy')
    try {
        const toy = await collection.findOne({ "_id": ObjectId(toyId) })
        console.log('this is a toy from 32', toy);
        return toy;
    }
    catch (err) {
        console.log(`ERROR: while finding toy ${toyId}`)
        throw err;
    }
}


async function remove(toyId) {
    const collection = await dbService.getCollection('toy')
    try {
        await collection.deleteOne({ "_id": ObjectId(toyId) })
    } catch (err) {
        console.log(`ERROR: cannot remove toy ${toyId}`)
        throw err;
    }
}

async function update(toy) {
    const collection = await dbService.getCollection('toy')
    toy._id = ObjectId(toy._id);

    try {
        await collection.replaceOne({ "_id": toy._id }, { $set: toy })
        return toy
    } catch (err) {
        console.log(`ERROR: cannot update toy ${toy._id}`)
        throw err;
    }
}

async function add(toy) {
    const collection = await dbService.getCollection('toy')
    try {
        await collection.insertOne(toy);
        return toy;
    } catch (err) {
        console.log(`ERROR: cannot insert toy`)
        throw err;
    }
}


function _buildCriteria(filterBy) {
    const criteria = {};
console.log('criteria',criteria);
    if (filterBy.name) {
        var filterName = new RegExp(filterBy.name, 'i');
        criteria.name = { $regex: filterName }
    }
    //if (filterBy._sort !== 'all') criteria.sort = filterBy._sort
    if (filterBy.type) criteria.type = filterBy.type
    if(filterBy.inStock){
        criteria.inStock = (filterBy.inStock === 'true') ? true : false
    } 
    return criteria;
}




/////OLD  WAY TO GET FILTER PARAMS
// function query(filterBy) {
//     //console.log(filterBy);
//     let filteredToys = toys
//         if (filterBy.name) {
//              filteredToys = filteredToys.filter(toy => {
//                 return toy.name.includes(filterBy.name)
//             })
//         }
//         if (filterBy.type) {
//              filteredToys = filteredToys.filter(toy => {
//                 return toy.type === filterBy.type
//             })
//         }
//         if (filterBy.inStock) {
//              filteredToys = filteredToys.filter(toy => {
//                 return toy.inStock.toString() === filterBy.inStock
//             })
//         }

//         return Promise.resolve(filteredToys)
//     }

//////