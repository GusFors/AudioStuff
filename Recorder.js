// WaveSurferjs for visualizing audio file https://wavesurfer-js.org/
// https://github.com/katspaugh/wavesurfer.js/blob/master/LICENSE

/**
 * Recorder module.
 * @author Gustav Forselius
 * @version 1.0
 */

/**
  * Class for recorder
  * @class Recorder
  */
export class Recorder {
  constructor (audioContext) {
    this.audioContext = audioContext
    this.streamDestination = this.audioContext.createMediaStreamDestination()
    this.streamRecorder = new window.MediaRecorder(this.streamDestination.stream)
    this.activeApplication = false
  }

  /**
  * Sets up the recorder variables and recorder listeners
  * @param {boolean} activeApplication - Bool telling if the application has been started
  * @param {object} wavesurfer - wavesurfer instance object
  */
  recorderSetup (activeApplication, wavesurfer) {
    let startRecord = document.querySelector('#startrecord')
    let stopRecord = document.querySelector('#stoprecord')
    let pauseRecord = document.querySelector('#pauserecord')

    let chunks = []
    let pause = false
    if (activeApplication) {
      // Start button
      startRecord.onclick = event => {
        if (this.audioContext.state === 'running') {
          this.streamRecorder.start()

          startRecord.style.color = 'red'
        } else {
          document.querySelector('#helptext').innerText = 'Start the application before recording!'
        }
      }

      // Stop button
      stopRecord.onclick = event => {
        if (this.streamRecorder.state === 'recording') {
          this.streamRecorder.stop()
          startRecord.style.color = ''
        }
      }

      // Pause button
      pauseRecord.onclick = event => {
        if (!pause) {
          if (this.streamRecorder.state !== 'inactive') {
            this.streamRecorder.pause()

            pause = true
          }
        } else {
          this.streamRecorder.resume()
          pause = false
        }
      }
    } else {

    }

    // WaveSurferjs for audio file soundwave visualisation

    // Pushes audio data in the array
    this.streamRecorder.ondataavailable = function (evt) {
      chunks.push(evt.data)
    }

    // Recording start
    this.streamRecorder.onstart = () => {
      document.querySelector('#mic').className = 'material-icons recordpulse'
    }

    // Recording pause
    this.streamRecorder.onpause = () => {
      document.querySelector('#mic').className = 'material-icons'

      document.querySelector('#pausemic').innerText = 'play_arrow'
    }

    // Recording resume
    this.streamRecorder.onresume = () => {
      document.querySelector('#mic').className = 'material-icons recordpulse'

      document.querySelector('#pausemic').innerText = 'pause'
    }

    // Recording stop
    this.streamRecorder.onstop = function (evt) {
      document.querySelector('#mic').className = 'material-icons'
      pause = false
      document.querySelector('#pausemic').innerText = 'pause'
      if (document.querySelector('article')) {
        document.querySelector('article').parentElement.removeChild(document.querySelector('article'))
      }

      // Creates the audio element where the recording is placed
      let audioEle = document.createElement('audio')
      let container = document.createElement('article')
      let leftDiv = document.createElement('div')
      let rightDiv = document.createElement('div')
      let playDiv = document.createElement('div')
      playDiv.setAttribute('id', 'playdiv')
      leftDiv.setAttribute('id', 'leftdiv')
      rightDiv.setAttribute('id', 'rightdiv')
      audioEle.setAttribute('controls', 'controls')
      audioEle.setAttribute('preload', 'auto')
      container.setAttribute('id', 'cont')
      container.appendChild(leftDiv)
      container.appendChild(rightDiv)
      container.appendChild(playDiv)
      container.appendChild(audioEle)
      document.querySelector('#visudiv').appendChild(container)
      document.querySelector('audio').focus()
      let blob = new window.Blob(chunks, { 'type': 'audio/ogg; codecs=opus' })
      chunks = []
      let audioUrl = window.URL.createObjectURL(blob)
      wavesurfer.load(audioUrl)
      audioEle.src = audioUrl

      // audioEle.loop = true // Optional loop

      document.querySelector('#downlink').setAttribute('href', audioUrl)
      document.querySelector('#downlink').setAttribute('download', '')

      document.querySelector('#playdiv').addEventListener('click', wavesurfer.playPause.bind(wavesurfer))

      // Mixing together wavesurfer and audio element functionality
      let activeAudio = false
      let currentTime
      document.querySelector('audio').addEventListener('ended', () => {
        wavesurfer.stop()
        activeAudio = false
      })
      wavesurfer.setVolume(0)
      document.querySelector('#visudiv').addEventListener('click', function () {
        document.querySelector('audio').focus()
      })
      document.querySelector('wave').addEventListener('click', () => {
        document.querySelector('audio').pause()
        wavesurfer.pause()
        setTimeout(() => {
          currentTime = wavesurfer.getCurrentTime()
          document.querySelector('audio').currentTime = currentTime
        }, 100)
        // activeAudio = true
      })

      document.querySelector('audio').addEventListener('keypress', (event) => {
        if (!activeAudio) {
          wavesurfer.play()
          activeAudio = true
        } else {
          wavesurfer.pause()
          activeAudio = false
        }
      })

      document.querySelector('audio').addEventListener('click', function () {

        // wavesurfer.play([this.currentTime])
      })

      document.querySelector('#playdiv').addEventListener('click', () => {
        if (!activeAudio) {
          document.querySelector('audio').play()
          activeAudio = true
        } else {
          document.querySelector('audio').pause()
          activeAudio = false
        }
      })
    }
  }
}
