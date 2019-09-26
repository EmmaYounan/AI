
const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
  faceapi.nets.ageGenderNet.loadFromUri('/models')
]).then(startWebcam)

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
var videoContainer = document.querySelector('.video-container');
var kind = document.querySelector('.kind');
var volwassen = document.querySelector(".volwassen");

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
    // console.log("info", detections[0]);
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
})