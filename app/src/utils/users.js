let userList = [
    {
        id: "1",
        username: "Trần Mỹ Phú An",
        room: "room1"
    },
    {
        id: "2",
        username: "Trần Văn Tin",
        room: "room2"
    },
    {
        id: "3",
        username: "Nguyễn Lê Huy",
        room: "room1"
    },
];

const addUser = (newUser) => {
    return userList = [...userList, newUser]
}

const getUserList = (room) => {
    return userList.filter((user) => user.room === room )
}

const removeUser = (id) => {
    return userList.filter((user) => user.id !== id)
}

const findUser = (id) => {
    return userList.find((user) => user.id === id)
}






module.exports = {
    addUser,
    getUserList,
    removeUser,
    findUser
}