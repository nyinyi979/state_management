import { createSlice , PayloadAction } from "@reduxjs/toolkit";

type players = {
    id:string , first_name:string , height_feet:string|null , height_inches:string|null , last_name:string , position:string|null , weight_pounds:string|null,
    team?:{id: number, abbreviation: string,city:string,conference:string,division:string,full_name:string,name:string }
}
type PlayersByTeam = {
    team : {id: number, abbreviation: string , city:string , conference:string , division:string , full_name:string , name:string
    players?: { id:string , first_name:string , height_feet:string|null , height_inches:string|null , last_name:string , position:string|null , weight_pounds:string|null }[] }
}

const init:{teams:PlayersByTeam[], players:players[], teams_names: string[] , players_names: string[]} = {
    teams:[{team:{abbreviation: 'NAH' , city: "Not defined" , conference: "IDK" , division: "Somewhere" , full_name: 'Not known yet' , id: 10000 , name: 'No team', players: [] }}],
    players: [],
    teams_names: [],        //for checking duplicates of team names
    players_names: [],      //for checking duplicates of player names
}


export const teams = createSlice({
    name: "teams",
    initialState : init,
    reducers:{ 
        initialized: () =>{
            return init;
        },
        addNewTeam: (state , action: PayloadAction<players>) => {
            const team_name = action.payload.team!.abbreviation;
            let pushed = false;

            for(let i = 0; i<state.teams.length; i++){
                const team = state.teams[i].team;
                //pushing into current found team if there is one
                if(team.abbreviation === team_name){
                    delete action.payload['team'];
                    team.players!.push(action.payload);
                    pushed = true;
                }
                //removing duplicates
                const key = 'id';
                const unique = [...new Map(team.players!.map(item => [item[key], item])).values()];
                team['players'] = unique;
            }
            //create a new team if it is not there
            if(!pushed) {
                const payload = action.payload;
                const team = payload.team!;
                state.teams.push({team: {abbreviation: team.abbreviation , city: team.city , conference: team.conference ,
                    division: team.division , full_name: team.full_name , id: team.id , name: team.name , players:[payload] }})
            }
        },
        addNewPlayer: (state , action: PayloadAction<players>) => {
            const current_data = action.payload;

            //pushing just the players
            state.players.push(current_data);

            //add player names 
            state.players_names.push(`${current_data.first_name}${current_data.last_name}`);
            state.players_names = [...new Set(state.players_names)];

            //add team names
            state.teams_names.push(current_data.team!.full_name);
            state.teams_names = [...new Set(state.teams_names)];

            //removing duplicates
            const unique = [...new Map(state.players!.map(item => [item['id'], item])).values()];
            state.players = unique;
            
        },
        createATeam: (state , action: PayloadAction<{abbreviation: string , city:string , conference:string , division:string , full_name:string , name:string}>)=>{
            const {abbreviation ,city , conference ,division ,full_name ,name} = action.payload;
            const id = (Math.floor(Math.random() * 9000));
            state.teams.push({team: {abbreviation , city , conference , division , full_name , id , name }})
            state.teams_names.push(full_name);
        },
        deleteATeam: (state , action: PayloadAction<{id: number , fullName: string}>)=>{
            const {id , fullName} = action.payload;
            const teams = state.teams;

            //removing from teams array 
            state.teams = teams.filter((team)=>{
                return team.team.id !== id
            })

            //removing from team names array
            state.teams_names = state.teams_names.filter((full_name)=>{
                return full_name !== fullName
            })
        },
        addPlayer: (state, action: PayloadAction<{teamID: number,first_name:string , last_name:string , height_feet:string|null , height_inches:string|null  , position:string|null , weight_pounds:string|null}>)=>{
            const {first_name , last_name , teamID , height_feet , height_inches , position , weight_pounds} = action.payload;
            const id = (Math.floor(Math.random() * 9000)).toString();
            let team_value;
            //add to team array
            for(let  i = 0; i<state.teams.length; i++){
                const team = state.teams[i].team;
                if(team.id === teamID) {
                    //get that team
                    team_value = team;
                    team.players?.push({first_name , height_feet, height_inches , id, last_name , position, weight_pounds});
                    break;
                }
            }
            //push the player array
                state.players.push({first_name , last_name , height_feet , height_inches , position , id , weight_pounds , team: team_value})
            //push the player name array
                state.players_names.push(`${first_name}${last_name}`);
            
        },
        createAPlayer: (state , action: PayloadAction<{first_name:string , height_feet:string|null , height_inches:string|null , last_name:string , position:string|null , weight_pounds:string|null}>)=>{
            const id = (Math.floor(Math.random() * 9999)).toString();

            //copy the object to delete player field
            const no_team = {...state.teams[0].team};
            //push into the first no team array
            state.teams[0].team.players?.push({...action.payload , id});

            delete no_team['players']
            //push into player array
            state.players.push({...action.payload , id, team:no_team});
            
            state.players_names.push(`${action.payload.first_name}${action.payload.last_name}`);
            
        },
        deletePlayer: (state, action:PayloadAction<{id: string , fullName: string}>)=>{
            const {fullName , id} = action.payload
            //delete from teams
            for(let i = 0; i<state.teams.length; i++){
                const team = state.teams[i].team;
                team.players! = team.players!.filter(function(player) {
                    return player.id !== id
                })
            }
            //delete from players
            state.players = state.players.filter(function(player){
                return player.id !== id;
            })
            //delete from player names
            state.players_names = state.players_names.filter((playerName)=>{
                return playerName !== fullName
            })
        },
        updatePlayer: (state, action: PayloadAction<{id: string,first_name:string , last_name:string , height_feet:string|null , height_inches:string|null  , position:string|null , weight_pounds:string|null}>)=>{
            const payload = action.payload;
            //update from team array
            for(let  i = 0; i<state.teams.length; i++){
                const players = state.teams[i].team.players!;
                for(let j = 0; j<players.length; j++){
                    if(players[j].id === payload.id) {
                        players[j] = payload;
                    }
                }
            }
            //update from players array
            for(let  i = 0; i<state.players.length; i++){
                const player = state.players[i]!;
                if(payload.id === player.id){
                    const {first_name , height_feet ,height_inches , last_name , position , weight_pounds} = payload;
                    player.first_name = first_name;
                    player.last_name= last_name;
                    player.height_feet = height_feet;
                    player.height_inches = height_inches;
                    player.position = position;
                    player.weight_pounds = weight_pounds;
                }
            }
        },
        moveTeam: (state , action: PayloadAction<{playerID: string, newTeamName: string}>)=>{
            const { newTeamName , playerID } = action.payload;
            const players = state.players;
            const teams = state.teams;
            let playerValue;
            let oldPlayerIndex:number = 0 ;
            let newTeam;
            
            //PLAYER ARRAY
            //GET the player value and assign to a variable
            for(let i = 0; i<players.length; i++){
                if(players[i].id.toString() === playerID.toString()) {
                    playerValue = {...players[i]};
                    delete playerValue!['team'];
                    oldPlayerIndex = i;
                    break;
                }
            }

            //Get the new team value
            for(let i = 0; i<teams.length; i++){
                if(teams[i].team.full_name === newTeamName){
                    newTeam = {...teams[i].team};
                    delete newTeam!['players'];
                    break;
                }
            }
            
            //assigning to state
            if(newTeam && playerValue) {
                playerValue.team = newTeam;
                players[oldPlayerIndex] = playerValue
            }
            //Team array
            //Remove player from old team
            //delete from teams
            for(let i = 0; i<state.teams.length; i++){
                const team = state.teams[i].team;
                team.players! = team.players!.filter(function(player) {
                    return player.id !== playerID
                })
            }
            //push to new team
            for(let i = 0; i<teams.length; i++){
                if(teams[i].team.full_name === newTeamName){
                    if(playerValue) state.teams[i].team.players?.push(playerValue);
                   
                    break;
                }
            }
        }
    }
})

export const {addNewTeam , initialized , deletePlayer, addPlayer , moveTeam, createAPlayer ,  addNewPlayer , updatePlayer, deleteATeam , createATeam} = teams.actions
export default teams.reducer