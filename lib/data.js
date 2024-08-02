const fs = require('fs');
const path = require('path');


const lib = {}

lib.basedir = path.join(__dirname,'/../.data/');



lib.create = (dir, file, data) => {
    return new Promise((resolve, reject) => {
        fs.open(path.join(lib.basedir, dir, file + '.json'), 'wx', (err, fileDescriptor) => {
            if (!err && fileDescriptor) {
                const stringData = JSON.stringify(data);
                fs.writeFile(fileDescriptor, stringData, (err) => {
                    if (!err) {
                        fs.close(fileDescriptor, (err) => {
                            if (!err) {
                                resolve(true);
                            } else {
                                reject('Error closing new file');
                            }
                        });
                    } else {
                        reject('Error writing to new file');
                    }
                });
            } else {
                reject('Could not create new file, it may already exist');
            }
        });
    });
};



lib.read = async (dir, file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                try {
                    const parsedData = JSON.parse(data);
                    resolve(parsedData);
                } catch (parseError) {
                    reject('Error parsing JSON data');
                }
            }
        });
    });
};

lib.update = (dir, file, data) => {
    return new Promise((resolve, reject) => {
        fs.open(path.join(lib.basedir, dir, file + '.json'), 'r+', (err, fileDescriptor) => {
            if (!err && fileDescriptor) {
                const stringData = JSON.stringify(data);
                fs.ftruncate(fileDescriptor, (err) => {
                    if (!err) {
                        fs.writeFile(fileDescriptor, stringData, (err) => {
                            if (!err) {
                                fs.close(fileDescriptor, (err) => {
                                    if (!err) {
                                        resolve(true);
                                    } else {
                                        reject('Error closing file');
                                    }
                                });
                            } else {
                                reject('Error writing to existing file');
                            }
                        });
                    } else {
                        reject('Error truncating file');
                    }
                });
            } else {
                reject('Error updating. File may not exist');
            }
        });
    });
};
lib.delete = (dir, file) => {
    return new Promise((resolve, reject) => {
        fs.unlink(path.join(lib.basedir, dir, file + '.json'), (err) => {
            if (!err) {
                resolve(true);
            } else {
                reject('Error deleting file');
            }
        });
    });
};


module.exports = lib;