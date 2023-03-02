const Procurers = require('../models/procurers')
const Users = require('../models/users')
const users = []

const userJoin = ({id,roomId,userId,type})=>{
let user = {id,roomId,userId,type}
users.push(user)
return user
}

const getCurrentUser = ({id})=>{
    let currentUser = users.filter((val)=>val.id===id)
    console.log({users})
    return currentUser[currentUser.length-1]
}



const getSendUser = ({userId})=>{
    console.log({users})
    console.log({userId})
    try {
        let senderUser = users.filter((val)=>val.userId===userId)

        console.log({senderUser})
        return senderUser[senderUser.length-1].id
        
    } catch (error) {
        console.log(error)
        return 'error'
    }
 
}



const getLastUser  = ({id,room})=>{
    
    let index = users.findIndex((val)=>val.id ===id)
    console.log({room})
 // let filteredUsers = users.filter((val)=>val.room != room)
 

 // console.log({filteredUsers}) 

  
const userRemoved =users.splice(index,1)[0]

    console.log({userRemoved})
    console.log({users})

    if(index != -1){
        return userRemoved
    }
}

const deleteId = ({id})=>{
    

}



module.exports = {userJoin,getCurrentUser,getLastUser,getSendUser}




  

    

   



