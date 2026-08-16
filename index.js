

// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2606-PUPPIES"; // Make sure to change this!
const API = BASE + COHORT;

console.log("hello")

let PUPS = {};
let selectedPup = null

async function getPups(){
    try{
    const response = await fetch(API + '/players');
    const json = await response.json();
    PUPS = json.data
    console.log(PUPS);
    render()
    }catch(err){
        console.log(err)
    }
}
//get pup from id
async function getPup(id){
    try{
        const response = await fetch(API+'/players/'+id);
        const json = await response.json();
        selectedPup=json.data
        console.log(selectedPup)
        render()
    }catch(err){
        console.log(err)

    }
}
///display names of players via API 

function pupList(){
const $ul = document.createElement("ul")
// console.log(PUPS)
const pupList = PUPS.players.map(pupListItem)
// console.log(pupList)
$ul.replaceChildren(...pupList);
return $ul
};

//create list tiem for each pup
function pupListItem(pup){
    const $pup = document.createElement("li");
    $pup.innerHTML = `<a href="#selected">${pup.name}</a>`
    //on click, change selected to pup.id
    $pup.addEventListener("click", ((event) => {
        getPup(pup.id)
    }))
    return $pup; 
};


//update API
async function addPupToApi(pup){
    console.log(pup)
    try{
    const response = await fetch(API + '/players', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(pup),
    });
    const json = await response.json();
    // console.log("data", json.data)
    // console.log(response)
    if (response.status === 200){
        getPups()
        // console.log("get pup")
    }else{
        console.log(response)
    }; 
    }catch(err){
        console.log(err)
    }
}

//Add new pup form
function addNewPupForm(){
    const $form = document.createElement("form")
  $form.innerHTML = `
    <label>
      Player
      <input name="name" type="text" required />
    </label>
    <label>
      Breed
      <input name="breed" type="text" required />
    </label>
    <label>
      Profile Picture
      <input name="imageUrl" type="text" />
    </label>
    <button>Add player</button>
  `;
  $form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const data = new FormData($form);
    const name = data.get('name');
    const breed = data.get('breed')
    const img = data.get('imageUrl');
    console.log(name+ breed+img )
    addPupToApi({name, breed, img});

  })
  return $form;
}


//Render more info on selected pup, render message if none selected
function pupInfo(){
//if not selected, return message 
const $pupDetail = document.createElement("article")
// console.log(selectedPup)
if(!selectedPup){
    const $message = document.createElement("p")
    $message.textContent="select a puppy player"
    $pupDetail.replaceChildren($message)
    return $pupDetail
}else{
    //render selected pup
    $pupDetail.innerHTML = `
        <img src="${selectedPup.player.imageUrl}"/>
        <h2> Name: ${selectedPup.player.name} </h2>
        <p> id#: ${selectedPup.player.id} </p>
        <p> Breed: ${selectedPup.player.breed} </p>
        <p> Team: ${selectedPup.player.team.name} </p>
        <p> Status: ${selectedPup.player.status} </p>
        <button>Remove player</button>
    ` 
    $pupDetail.addEventListener("click", ()=>{
        console.log("click " + selectedPup.player.id)
        removePup(selectedPup.player.id)
    })
    return $pupDetail;
}

}

//remove pup from pupinfo
async function removePup(id){
    try{
    const response = await fetch (API+ '/players/'+ id, {
        method: "DELETE",
    })
        if (response.status === 200){
            getPups()
        }
    }catch(error){
        console.log(error)
    }

}



function render(){
    const $app = document.querySelector("#app")
    $app.innerHTML =`
    <h1>Welcome to the puppybowl</h1>
    <main>
        <section>
            <h2>Roster</h2>
            <pups></pups>
            <h3>New Player</h3>
            <addPup></addPup>
        </section>
        <section id = "selected">
            <h2>Puppy Details</h2>
            <pupDetails></pupDetails>
        </section>
    </main>
    `;
    document.querySelector("pups").replaceWith(pupList())
    document.querySelector("addPup").replaceWith(addNewPupForm())
    document.querySelector("pupDetails").replaceWith(pupInfo())
}

async function init(){
    await getPups();
    render();
}
init()