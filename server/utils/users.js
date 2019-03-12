class Users {
    constructor(){
        this.users = [];
    }

    addUser(id, name, room){
        let user = {id, name, room};
        this.users.push(user);
        return user;
    }

    removeUser(id){
        let user = this.getUser(id);

        if(user){
            this.users = this.users.filter(user => user.id !== id);
        }
        
        return user;
    }    

    getUser(id){
        return this.users.filter(user => user.id === id)[0];
    }

    getUserByName(name){
        return this.users.filter(user => user.name === name)[0];
    }

    getUsersList(room){
        let users = this.users.filter(user => user.room === room);
        let names = users.map(user => user.name);

        return names;
    }
}

module.exports = {Users};