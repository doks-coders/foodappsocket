const Chatrooms = require('../models/chatrooms');
const Procurers = require('../models/procurers');
const Users = require('../models/users')
const moment = require('moment');

const getAllChatRooms = async () => {
    try {

        const chatrooms = await Chatrooms.find();
        return chatrooms
    } catch (err) {
        return '404'
    }
}
const getSelectedChatRooms = (chatrooms) => {
    return new Promise(async (resolve, reject) => {


        getRooms(chatrooms).then(val => {
            resolve(val)
        }).catch(err => {
            reject(err)
        })
    })
}

const getChosenChat = (chatroomid) => {
    return new Promise((resolve, reject) => {
        Chatrooms.findById(chatroomid).then(async (val) => {
            let entries = Object.entries(val)
            let chatroom = entries.filter(val => val[0] == '_doc')[0]
            let user = await Users.findById(val['_doc'].userId)
            const procurer = await Procurers.findById(val['_doc'].procurerId)


            resolve({

                messages: val['_doc'].messages,
                name: user['_doc'].name,
                procurerName: procurer['_doc'].name,
            })
        }).catch(err => {
            reject(err)
        })
    })


}


const sendMessageToDatabase = async (value) => {
    let { chatroomid, mode, text } = value
    let message = {
        image: '',
        mode,
        text,
        time: moment().format('h:mm a')
    }
    try {
        //await  Users.updateOne({_id:ObjectId("dsds")},{$push:{cart:cartItem}} )

        let result = await Chatrooms.updateOne({ _id: chatroomid }, { $push: { messages: message } })
        return result
    } catch (error) {
        console.log(error)
    }


}

const getText = ({ object }) => {
    let value
    switch (object.text) {
        case 'Sent Order':
            value = `You have recieved an order from ${object.name}`
            break;

        case 'Sent Review':
            value = `${object.name} gave you a ${object.stars} star rating`
            break;

        case "Accepted Order":
            value = `${object.name} accepted your order`
            break;


        case "Deliver Order":
            value = `${object.name} has delivered your order`
            break;

        case "Declined Order":
                value = `${object.name} has declined your order`
                break;
            

        default:
            value = `You have recieved an order from error `
            break;
    }
    return value
}
const sendNotification = (order) => {
    return new Promise(async (resolve, reject) => {
        let message = getText({ object: order })
        try {
            await Procurers.updateOne({ _id: order.procurerId }, { $push: { notifications: order } })
            await Users.updateOne({ _id: order.userId }, { $push: { notifications: order } })
            resolve({message,mode:order.mode})
        } catch (error) {
            reject(error)
        }
    })

}

module.exports = { sendNotification, getAllChatRooms, getSelectedChatRooms, getChosenChat, sendMessageToDatabase }



function getRooms(chatrooms) {
    return new Promise(async (resolve, reject) => {
        const chosenRooms = await Chatrooms.find({ _id: { $in: chatrooms } })
        const chosenRoomsE = []
        const unavailable = []
        chosenRooms.forEach(async (val) => {
            let item = val['_doc']
            const procurerInfo = await Procurers.findById(val.procurerId)
            const usersInfo = await Users.findById(val.userId)

            try {
                item = { ...item, name: usersInfo['_doc'].name, procurerName: procurerInfo['_doc'].name }
                chosenRoomsE.push(item)
            } catch (err) {
                console.log(err)
                unavailable.push(1)
            }

            if ((chosenRoomsE.length + unavailable.length) == chosenRooms.length) {
                resolve(chosenRoomsE)
            }
        })

    })
}












