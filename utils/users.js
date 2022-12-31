const users = []

const userJoin = ({id,room})=>{
let user = {id,room}
users.push(user)
return user
}

const getCurrentUser = ({id})=>{
    let currentUser = users.filter((val)=>val.id===id)
    console.log(users)
    return currentUser[currentUser.length-1]
}
const getLastUser  = ({id})=>{
    
    let index = users.findIndex((val)=>val.id ===id)
    console.log(users)
    if(index != -1){
        return users.splice(index,1)[0]
    }
}

const deleteId = ({id})=>{
    

}



module.exports = {userJoin,getCurrentUser,getLastUser}




  

    

   



