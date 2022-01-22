let video = document.querySelector('video');//selecting video tag
let videoBtn=document.querySelector('.btn2');
let imgBtn=document.querySelector('.btn1');
let e1=document.querySelector(".effect1")
let e2=document.querySelector(".effect2")
let e3=document.querySelector(".effect3")
let e4=document.querySelector(".effect4")
let e5=document.querySelector(".effect5");
let color="transparent";
let filter=document.querySelector(".filter-layer")
let isRecording=false;
let chunks=[]
let mediaRecorder;
//defining constraints
let constraints = {
    video: true,
    audio: true,
}
//on clicking on video recorder btn
videoBtn.addEventListener('click',function(){
    if(isRecording)
    {
        mediaRecorder.stop();
        isRecording=false;
        videoBtn.classList.remove("scale-record")
    }else{
        mediaRecorder.start();
        isRecording=true;
        videoBtn.classList.add("scale-record")
    }
})

//selecting filter
e1.addEventListener("click",()=>{
    color="rgba(138, 124, 49, 0.199)"
    filter.style.backgroundColor=color
})
e2.addEventListener("click",()=>{
    color="rgba(159, 56, 175, 0.199)"
    filter.style.backgroundColor=color
})
e3.addEventListener("click",()=>{
    color="rgba(172, 137, 42, 0.195)";
    filter.style.backgroundColor=color
})
e4.addEventListener("click",()=>{
    color="rgba(89, 143, 53, 0.197)";
    filter.style.backgroundColor=color
})
e5.addEventListener("click",()=>{
    color="transparent"
    filter.style.backgroundColor=color
})



//on clicking on image capture btn
imgBtn.addEventListener("click",(e)=>{
    let canvas=document.createElement("canvas")
    canvas.height=video.videoHeight;
    canvas.width=video.videoWidth;
    let tool=canvas.getContext('2d')
    tool.drawImage(video,0,0,canvas.width,canvas.height)
    //filttering
    tool.fillStyle=color
    tool.fillRect(0,0,canvas.width,canvas.height)
    let imageUrl=canvas.toDataURL()
    if(db)
    {
        let imgId=shortid()
        let dbTransaction=db.transaction("image","readwrite")
        let imgStore=dbTransaction.objectStore("image")
        let imageEntry={
            id:`img-${imgId}`,
            url:imageUrl
        }
        imgStore.add(imageEntry)
    }
    // let a=document.createElement('a')
    // a.href=imageUrl
    // a.download='image.jpg'
    // a.click()
    // a.remove();

})
//navigator is browser obj which has media device obj which contains function getusermedia to stream our video or audio then we have passed that object to function and shown that stream to video
navigator.mediaDevices
.getUserMedia(constraints)
.then(function (mediaObj) {
    video.srcObject = mediaObj
    // video.muted = true
    // video.play()
    let options={mineType:"video/webm;codecs=vp9"}
    mediaRecorder=new MediaRecorder(mediaObj,options);
    mediaRecorder.addEventListener("stop",function(e)
    {
        let blob=new Blob(chunks,{type:"video/mp4"})
        chunks=[]
        let url=URL.createObjectURL(blob);
        if(db)
        {
        let videoId=shortid();
        let dbTransaction=db.transaction("video","readwrite")
        let videoStore=dbTransaction.objectStore("video");
        console.log(`vid-${videoId}`)
        let videoEntry={
            id:`vid-${videoId}`,
            blobData:blob
        }
        videoStore.add(videoEntry)
        // let a=document.createElement("a")
        // a.href=url
        // a.download="video.mp4"
        // a.click()
        // a.remove()
        }
    })
    mediaRecorder.addEventListener('dataavailable',function(e){
        chunks.push(e.data);
    })

})