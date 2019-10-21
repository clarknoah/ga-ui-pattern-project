let menuButton = document.querySelector(".menu-icon");
let aside = document.querySelector("aside");
let list = document.querySelector("ul");
let main = document.querySelector("main");
let description = document.querySelector(".description");
let charName = document.querySelector(".char-name");
let nextButton = document.querySelector("#next");
let backButton = document.querySelector("#back");

nextButton.addEventListener("click",paginateForward);
backButton.addEventListener("click", paginateBack);
menuButton.addEventListener("click",toggleMenu);

let apiKey = "9564a3a2806bc5f8fa885f60bc01d931";
let charList = [];


function toggleMenu(){
  console.log("Menu is toggled");
  //let widthIsZero = getComputedStyle(aside).position === "absolute";
  let widthIsZero = getComputedStyle(aside).width === "0px";
  console.log(widthIsZero);
  if(widthIsZero){
    aside.classList.remove("hide");
    //aside.classList.add("show");
  //  aside.style.opacity = "1"
    //aside.style.width = "20%";
  }else{
    //aside.style.width = "0px";
    aside.classList.add("hide");
  //  aside.classList.remove("show");
    //aside.style.opacity = "0";
  }
}

function toggleElement(ele){
  console.log("Menu is toggled");
  //let widthIsZero = getComputedStyle(aside).position === "absolute";
  let hidden = getComputedStyle(ele).visibility === "hidden";
  console.log(hidden);
  if(hidden){
    ele.classList.remove("hide-element");
  //  aside.style.opacity = "1"
  }else{
    ele.classList.add("hide-element");
    //aside.style.opacity = "0";
  }
}

class MarvelApi{
  constructor(){
    this.root = "https://gateway.marvel.com/v1/public/";
    this.characters = this.root+"characters";
    this.api = "9564a3a2806bc5f8fa885f60bc01d931";
    this.private = "062b6aa44350cd1243aca56c1b8f54f9c6a47d5e";
    this.query = {
      limit:20,
      offset:0,
      currentPage:1
    }

  }

  getPagination(){
    return `&limit=${this.query.limit}&offset=${this.query.offset}`;
  }
  getCreds(){
    let timestamp=Date.now();
    let hash = md5(timestamp+this.private+this.api);
    let cred = `&ts=${timestamp}&apikey=${this.api}&hash=${hash}`;
    return cred;
  }

  getCharacterList(){
    let url = this.characters+"?"+this.getPagination()+this.getCreds();
    console.log(url);
    fetch(url)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        let chars = res.data.results;
        menuCharacters(chars);

      })
      .catch(err => console.log("err", err));

  }
}

function menuCharacters(characters){
  charList = characters;
  clearList();
  for(let i = 0; i < characters.length; i++){
    let char = characters[i];
    let li = document.createElement("li");
    let hr = document.createElement("hr");
    let thumbnail = document.createElement("img");
    thumbnail.src = `${char.thumbnail.path}.${char.thumbnail.extension}`;
    li.innerText = char.name;
    li.appendChild(thumbnail);
    li.appendChild(hr);
    li.addEventListener("click", selectCharacter.bind(this,char));
    list.appendChild(li);
  }
}

function selectCharacter(char){
  console.log(this);
  toggleMenu();
  let mainIsHidden = getComputedStyle(main).visibility==="hidden";
  console.log(mainIsHidden);
  if(mainIsHidden){
    toggleElement(main);
  }
  main.style.backgroundImage = `url(${char.thumbnail.path}.${char.thumbnail.extension})`;
  let noDescriptionAvailable = char.description.length === 0;
  if(noDescriptionAvailable){
    char.description = "No Description Available";
  }
  description.innerText = char.description;
  charName.innerText = char.name.toUpperCase();

}

function clearList(){
  list.innerHTML = "";
}

function paginateForward(){
  api.query.offset += 20;
  api.query.currentPage +=1;
  api.getCharacterList();
}

function paginateBack(){
  let notFirstPage = api.query.currentPage > 1;
  if(notFirstPage){
    api.query.offset = api.query.offset - 20;
    api.query.currentPage -=1;
    api.getCharacterList();
  }else{
    console.log("Can't go further back");
  }
}


let api = new MarvelApi;
api.getCharacterList();
