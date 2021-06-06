const Group = require("../../model/Group")
const index=async(req,res)=>{
    try {
        const group=await Group.find();
        return res.send(group);
    } catch (e) {
        return res.status(500).send('bad error');
    }
}
const create=async(req,res)=>{
    try{
        const group=new Group({
            name:req.body.name
        })
        await group.save()
        res.send(group)
    }catch(e){
        return res.status(500).send('bad error');
    }
}
module.exports.index=index;
module.exports.create=create