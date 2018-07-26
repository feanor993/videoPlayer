'use strict';
let windowData = {
    browser: navigator.userAgent,
    outerWidth: window.outerWidth,
    innerWidth: window.innerWidth,
    outerHeight: window.outerHeight,
    innerHeight: window.innerHeight
};
let windowJSON = JSON.stringify(windowData);
let windowDataRequest = new XMLHttpRequest();
windowDataRequest.open('POST', 'https://httpbin.org/post', true);
windowDataRequest.onload = () => {
    if (windowDataRequest.status === 200)
        windowDataRequest.send(windowJSON);

};
console.log(windowJSON);


let advertising = {
    "timestamp": 5000,
    "sourse": "video/azino.mp4"
};

// получение данных о видео
function getVideoData() {
    let vidData = {};
    vidData.timeStamp = video.currentTime;
    vidData.sourse = video.src;
    vidData.dur = video.duration;
    vidData.width = video.offsetWidth;
    return vidData;
}

/// служебные функции
let qs = (elem, sel = document) => sel.querySelector(elem),
    qsAll = (elem, sel = document) => sel.querySelectorAll(elem),
    togglePlay = () => {
        if (getVideoData().sourse.indexOf(advertising.sourse) < 0) {
            video.paused ? video.play() : video.pause()
        }
    },
    handleProgress = () => progressBar.style.flexBasis = `${(video.currentTime / video.duration) * 100}%`,
    scrub = e => video.currentTime = (e.offsetX / progress.offsetWidth) * video.duration,
    hideTooltip = () => progressTooltip.style.opacity = 0,
    keyDownDoc = e => {
        // e.which === 32 ||
        if (e.which === 13) {
            e.stopPropagation();
            e.preventDefault();
        }
    },
    abs = Math.abs,
    // поиск ближайшего соседа по значению в массиве
    closest = (arr, num) => arr.reduce((p, c) => abs(c - num) < abs(p - num) ? c : p),
    // создание массива таймметок
    getStamps = () => {
        let tmstms = [];
        timeStamps.forEach(ts => {
            let stamp = ts.dataset.time;
            tmstms.push(stamp)
        });
        return tmstms
    },
    fullscreenToggle = () => {
        openFs();
        canselFs();
    },
    toggleVolume = () => {
        volumeIcon.classList.toggle('mute');
        video.volume === 0 ? video.volume = 0.8 : video.volume = 0;
        qs('.range-slider__thumb').classList.toggle('unactive');

    },
    toggleSpeed = () => speedList.classList.toggle('active');


//  html элементы
const player = qs('.player');
const video = qs('.viewer', player),
    progress = qs('.progress', player),
    progressBar = qs('.progress__filled', player),
    toggle = qs('.toggle', player),
    skipButtons = qsAll('[data-skip]', player),
    ranges = qsAll('.player__slider'),
    controls = qs('.player__controls'),
    timeStamps = qsAll('.time__control'),
    progressTooltip = qs('.progress__tooltip'),
    fullscreen = qs('.fullscreen', player),
    clearRek = qs('.clearRek'),
    togMenuBtn = qs('.player__btn', player),
    togMenu = qs('.controlsTime'),
    volumeEl = qs('input[name="volume"]'),
    volumeWrap = qs('.range-slider__wrap'),
    volumeIcon = qs('.range-slider__icon', volumeWrap),
    volumeControl = qs('.range-slider'),
    speedTitle = qs('.speed__list-title', player),
    speedItem = qsAll('.speed__list-item', player),
    speedList = qs('.speed__list', player);


//переключение иконки плэй/пауза
function updateButton() {
    if (this.paused) {
        toggle.classList.remove('playing');
        toggle.classList.add('paused');
    }
    else {
        toggle.classList.remove('paused');
        toggle.classList.add('playing')
    }
    // toggle.textContent = this.paused ? '►' : '❚ ❚';
}

//вперед-назад 10/25 сек
function skip() {
    video.currentTime += parseFloat(this.dataset.skip);
}

// контролы звука и скорости
function handleRangeUpdate() {
    video[this.name] = this.value;
}

//к тайметке
function toTimeStamp() {
    if (getVideoData().sourse.indexOf(advertising.sourse) < 0) {
        video.currentTime = this.dataset.time;
        timeStamps.forEach(ts => ts.classList.remove('active'));
        this.classList.add('active');
        video.play();
    }

}

//закончить рекламу и начать воспроизвиедение с того же места
function endedAdv(obj) {
    video.src = obj.sourse;
    video.currentTime = obj.timeStamp;
    video.play();
}

//закончить рекламу по нажатию на кнопку
function clTime() {
    clearTimeout(window.advTime);
    endedAdv(window.first);
    controls.style.display = 'flex';
    clearRek.style.display = 'none';
    return false;
}

// оглавление
function testPlaying() {
    let arr = getStamps();
    setInterval(function () {
        if (!video.paused && getVideoData().sourse.indexOf(advertising.sourse) < 0) {
            let curTime = parseInt(video.currentTime);
            let iskTime = closest(arr, curTime).toString();
            let elem = qs(`.time__control[data-time="${iskTime}"]`);
            if (!((" " + elem.className + " ").replace(/[\n\t]/g, " ").indexOf('active') > -1 )) {
                let elems = [...timeStamps];
                elems.filter(elemt => (" " + elemt.className + " ").replace(/[\n\t]/g, " ").indexOf('active') > -1)
                    .forEach(el => el.classList.remove('active'));
                elem.classList.add('active')
            }
        }
    }, 2000)
}


//главная функция рекламы
let a = 0;

function addAdv() {
    testPlaying();
    window.advTime = '';
    if (getVideoData().sourse.indexOf(advertising.sourse) < 0 && a === 0) {
        a = 1;
        window.advTime = function () {
            setTimeout(function () {
                clearRek.style.display = 'block';
                window.first = getVideoData();
                video.pause();
                controls.style.display = 'none';
                video.src = advertising.sourse;
                video.addEventListener('loadedmetadata', function () {
                    window.second = parseInt(getVideoData().dur * 1000);
                    video.play();
                });

            }, advertising.timestamp)
        };
        window.advTime();

    }
    if (!video.paused && getVideoData().sourse.indexOf(advertising.sourse) > -1) {
        setTimeout(function () {
            video.addEventListener('ended', endedAdv(window.first));
            controls.style.display = 'flex';
            clearRek.style.display = 'none';
        }, window.second);

    }
    clearRek.addEventListener('click', clTime)
}

function canselFs() {
    if (document.webkitIsFullScreen || document.mozFullScreenElement) {
        if (player.webkitRequestFullScreen) {
            document.webkitCancelFullScreen();
        }
        else if (player.mozRequestFullScreen) {
            document.mozCancelFullScreen();
        }
    }
}

function openFs() {
    if (!(document.webkitIsFullScreen || document.mozFullScreenElement)) {
        if (player.webkitRequestFullScreen) {
            player.webkitRequestFullScreen();
        }
        else if (player.mozRequestFullScreen) {
            player.mozRequestFullScreen();
        }
    }
}


// прогресс бар для видео
function vidCurrentTime(e) {
    let seconds = parseInt(e.offsetX / progress.offsetWidth * getVideoData().dur);
    progressTooltip.innerText = `${Math.floor(seconds / 60)}: ${seconds % 60}`;
    progressTooltip.style.opacity = 1;
    progressTooltip.style.left = `${e.offsetX / progress.offsetWidth * 100}%`;
}

// буферизация(добить)
let bufferAnalizer = function (playbackStartPoint, playbackEndPoint,
                               bufferStartPoint, bufferEndPoint, duration) {
    let oldQualityObj = this.qualityObj,
        playbackStart = 0, // new playback start point
        bufferStart = 0; // new buffer start point

    if (oldQualityObj) {
        playbackStart = oldQualityObj.playbackEndPoint;
        bufferStart = oldQualityObj.bufferEndPoint;
    } else {
        playbackStart = playbackStartPoint;
        bufferStart = bufferStartPoint;
    }

    this.qualityObj = {
        'playbackEndPoint': playbackEndPoint,
        'bufferEndPoint': bufferEndPoint,
        'deltaBuffer': bufferEndPoint - bufferStart, // сколько забуферизовано
        'bufferSpeed': (bufferEndPoint - bufferStart) /
        (playbackEndPoint - playbackStart),
        'deltaPlayback': playbackEndPoint - playbackStart, // сколько было
                                                           //воспроизведено
        'availTime': bufferEndPoint - playbackEndPoint // разница между буффером и
                                                       // позицией воспроизведения
    };

    let restTime = duration - playbackEndPoint,
        bufferTime = (duration - bufferEndPoint) / this.qualityObj.bufferSpeed;

    if ((bufferTime > restTime) && ((this.qualityObj.availTime /
            this.qualityObj.deltaPlayback ) < 2)) {
        if (this.quality == 'normal') {
            this.quality = 'low';
        }
    }
};


function togMenuF() {
    player.classList.toggle('full');
    togMenu.classList.toggle('unactive');
    canselFs();
}

function updateVolume(el = volumeEl) {
    if (el) {
        el = volumeEl;
        volumeIcon.classList.remove('mute');
        let parent = qs('.range-slider');
        let thumb = qs('.range-slider__thumb'),
            bar = qs('.range-slider__bar'),
            pct = el.value * ((parent.clientHeight - thumb.clientHeight) / parent.clientHeight);
        thumb.style.bottom = (pct * 100) + '%';
        bar.style.height = 'calc(' + (pct * 100) + '% + ' + thumb.clientHeight / 2 + 'px)';
    }
}

updateVolume();

function setSpeed() {
    video.playbackRate =  parseFloat(this.dataset.speed);
    speedList.classList.remove('active');
    speedTitle.textContent =  this.textContent;
    video.play();
}

//добавление событий
video.addEventListener('click', togglePlay);
timeStamps.forEach(timeStamp => timeStamp.addEventListener('click', toTimeStamp));
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);
video.addEventListener('playing', addAdv);
toggle.addEventListener('click', togglePlay);
fullscreen.addEventListener('click', fullscreenToggle);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
volumeEl.addEventListener('input', updateVolume);
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', vidCurrentTime);
progress.addEventListener('mouseout', hideTooltip);
document.addEventListener('keydown', keyDownDoc);
togMenuBtn.addEventListener('click', togMenuF);
volumeIcon.addEventListener('click', toggleVolume);
speedTitle.addEventListener('click', toggleSpeed);
speedItem.forEach(item => item.addEventListener('click', setSpeed));
// document.addEventListener('click', hideSpeed)



