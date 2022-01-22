let db;
let openRequest=indexedDB.open("myDb")

//db has three even listener #success#error#updateneeded

openRequest.addEventListener("upgradeneeded",(e)=>{
    console.log("Updated needed")
    db=openRequest.result;
    db.createObjectStore("video",{keyPath:"id"})
    db.createObjectStore("image",{keyPath:"id"})
})
openRequest.addEventListener("success",(e)=>{
    console.log("Success")
    db=openRequest.result;
})
openRequest.addEventListener("error",(e)=>{
    console.log("Erorr encountered");
})