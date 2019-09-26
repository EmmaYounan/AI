# AI

Movie filter based on age. Using face detection / age recognition.

## Intro

Using face detection (face-api.min.js) and age recognition we were able to make a program that is able to filter movies based on the age of the user. The systeem can recognize a human face and give back a prediction of the age. Through an if and else statment we were able to determine which movies the system should show based on the age that the AI predicted.

### Prerequisites

Visual Studio Code
Install all models and the face-api.min.js 

### Installing

Put the models and the face-api.min.js file that you installed in the folder that you will use for this project.
Make an HTML file and copy our code in it.
Do the same for js and css and save all of that in your project folder.

Some explanation about the code - javascript

```
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
  faceapi.nets.ageGenderNet.loadFromUri('/models')
]).then(startWebcam)
```
Using this code you you will be able to load all the models that you downloaded and let them work when the webcam starts.


```
function startWebcam() {
  var vid = document.querySelector('video');
  // request cam
  navigator.mediaDevices.getUserMedia({
      video: true
    })
    .then(stream => {
      // save stream to variable at top level so it can be stopped lateron
      webcamStream = stream;
      // show stream from the webcam on te video element
      vid.srcObject = stream;
      // returns a Promise to indicate if the video is playing
      return vid.play();
    })
    .catch(e => console.log('error: ' + e));
}
```
This is a function that starts your webcam, gets the user media and displays it in a video element on your browser.


```
video.addEventListener('play', () => {
  const canvas = document.createElement("canvas");
  videoContainer.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withAgeAndGender()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    resizedDetections.forEach(result => {
      const { age, gender, genderProbability } = result
      new faceapi.draw.DrawTextField(
        [
          `${faceapi.round(age, 0)} years`,
          `${gender} (${faceapi.round(genderProbability)})`
        ],
        result.detection.box.bottomLeft
      ).draw(canvas)
    })
 ```
When the video starts The the information that you got from the models that you downloaded will be displayed on the video       using a canvas element. You will be able to see the age and the gender on each face that comes on the camera.


   ```
   var videoContainer = document.querySelector('.video-container');
var kind = document.querySelector('.kind');
var volwassen = document.querySelector(".volwassen");
   if (detections[0].age && detections[0].age < 16) {
      console.log("mag niet filmpjes bekijken onder 16");
      kind.classList.remove('display-none');
      volwassen.classList.add('display-none');
    }else{
      console.log("mag alles bekijken");
      volwassen.classList.remove('display-none');
      kind.classList.add('display-none');
    }
  }, 100)
  ```
Using the If and else statement we determine what kind of movies should be shawn to each age group.

### Bronen
* https://www.youtube.com/watch?v=CVClHLwv-4I
* https://github.com/justadudewhohacks/face-api.js/blob/master/examples/examples-browser/views/ageAndGenderRecognition.html#L160-L169

## Authors

* **Emma younan**
* **Eva Gerritsen** 




