const Chatrooms = require('../models/chatrooms');
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
    return new Promise((resolve, reject) => {
        getRooms(chatrooms).then(val=>{
            resolve(val)
        }).catch(err=>{
            reject(err)
        })
    })
   
   
}
const getChosenChat = (id)=>{
    return new Promise((resolve, reject) => {
        Chatrooms.findById(id).then(val=>{
 let entries = Object.entries(val)
 let chatroom =  entries.filter(val=>val[0]=='_doc')[0]

            resolve(val['_doc'].messages)
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
   console.log({result})
     return result
    } catch (error) {
        console.log(error)
    }


}




module.exports = {getAllChatRooms,getSelectedChatRooms,getChosenChat,sendMessageToDatabase}



function getRooms(chatrooms) {
    return new Promise((resolve, reject) => {
        let chosenRooms = []
        chatrooms.forEach((val)=>{
          Chatrooms.findById(val).then(val=>{
            chosenRooms.push(val)
         })
        })
        let tid =  setInterval(()=>{
            console.log('checking')
            if(chatrooms.length ==chosenRooms.length){
                resolve(chosenRooms)
                clearInterval(tid)
            }
        },500)

        setTimeout(()=>{
            clearInterval(tid)
        },4000)

       
       
    })
  } 
  
 
