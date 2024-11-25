import axios from "axios";
import { exec } from "child_process";

interface Server {
    id: number;
    name: string;
    avatar: string;
    private: boolean;
    role: string;
    userid: number;
  }

export const commandHandler = async (messageInput: string, activeServer : Server) => {
    // Check if message is a command
    console.log("Command Input: " + messageInput, activeServer);

    const splitMessage = messageInput.split(" ");

    console.log("Split command: " + splitMessage);

    if (splitMessage[0] === "/cancel"){
        
        if (activeServer.role !== "creator"){

            try{            
                await axios.post('http://127.0.0.1:3333/server/leave-server',{
                    serverId: activeServer.id
                },{
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('bearer'),
                        'Content-Type': 'application/json'
                    }
                })
            }catch(err){
                console.log(err);
            }


            return true;

        }else{

            try{            
                await axios.post('http://127.0.0.1:3333/server/delete-server',{
                    serverId: activeServer.id
                },{
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('bearer'),
                        'Content-Type': 'application/json'
                    }
                })

                return true;
            }catch(err){
                console.log(err);
            }

            return true;
        }
            
    }else if (splitMessage[0] === "/list"){
        return true;
    }
    
    return false;
};

export const showMemberListExternal = ( messageInput: string ) =>{
    const splitMessage = messageInput.split(" ");

    if (splitMessage[0] === "/list"){
        return true;
    }else{
        return false;
    }
}