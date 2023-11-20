//https://www.balldontlie.io/api/v1/players
import { addNewPlayer, addNewTeam, addPlayer, createAPlayer, createATeam, deleteATeam, deletePlayer, initialized, moveTeam, updatePlayer } from './slices/teamSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from './slices/store';
import React , { useEffect , useState } from 'react';
import { LogOut } from './slices/authSlice';

type PlayersByTeam = {
    team : {id: number, abbreviation: string , city:string , conference:string , division:string , full_name:string , name:string
    players?: { id:string , first_name:string , height_feet:string|null , height_inches:string|null , last_name:string , position:string|null , weight_pounds:string|null }[] }
}
type players = {
    id:string , first_name:string , height_feet:string|null , height_inches:string|null , last_name:string , position:string|null , weight_pounds:string|null,
    team?:{id: number, abbreviation: string,city:string,conference:string,division:string,full_name:string,name:string }
}
//{"id":14,"first_name":"Ike","height_feet":null,"height_inches":null,"last_name":"Anigbogu","position":"C",
//"team":{"id":12,"abbreviation":"IND","city":"Indiana","conference":"East","division":"Central","full_name":"Indiana Pacers","name":"Pacers"}

export default function PlayersPage(){
    const username_ = useAppSelector((state)=> state.authReducer.value.username);
    const teamsFetched = useAppSelector((state)=>state.teamReducer )
    const dispatch = useDispatch<AppDispatch>();
    const [ players , setPlayer ] = useState(true);
    const [ teams , setTeam ] = useState(false);
    const [ loading , setLoading ] = useState(true);
    //first one to load the teams
    useEffect(()=>{
        if(teamsFetched.teams.length > 1) {
            setLoading(false);
            return;
        }
        if(username_ === '') {
            alert("You are not authorized");
            window.location.replace('/')
        }
        fetch('https://www.balldontlie.io/api/v1/players')
        .then((res)=>{
            return res.json();
        })
        .then((data)=>{
            data.data.forEach((value:players)=>{
                dispatch(addNewTeam(value));
            })
            setLoading(false);
        })
        .finally(()=>{
            setLoading(false)
        })
    }, [])
    //second one to load the players
    useEffect(()=>{
        if(teamsFetched.players.length > 0) {
            setLoading(false);
            return;
        }
        if(username_ === '') {
            alert("You are not authorized");
            window.location.replace('/')
        }
        fetch('https://www.balldontlie.io/api/v1/players')
        .then((res)=>{
            return res.json();
        })
        .then((data)=>{
            data.data.forEach((value:players)=>{
                dispatch(addNewPlayer(value));
            })
            setLoading(false);
        })
        .finally(()=>{
            setLoading(false)
        })
    }, [teamsFetched.teams.length])
    return (
        <div className='w-full h-full'>
            <div className="navbar bg-base-100">
                <div className="flex-1">
                    <span className="btn btn-ghost text-xl">{username_}</span>
                </div>
                <div className="navbar-end ml-auto">
                    <button className="btn rounded-none btn-ghost m-2" onClick={()=>{dispatch(initialized()); window.location.reload()}}>
                        Reset data
                    </button>
                    <button className="btn rounded-none btn-error m-2" onClick={()=>{dispatch(LogOut())}}>
                        Logout
                    </button>
                </div>
            </div>
            <div className="navbar mt-2 join">
                {players? 
                    <div className="flex-1 basis-1/3 btn bg-gray-500 text-black hover:bg-gray-500 rounded-none">
                        Players
                    </div>
                :
                    <div className="flex-1 basis-1/3 bg-base-200 btn btn-ghost btn-outline rounded-none" onClick={()=>{setPlayer(true); setTeam(false);}}>
                        Players
                    </div>
                }
                
                {teams? 
                    <div className="flex-1 basis-1/3 btn bg-gray-500 text-black hover:bg-gray-500 rounded-none">
                        Teams
                    </div>
                :
                    <div className="flex-1 basis-1/3 bg-base-200 btn btn-ghost btn-outline rounded-none" onClick={()=>{setPlayer(false); setTeam(true);}}>
                        Teams
                    </div>
                }
                {players === false && teams === false? 
                    <div className="flex-1 basis-1/3 btn bg-gray-500 text-black hover:bg-gray-500 rounded-none">
                        Team with players
                    </div>
                :
                    <div className="flex-1 basis-1/3 bg-base-200 btn btn-ghost btn-outline rounded-none" onClick={()=>{setPlayer(false); setTeam(false);}}>
                        Team with players
                    </div>
                }

            </div>
            <div className='flex gap-4'>
                <CreateAPlayerDialog />
                <CreateATeam />
            </div>
            {loading? 
            <div className='w-full h-[100vh]'>Loading</div>
            : 
            players? <Players count={teamsFetched.players.length} values={teamsFetched.players}/> : teams? <Teams count={teamsFetched.teams.length} values={teamsFetched.teams}/> : <TeamAndPlayer count={teamsFetched.teams.length} values={teamsFetched.teams}/>}
        </div>
    )
}
export function TeamAndPlayer(props: {count:number, values: PlayersByTeam[]}) {
    const [ count , setCount ] = useState(10);
    const [ full , setFull ] = useState(false);
    const incrementCount = () =>{
        setLoading(true);
        setTimeout(()=>{
            if(count < props.count) {
                setCount(count + 10);
                setLoading(false);
            }
            else setFull(true)
        }, 1000)
    }
    const [ loading , setLoading ] = useState(false);
    const displayTeams = props.values.slice(0 , count);
    const teams_info = displayTeams.map((value:PlayersByTeam , index)=>{
        return (
            <div key={index} className='bg-gradient-to-br my-2 from-base-100 to-base-300 py-5'>
                <div className='flex md:flex-row flex-col m-2 bg-gradient-to-r from-base-100 to-[#393741] py-5 px-4'>
                    <div className='text-lg px-5 pt-3 text-white'>{value.team.name && value.team.name}</div>

                    <div className='join pb-2 mx-auto md:mx-0 md:ml-auto'>
                        <AddPlayerDialog teamID={value.team.id} teamName={value.team.full_name}/>
                        <TeamBoxDialog {...value}/>
                       {value.team.id !== 10000 <DeleteTeamDialog teamID={value.team.id} teamName={value.team.full_name}/> : ''}
                    </div>
                </div>
                <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3 '>
                    {value.team.players?.map((player , index)=>(
                        <div className='col-span-1 p-2 shadow-md shadow-base-100' key={index}>
                            <div className='p-4 text-center text-lg bg-base-300 text-white'> {player.first_name} {player.last_name}</div>
                            <table className='table bg-base-200'>
                                <thead></thead>
                                <tbody>
                                    <tr className='hover:scale-105 hover:bg-base-100 duration-500 cursor-pointer'>
                                        <td>Height(ft)</td>
                                        <td>{player.height_feet===null ? 'No data' : player.height_feet}</td>
                                    </tr>
                                    <tr className='hover:scale-105 hover:bg-base-100 duration-500 cursor-pointer'>
                                        <td>Height(in)</td>
                                        <td>{player.height_inches===null ? 'No data' : player.height_inches}</td>
                                    </tr>
                                    <tr className='hover:scale-105 hover:bg-base-100 duration-500 cursor-pointer'>
                                        <td>Position </td>
                                        <td>{player.position===null ? 'No data' : player.position}</td>
                                    </tr>
                                    <tr className='hover:scale-105 hover:bg-base-100 duration-500 cursor-pointer'>
                                        <td>Weight(lb)</td>
                                        <td>{player.weight_pounds===null ? 'No data' : player.weight_pounds}</td>
                                    </tr>
                                </tbody>
                                <tfoot></tfoot>
                            </table>
                            <div className='join float-left p-2'>
                                <UpdatePlayerDialog team_name={value.team.full_name} playerID={player.id} {...player}/>
                                <DeletePlayerDialog first_name={player.first_name} id={player.id} last_name={player.last_name}/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    })
  return (
    <div className='h-full w-full pb-10'>
        {teams_info}
        <div className='mt-4'>
            {full?
            <button className='btn btn-success btn-disabled text-white float-right'>No more to load</button> : 
            <button className='btn btn-success float-right' onClick={incrementCount} disabled={loading}>{loading? <>Loading<span className="loading loading-bars loading-xs"></span></> : 'Show more' } </button>
            }
        </div>
    </div>
  )
}
export function Players(props: {count:number , values: players[]}) {
    const [ count , setCount ] = useState(10);
    const [ full , setFull ] = useState(false);
    const [ loading , setLoading ] = useState(false);
    const incrementCount = () =>{
        setLoading(true);
        setTimeout(()=>{
            if(count < props.count) {
                setCount(count + 10);
                setLoading(false);
            }
            else setFull(true)
        }, 1000)
    }
    const displayTeams = props.values.slice(0 , count);
    const teams_info = displayTeams.map((player:players , index)=>{
        return (
            <React.Fragment key={index}>
                <div className='col-span-1 p-2 shadow-md shadow-base-100' key={index}>
                    <table className='table bg-base-200 '>
                        <thead>
                            <tr>
                                <td colSpan={2} className='p-4 text-center text-lg bg-base-300 text-white'>{player.first_name} {player.last_name}</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className='hover:scale-105 hover:bg-base-300 duration-500 cursor-pointer'>
                                <td>Height(ft)</td>
                                <td>{player.height_feet===null ? 'No data' : player.height_feet}</td>
                            </tr>
                            <tr className='hover:scale-105 hover:bg-base-300 duration-500 cursor-pointer'>
                                <td>Height(in)</td>
                                <td>{player.height_inches===null ? 'No data' : player.height_inches}</td>
                            </tr>
                            <tr className='hover:scale-105 hover:bg-base-300 duration-500 cursor-pointer'>
                                <td>Position </td>
                                <td>{player.position===null ? 'No data' : player.position}</td>
                            </tr>
                            <tr className='hover:scale-105 hover:bg-base-300 duration-500 cursor-pointer'>
                                <td>Weight(lb)</td>
                                <td>{player.weight_pounds===null ? 'No data' : player.weight_pounds}</td>
                            </tr>
                            <tr className='hover:scale-105 hover:bg-base-300 duration-500 cursor-pointer'>
                                <td>Team name </td>
                                <td>{player.team!.name? player.team!.name : 'No data'}</td>
                            </tr>
                        </tbody>
                        <tfoot></tfoot>
                    </table>
                    <div className='join float-left p-2'>
                        <UpdatePlayerDialog team_name={player.team!.full_name} playerID={player.id} {...player}/>
                        <MoveTeamDialog team_name={player.team!.full_name} first_name={player.first_name} playerID={player.id}/>
                        <DeletePlayerDialog first_name={player.first_name} id={player.id} last_name={player.last_name}/>
                    </div>
                </div>
            </React.Fragment>
        )
    })
  return (
    <div className='pb-10'>
        <div className='grid lg:grid-cols-2 grid-cols-1 gap-5'>
            {teams_info}
        </div>
        <div className='mt-4'>
            {full?
                <button className='btn btn-success btn-disabled text-white float-right'>No more to load</button> : 
                <button className='btn btn-success float-right' onClick={incrementCount} disabled={loading}>{loading? <>Loading<span className="loading loading-bars loading-xs"></span></> : 'Show more' } </button>
            }
        </div>
    </div>
  )
}
export function Teams(props: {count:number, values: PlayersByTeam[]}) {
    const [ count , setCount ] = useState(10);
    const [ full , setFull ] = useState(false);
    const incrementCount = () =>{
        setLoading(true);
        setTimeout(()=>{
            if(count < props.count) {
                setCount(count + 10);
                setLoading(false);
            }
            else setFull(true)
        }, 1000)
    }
    const [ loading , setLoading ] = useState(false);
    const displayTeams = props.values.slice(0 , count);
    const teams_info = displayTeams.map((value:PlayersByTeam , index)=>{
        return (
            <div key={index} className='border-b-2 border-b-base-300 py-5'>
                <div className='flex flex-row bg-gradient-to-br from-base-100 to-base-300 px-4 py-4 m-2'> 
                    <div className='md:text-lg text-sm cursor-pointer text-white mr-auto mt-[.1rem]' onClick={()=>{(document.getElementById(`t_${value.team.abbreviation}`) as HTMLDialogElement)!.showModal()}}>{value.team.name && value.team.name}</div>
                    <div className='join ml-auto mb-2'>
                        <AddPlayerDialog teamID={value.team.id} teamName={value.team.full_name}/>
                        <TeamBoxDialog {...value}/>
                        {value.team.id !== 10000? <DeleteTeamDialog teamID={value.team.id} teamName={value.team.full_name}/> : ''}
                    </div>
                </div>
            </div>
                
        )
    })
  return (
    <>
    <div className='text-left'>
        {teams_info}
    </div>
    <div className='my-4'>
        {full?
            <button className='btn btn-success btn-disabled text-white float-right'>No more to load</button> : 
            <button className='btn btn-success float-right' onClick={incrementCount} disabled={loading}>{loading? <>Loading<span className="loading loading-bars loading-xs"></span></> : 'Show more' } </button>
        }
    </div>
    </>
  )
}


function DeletePlayerDialog(props: {id: string, first_name: string , last_name: string}){
    const dispatch = useDispatch<AppDispatch>();
    return (
        <>
        <button className="btn btn-sm rounded-none btn-error ml-2" onClick={()=>(document.getElementById(`dp_${props.id}`) as HTMLDialogElement)!.showModal()}>Delete Player</button>
        <dialog id={`dp_${props.id}`} className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-error">WARNING</h3>
            <p className="py-4">You are about to delete the player {props.first_name} {props.last_name}</p>
            <div className="modal-action">
                {/* if there is a button in form, it will close the modal */}
                <button className='btn btn-sm rounded-none btn-error btn-outline' onClick={()=>{dispatch(deletePlayer({id: props.id , fullName: `${props.first_name}${props.last_name}`})); (document.getElementById(`dp_${props.id}`)  as HTMLDialogElement)!.close();}}>Delete</button>
                <button className="btn btn-sm rounded-none btn-primary" onClick={()=>{(document.getElementById(`dp_${props.id}`)  as HTMLDialogElement)!.close()}}>Close</button>
            </div>
          </div>
        </dialog>
        </>
    )
}
function UpdatePlayerDialog(props: {team_name:string,playerID:string,first_name:string , last_name: string, height_feet: string|null , height_inches: string|null , weight_pounds:string|null , position:string|null}){
    const dispatch = useDispatch<AppDispatch>();
    const [ Uinput , setInput ] = 
    useState<{first_name:string , last_name: string, height_feet: string|null , height_inches: string|null , weight_pounds:string|null , position:string|null}>
    ({
        first_name: props.first_name , last_name: props.last_name, height_feet : props.height_feet , height_inches: props.height_inches , weight_pounds : props.weight_pounds , position: props.position
    })
    function setFirstName (e: React.ChangeEvent<HTMLInputElement>){
        setInput({...Uinput , first_name: e.target.value})
    }
    function setLastName (e: React.ChangeEvent<HTMLInputElement>){
        setInput({...Uinput , last_name: e.target.value})
    }
    function setHeighFT (e: React.ChangeEvent<HTMLInputElement>){
        setInput({...Uinput , height_feet: e.target.value})
    }
    function setHeightIN (e: React.ChangeEvent<HTMLInputElement>){
        setInput({...Uinput , height_inches: e.target.value})
    }
    function setWeight (e: React.ChangeEvent<HTMLInputElement>){
        setInput({...Uinput , weight_pounds: e.target.value})
    }
    function setPosition (e: React.ChangeEvent<HTMLInputElement>){
        setInput({...Uinput , position: e.target.value})
    }
    function checkValueAndSubmit(){
        if(Uinput.first_name === '') {alert("Please input first name!"); return}
        if(Uinput.last_name === '' ) {alert("Please input last name!"); return}
        dispatch(updatePlayer({id: props.playerID , first_name:Uinput.first_name , last_name:Uinput.last_name , height_feet:Uinput.height_feet , height_inches:Uinput.height_inches , position:Uinput.position , weight_pounds:Uinput.weight_pounds}));

        (document.getElementById(`p_${props.playerID}`) as HTMLDialogElement)!.close();
    }
    
    return(
        <>
        <button className="btn btn-sm rounded-none btn-success ml-2" onClick={()=>(document.getElementById(`p_${props.playerID}`) as HTMLDialogElement)!.showModal()}>Update Player</button>
            <dialog id={`p_${props.playerID}`} className="modal">
              <div className="modal-box w-fit">
                <h3 className="font-bold text-xl text-success text-center">Update the player {props.first_name} {props.last_name}</h3>
                <div>
                    <p className='block after:table after:clear-both'><span className='float-left p-4 w-full h-16'>First name (required)<input type="text" className='input input-sm input-primary float-right' value={Uinput.first_name} onChange={setFirstName}/> </span>  </p>
                    <p className='block after:table after:clear-both'><span className='float-left p-4 w-full h-16'>Last name (required)<input type="text" className='input input-sm input-primary float-right' value={Uinput.last_name} onChange={setLastName}/>  </span> </p>
                    <p className='block after:table after:clear-both'><span className='float-left p-4 w-full h-16'>Height (feet)       <input type="text" className='input input-sm input-primary float-right' value={Uinput.height_feet===null? '' : Uinput.height_feet} onChange={setHeighFT}/>   </span> </p>
                    <p className='block after:table after:clear-both'><span className='float-left p-4 w-full h-16'>Height(inches)      <input type="text" className='input input-sm input-primary float-right' value={Uinput.height_inches===null? '' : Uinput.height_inches} onChange={setHeightIN}/>  </span> </p>
                    <p className='block after:table after:clear-both'><span className='float-left p-4 w-full h-16'>Position            <input type="text" className='input input-sm input-primary float-right' value={Uinput.position===null? '' : Uinput.position} onChange={setPosition}/>  </span> </p>
                    <p className='block after:table after:clear-both'><span className='float-left p-4 w-full h-16'>Weight (lb)         <input type="text" className='input input-sm input-primary float-right' value={Uinput.weight_pounds===null? '': Uinput.weight_pounds} onChange={setWeight}/>    </span> </p>
                    
                </div>
                <div className="modal-action">
                    {/* if there is a button in form, it will close the modal */}
                    
                    <button className='btn btn-sm rounded-none btn-success btn-outline' onClick={checkValueAndSubmit}>Update the player {Uinput.first_name} {Uinput.last_name}</button>
                    <button className="btn btn-sm rounded-none btn-error" onClick={()=>{(document.getElementById(`p_${props.playerID}`) as HTMLDialogElement)!.close()}}>Close</button>
                </div>
              </div>
            </dialog>
        </>
    )
}
function MoveTeamDialog(props: {team_name: string, playerID: string , first_name:string}){
    const dispatch = useDispatch<AppDispatch>();
    const team_names = useAppSelector((state)=>state.teamReducer.teams_names);
    const [ teamChanged , setTeamChanged ] = useState(false);
    const [ teamChangedName , setTeamChangedName ] = useState(props.team_name);
    function checkTeamChanged(e:React.ChangeEvent<HTMLSelectElement>){
        setTeamChangedName(e.target.value); 
        setTeamChanged(true); 
        if(e.target.value === props.team_name) setTeamChanged(false);
    }
    function move(){
        dispatch(moveTeam({playerID: props.playerID , newTeamName: teamChangedName}));
        (document.getElementById(`move_${props.team_name}`) as HTMLDialogElement)!.close()
    }
    return (
        <>
        <button className="btn btn-sm rounded-none btn-success ml-2" onClick={()=>(document.getElementById(`move_${props.team_name}`) as HTMLDialogElement)!.showModal()}>Move the Player</button>
            <dialog id={`move_${props.team_name}`} className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-xl text-success text-center">Move the player from {props.team_name}</h3>
                <div>
                    <p className='block after:table after:clear-both'>Move to team : 
                        <select className='select m-2' name={`s_${props.team_name}`} onChange={checkTeamChanged} defaultValue={props.team_name}> 
                            {team_names.map((value, index)=>(
                            <option key={index} value={value} disabled={value === props.team_name}>{value}</option>
                        ))}
                        </select>
                    </p>
                </div>
                <div className="modal-action">
                    {/* if there is a button in form, it will close the modal */}
                    <button className='btn btn-sm rounded-none btn-success btn-outline' disabled={!teamChanged} onClick={move}>Move to team {teamChangedName} </button>
                    <button className="btn btn-sm rounded-none btn-error" onClick={()=>{(document.getElementById(`move_${props.team_name}`) as HTMLDialogElement)!.close()}}>Close</button>
                </div>
              </div>
            </dialog>
        </>
    )
}
function AddPlayerDialog(props: {teamID:number, teamName: string}){
    const dispatch = useDispatch<AppDispatch>();
    const [ Uinput , setInput ] = 
    useState<{first_name:string , last_name: string, height_feet: string|null , height_inches: string|null , weight_pounds:string|null , position:string|null}>
    ({
        first_name: '' , last_name: '', height_feet : null , height_inches: null , weight_pounds : null , position: null
    })
    const playerNames = useAppSelector((state)=>state.teamReducer.players_names);
    function setFirstName (e: React.ChangeEvent<HTMLInputElement>){
        setInput({...Uinput , first_name: e.target.value})
    }
    function setLastName (e: React.ChangeEvent<HTMLInputElement>){
        setInput({...Uinput , last_name: e.target.value})
    }
    function setHeighFT (e: React.ChangeEvent<HTMLInputElement>){
        setInput({...Uinput , height_feet: e.target.value})
    }
    function setHeightIN (e: React.ChangeEvent<HTMLInputElement>){
        setInput({...Uinput , height_inches: e.target.value})
    }
    function setWeight (e: React.ChangeEvent<HTMLInputElement>){
        setInput({...Uinput , weight_pounds: e.target.value})
    }
    function setPosition (e: React.ChangeEvent<HTMLInputElement>){
        setInput({...Uinput , position: e.target.value})
    }

    function checkValueAndSubmit(){
        const firstName = Uinput.first_name.replace(/\s/g , '');
        const lastName = Uinput.last_name.replace(/\s/g , '');
        for(let i = 0; i<playerNames.length; i++){
            if(playerNames[i] === `${firstName}${lastName}`) {
                alert(`Player with the name ${Uinput.first_name} ${Uinput.last_name} already exists!`);
                return;
            }
        }
        if(Uinput.first_name === '') {alert("Please input first name!"); return}
        if(Uinput.last_name === '' ) {alert("Please input last name!"); return}
        dispatch(addPlayer({teamID: props.teamID , first_name:Uinput.first_name , last_name:Uinput.last_name , height_feet:Uinput.height_feet , height_inches:Uinput.height_inches , position:Uinput.position , weight_pounds:Uinput.weight_pounds}))
        setInput({first_name: '' , last_name: '', height_feet : '' , height_inches: '' , weight_pounds : '' , position: ''});
        (document.getElementById(`t_${props.teamID}`) as HTMLDialogElement)!.close();
    }
    return(
        <>
        <button className="btn md:btn-sm btn-xs rounded-none btn-success md:ml-5 ml-0" onClick={()=>(document.getElementById(`t_${props.teamID}`) as HTMLDialogElement)!.showModal()}>Add a Player</button>
            <dialog id={`t_${props.teamID}`} className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-xl text-success text-center">Add a new Player to team {props.teamName}</h3>
                <div>
                    <p className='block after:table after:clear-both'><span className='float-left p-4 w-full h-16'>First name (required)<input type="text" className='input input-sm input-primary float-right' value={Uinput.first_name} onChange={setFirstName}/> </span>  </p>
                    <p className='block after:table after:clear-both'><span className='float-left p-4 w-full h-16'>Last name (required)<input type="text" className='input input-sm input-primary float-right' value={Uinput.last_name} onChange={setLastName}/>  </span> </p>
                    <p className='block after:table after:clear-both'><span className='float-left p-4 w-full h-16'>Height (feet)       <input type="text" className='input input-sm input-primary float-right' value={Uinput.height_feet===null? '' : Uinput.height_feet} onChange={setHeighFT}/>   </span> </p>
                    <p className='block after:table after:clear-both'><span className='float-left p-4 w-full h-16'>Height(inches)      <input type="text" className='input input-sm input-primary float-right' value={Uinput.height_inches===null? '' : Uinput.height_inches} onChange={setHeightIN}/>  </span> </p>
                    <p className='block after:table after:clear-both'><span className='float-left p-4 w-full h-16'>Position            <input type="text" className='input input-sm input-primary float-right' value={Uinput.position===null? '' : Uinput.position} onChange={setPosition}/>  </span> </p>
                    <p className='block after:table after:clear-both'><span className='float-left p-4 w-full h-16'>Weight (lb)         <input type="text" className='input input-sm input-primary float-right' value={Uinput.weight_pounds===null? '' : Uinput.weight_pounds} onChange={setWeight}/>    </span> </p>
                </div>
                <div className="modal-action">
                    {/* if there is a button in form, it will close the modal */}
                    <button className='btn btn-sm rounded-none btn-success btn-outline' onClick={checkValueAndSubmit}>Add the player {Uinput.first_name} {Uinput.last_name}</button>
                    <button className="btn btn-sm rounded-none btn-error" onClick={()=>{(document.getElementById(`t_${props.teamID}`) as HTMLDialogElement)!.close()}}>Close</button>
                </div>
              </div>
            </dialog>
        </>
    )
}
function CreateAPlayerDialog(){
    const dispatch = useDispatch<AppDispatch>();
    const [ Uinput , setInput ] = 
    useState<{first_name:string , last_name: string, height_feet: string|null , height_inches: string|null , weight_pounds:string|null , position:string|null}>
    ({
        first_name: '' , last_name: '', height_feet : null , height_inches: null , weight_pounds : null , position: null
    })
    const playerNames = useAppSelector((state)=>state.teamReducer.players_names);
    function setFirstName (e: React.ChangeEvent<HTMLInputElement>){
        setInput({...Uinput , first_name: e.target.value})
    }
    function setLastName (e: React.ChangeEvent<HTMLInputElement>){
        setInput({...Uinput , last_name: e.target.value})
    }
    function setHeighFT (e: React.ChangeEvent<HTMLInputElement>){
        setInput({...Uinput , height_feet: e.target.value})
    }
    function setHeightIN (e: React.ChangeEvent<HTMLInputElement>){
        setInput({...Uinput , height_inches: e.target.value})
    }
    function setWeight (e: React.ChangeEvent<HTMLInputElement>){
        setInput({...Uinput , weight_pounds: e.target.value})
    }
    function setPosition (e: React.ChangeEvent<HTMLInputElement>){
        setInput({...Uinput , position: e.target.value})
    }

    function checkValueAndSubmit(){
        const firstName = Uinput.first_name.replace(/\s/g , '');
        const lastName = Uinput.last_name.replace(/\s/g , '');
        for(let i = 0; i<playerNames.length; i++){
            if(playerNames[i] === `${firstName}${lastName}`) {
                alert(`Player with the name ${Uinput.first_name} ${Uinput.last_name} already exists!`);
                return;
            }
        }
        if(Uinput.first_name === '') {alert("Please input first name!"); return}
        if(Uinput.last_name === '' ) {alert("Please input last name!"); return}
        dispatch(createAPlayer({...Uinput}));
        setInput({first_name: '' , last_name: '', height_feet : '' , height_inches: '' , weight_pounds : '' , position: ''});
        (document.getElementById('createANew') as HTMLDialogElement)!.close();
    }
    return(
        <>
        <button className="btn md:btn-sm btn-xs rounded-none btn-success ml-2" onClick={()=>(document.getElementById('createANew') as HTMLDialogElement)!.showModal()}>Add a Player!</button>
            <dialog id={'createANew'} className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-xl text-success text-center">You are creating a new player!</h3>
                <div>
                    <p className='block after:table after:clear-both'><span className='float-left p-4 w-full h-16'>First name (required)<input type="text" className='input input-sm input-primary float-right' value={Uinput.first_name} onChange={setFirstName}/> </span>  </p>
                    <p className='block after:table after:clear-both'><span className='float-left p-4 w-full h-16'>Last name (required)<input type="text" className='input input-sm input-primary float-right' value={Uinput.last_name} onChange={setLastName}/>  </span> </p>
                    <p className='block after:table after:clear-both'><span className='float-left p-4 w-full h-16'>Height (feet)       <input type="text" className='input input-sm input-primary float-right' value={Uinput.height_feet===null? '' : Uinput.height_feet} onChange={setHeighFT}/>   </span> </p>
                    <p className='block after:table after:clear-both'><span className='float-left p-4 w-full h-16'>Height(inches)      <input type="text" className='input input-sm input-primary float-right' value={Uinput.height_inches===null? '' : Uinput.height_inches} onChange={setHeightIN}/>  </span> </p>
                    <p className='block after:table after:clear-both'><span className='float-left p-4 w-full h-16'>Position            <input type="text" className='input input-sm input-primary float-right' value={Uinput.position===null? '' : Uinput.position} onChange={setPosition}/>  </span> </p>
                    <p className='block after:table after:clear-both'><span className='float-left p-4 w-full h-16'>Weight (lb)         <input type="text" className='input input-sm input-primary float-right' value={Uinput.weight_pounds===null? '' : Uinput.weight_pounds} onChange={setWeight}/>    </span> </p>
                </div>
                <div className="modal-action">
                    {/* if there is a button in form, it will close the modal */}
                    <button className='btn btn-sm rounded-none btn-success btn-outline' onClick={checkValueAndSubmit}>Add the player {Uinput.first_name} {Uinput.last_name}</button>
                    <button className="btn btn-sm rounded-none btn-error" onClick={()=>{(document.getElementById('createANew') as HTMLDialogElement)!.close()}}>Close</button>
                </div>
              </div>
            </dialog>
        </>
    )
}
function TeamBoxDialog(props: PlayersByTeam){
    return(
        <>
        <button className="btn md:btn-sm btn-xs glass rounded-none bg-success btn-success md:ml-5 mt-0 ml-0" onClick={()=>{(document.getElementById(`t_${props.team.abbreviation}`) as HTMLDialogElement)!.showModal()}}>Show the team info</button>
            <dialog id={`t_${props.team.abbreviation}`} className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">{props.team.full_name} ({props.team.abbreviation})</h3>
                      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={()=>{(document.getElementById(`t_${props.team.abbreviation}`) as HTMLDialogElement)!.close()}}>✕</button>
                <div>
                    <p className='block after:table after:clear-both text-left py-4 text-white'><span className='float-left w-1/2 text-lg'>Name : </span> <span className='float-right w-1/2'>{props.team.name}</span></p>
                    <p className='block after:table after:clear-both text-left py-4 text-white'><span className='float-left w-1/2 text-lg'>Division : </span> <span className='float-right w-1/2'>{props.team.division}</span></p>
                    <p className='block after:table after:clear-both text-left py-4 text-white'><span className='float-left w-1/2 text-lg'>Conference : </span> <span className='float-right w-1/2'></span>{props.team.conference}</p>
                    <p className='block after:table after:clear-both text-left py-4 text-white'><span className='float-left w-1/2 text-lg'>City : </span> <span className='float-right w-1/2'></span>{props.team.city}</p>
                    <div className="collapse bg-base-200">
                      <input type="checkbox" /> 
                      <div className="collapse-title block after:table after:clear-both text-left py-4 text-white">
                        <span className='float-left w-1/2 text-lg'>Player counts : </span> <span className='float-right w-1/2'></span>{props.team.players?  props.team.players!.length : '0' }
                      </div>
                      <div className="collapse-content"> 
                        {props.team.players?.map((player , index)=>{
                           return (<div key={index}>{index+1}. {player.first_name} {player.last_name}</div>)
                        })}
                      </div>
                    </div>
                </div>
              </div>
            </dialog>
        </>
    )
}
function DeleteTeamDialog(props: {teamID: number, teamName: string}){
    const dispatch = useDispatch<AppDispatch>();
    function deleteTeam(){
        dispatch(deleteATeam({fullName: props.teamName, id: props.teamID}));
        (document.getElementById(`d_${props.teamID}`) as HTMLDialogElement)!.close()
    }
    return (
        <>
        <button  className="btn md:btn-sm btn-xs rounded-none btn-error md:ml-5 mt-0 ml-0" onClick={()=>(document.getElementById(`d_${props.teamID}`) as HTMLDialogElement)!.showModal()}>Delete this team</button>
        <dialog id={`d_${props.teamID}`} className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-error">WARNING TEAM DELETE</h3>
            <p className="py-4">You are about to delete the team '{props.teamName}'</p>
            <div className="modal-action">
                {/* if there is a button in form, it will close the modal */}
                <button className='btn btn-sm rounded-none btn-error btn-outline' onClick={deleteTeam}>Delete</button>
                <button className="btn btn-sm rounded-none btn-primary" onClick={()=>{(document.getElementById(`d_${props.teamID}`) as HTMLDialogElement)!.close()}}>Close</button>
            </div>
          </div>
        </dialog>
        </>
    )
}
export function CreateATeam(){
    const dispatch = useDispatch<AppDispatch>();
    const team_names = useAppSelector((state)=>state.teamReducer.teams_names);
    const [ TInput , setTInput ] = useState({
        name: '' , full_name: '', abbreviation: '', conference: '' , division: '' , city: ''
    })
    function setName(e : React.ChangeEvent<HTMLInputElement>){
        setTInput({
            ...TInput ,  name: e.target.value
        })
    }
    function setFullName(e : React.ChangeEvent<HTMLInputElement>){
        setTInput({
            ...TInput ,  full_name: e.target.value
        })
    }
    function setAbbreviation(e : React.ChangeEvent<HTMLInputElement>){
        if(e.target.value.length > 3) return;
        setTInput({
            ...TInput ,  abbreviation: e.target.value
        })
    }
    function setConfence(e : React.ChangeEvent<HTMLInputElement>){
        setTInput({
            ...TInput ,  conference: e.target.value
        })
    }
    function setDivision(e : React.ChangeEvent<HTMLInputElement>){
        setTInput({
            ...TInput ,  division: e.target.value
        })
    }
    function setCity(e : React.ChangeEvent<HTMLInputElement>){
        setTInput({
            ...TInput ,  city: e.target.value
        })
    }
    function createTeam(){
        const error_box = document.getElementById('error')!;
        const { abbreviation , city , conference , division , full_name , name} = TInput;
        
        for(let i = 0; i<team_names.length; i++){
            if(TInput.full_name === team_names[i]){
                error_box.innerText =  `The team with name ${team_names[i]} already exists`;
                return;
            }
        }
        if(abbreviation === '' || city === '' || conference === '' || division === '' || full_name === '' || name === '') {
            error_box.innerText = 'Please fill up all the inputs';
            return;
        }
        setTimeout(()=>{
            error_box.innerText = '';
        }, 2000)
        dispatch(createATeam(TInput));
        setTInput({abbreviation: '' ,city : '' ,conference: '', division: '', full_name: '', name: ''})
    }
    return (
        <>
        <button  className="btn md:btn-sm btn-xs rounded-none btn-success" onClick={()=>(document.getElementById('create_dialog') as HTMLDialogElement)!.showModal()}>Create a new team!</button>
        <dialog id={'create_dialog'} className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-success ml-2">Create a new team?</h3>
            <div>
                    <p className='block after:table after:clear-both'><span className='float-left p-4 w-full h-16'>Short Name         <input type="text" className='input input-sm input-primary float-right' value={TInput.name} onChange={setName}/> </span>  </p>
                    <p className='block after:table after:clear-both'><span className='float-left p-4 w-full h-16'>Full name    <input type="text" className='input input-sm input-primary float-right' value={TInput.full_name} onChange={setFullName}/>  </span> </p>
                    <p className='block after:table after:clear-both'><span className='float-left p-4 w-full h-16'>Abbreviation(3 words) <input type="text" className='input input-sm input-primary float-right' value={TInput.abbreviation} onChange={setAbbreviation}/>   </span> </p>
                    <p className='block after:table after:clear-both'><span className='float-left p-4 w-full h-16'>City         <input type="text" className='input input-sm input-primary float-right' value={TInput.city} onChange={setCity}/>  </span> </p>
                    <p className='block after:table after:clear-both'><span className='float-left p-4 w-full h-16'>Conference   <input type="text" className='input input-sm input-primary float-right' value={TInput.conference} onChange={setConfence}/>  </span> </p>
                    <p className='block after:table after:clear-both'><span className='float-left p-4 w-full h-16'>Divison      <input type="text" className='input input-sm input-primary float-right' value={TInput.division} onChange={setDivision}/>  </span> </p>
                    <p className='block after:table after:clear-both'><span className='float-left p-4 w-full h-16'>Player count <input type="number" className='input input-sm input-primary float-right' value='0' readOnly/>  </span> </p>
                    <p id='error' className='text-error'></p>
                </div>
            <div className="modal-action">
                {/* if there is a button in form, it will close the modal */}
                <button className='btn btn-sm rounded-none btn-success btn-outline' onClick={createTeam}>Create the team {TInput.name}</button>
                <button className="btn btn-sm rounded-none btn-primary" onClick={()=>{(document.getElementById('create_dialog') as HTMLDialogElement)!.close()}}>Close</button>
            </div>
          </div>
        </dialog>
        </>
    )
}