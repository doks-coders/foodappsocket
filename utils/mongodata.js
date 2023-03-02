const Chatrooms = require('../models/chatrooms');
const Procurers = require('../models/procurers');
const Users = require('../models/users')
const moment = require('moment');

const getAllChatRooms = async()=> {
    try {

        const chatrooms = await Chatrooms.find();
      return chatrooms
    } catch (err) {
        return '404'
    }
}
const getSelectedChatRooms = (chatrooms)=>{
    return new Promise(async (resolve, reject) => {

    
        getRooms(chatrooms).then(val=>{
            resolve(val)
        }).catch(err=>{
            reject(err)
        })
    })
}

const getChosenChat = (chatroomid)=>{
    return new Promise((resolve, reject) => {
        Chatrooms.findById(chatroomid).then(async(val)=>{
 let entries = Object.entries(val)
 let chatroom =  entries.filter(val=>val[0]=='_doc')[0]
 let user = await Users.findById(val['_doc'].userId)
 const procurer = await Procurers.findById(val['_doc'].procurerId)


            resolve({

            messages:val['_doc'].messages,
            name:user['_doc'].name,
            procurerName:procurer['_doc'].name,
        })
        }).catch(err=>{
            reject(err)
        })
    })


}


const   sendMessageToDatabase = async(value)=>{
    let {chatroomid,mode,text} = value
    let message = {
        image:'',
        mode,
        text,
        time:moment().format('h:mm a')
    }
    try {
     //await  Users.updateOne({_id:ObjectId("dsds")},{$push:{cart:cartItem}} )

     let result = await Chatrooms.updateOne({_id:chatroomid},{$push:{messages:message}})
     return result
    } catch (error) {
        console.log(error)
    }


}




module.exports = {getAllChatRooms,getSelectedChatRooms,getChosenChat,sendMessageToDatabase}



function getRooms(chatrooms) {
    return new Promise( async(resolve, reject) => {
       const chosenRooms =  await Chatrooms.find({_id:{$in:chatrooms}}) 
        const chosenRoomsE = []
        const unavailable = []
        chosenRooms.forEach(async(val)=>{ 
        let item = val['_doc'] 
      const procurerInfo =  await  Procurers.findById(val.procurerId)
       const usersInfo = await  Users.findById(val.userId)

       try{
        item = {...item,name:usersInfo['_doc'].name,procurerName:procurerInfo['_doc'].name}
        chosenRoomsE.push(item)
       }catch(err){
        console.log(err)
        unavailable.push(1)
       }

       if((chosenRoomsE.length +unavailable.length)== chosenRooms.length){
        resolve(chosenRoomsE)
       }
        })

    })
}

         
        
       
       
    
       
       
    
   
  
 
