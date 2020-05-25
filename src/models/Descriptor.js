let {DescriptorFields,DescriptorDb} = require("../databases/Descriptor");
let getListDescriptor = async ()=>{
    return await DescriptorDb.findAll();
}
module.exports = {
    getListDescriptor
}