'use strict';

import {
    MiniClock as analogClock
} from "./components/mini-clock/mini-clock.js";
import {
    MainNav as mainNav
} from "./components/main-navigation/main-navigation.js";

window.customElements.define("analog-clock", analogClock);
window.customElements.define("main-nav-comp", mainNav);
const $ = document;

window.addEventListener('DOMContentLoaded', () => {
    /*let btnToggle = false;*/
// Main stuff
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const seasonText = $.querySelector('.season');
    const dayText = $.querySelector('.day');
    let currentSeason;
//Sidebar stuff:
    const sideBar = $.querySelector('.sideBar');
    let sidebarmain;
    let currentMusic;
    let musics = [
        {
            id: 1,
            title: 'Debussy - Rêverie',
            src: './files/musics/Debussy - Rêverie.mp3',
        },
        {
            id: 2,
            title: 'Debussy - Valse Romantique',
            src: './files/musics/Debussy - Valse Romantique.mp3',
        },
        {
            id: 3,
            title: 'Ravel - Gaspard de la nuit - II. Le Gibet',
            src: './files/musics/Ravel - Gaspard de la nuit - II. Le Gibet.mp3',
        },
        {
            id: 4,
            title: 'Shostakovich - Piano Concerto No. 2, in F major, Op. 102- Andante',
            src: './files/musics/Shostakovich - Piano Concerto No. 2, in F major, Op. 102- Andante.mp3',
        },
    ];

    let now = new Date();

    window.addEventListener('resize', () => {
        if (window.matchMedia("(min-width: 1101px)").matches) {
            setupLargeScreen();
        } else {
            if (sidebarmain) {
                sidebarmain.remove();
            }
/*
            if (btnToggle) return; //Cuz I already have set up the small screen in setSeasonState.
*/
            /*navBar.style.top = '-450px';
            menuBtns[0].style.display = 'block';
            menuBtns[1].style.display = 'none';*/
            seasonText.children[1].style.backgroundImage = 'none';
            switch (currentSeason) {
                case 'Spring':
                    seasonText.style.textShadow = '1px 1px 20px #82d000ff';
                    dayText.style.backgroundImage = `url('./files/${currentSeason.toLowerCase()}-blurred.jpg')`;
                    dayText.style.color = 'transparent';
                    dayText.style.textShadow = 'none';
                    break;
                case 'Summer':
                    seasonText.style.textShadow = '1px 1px 10px #ffe693e5';
                    dayText.style.backgroundImage = `url('./files/${currentSeason.toLowerCase()}.jpg')`;
                    dayText.style.color = 'transparent';
                    dayText.style.textShadow = 'none';
                    break;
                case 'Autumn':
                    seasonText.style.textShadow = '10px 10px 15px #000';
                    dayText.style.backgroundImage = `url('./files/${currentSeason.toLowerCase()}.jpg')`;
                    dayText.style.color = 'transparent';
                    dayText.style.textShadow = 'none';
                    break;
                case 'Winter':
                    seasonText.style.textShadow = '1px 1px 15px #0075e3ff';
                    dayText.style.textShadow = '0 0px 40px #0075d3aa';
            }
        }
    });

    function setSeasonState() {
        let currentMonth = now.getMonth();
        const seasonImage = $.querySelector('.bgDiv img');
        const monthsContainer = $.querySelectorAll('.months div');
        /*currentMonth = 11;*/
        if (currentMonth == 2 || currentMonth == 3 || currentMonth == 4) {
            currentSeason = 'Spring';
            seasonText.style.textShadow = '1px 1px 20px #82d000ff';
            monthsContainer[1].style.backgroundImage = `url('./files/${currentSeason.toLowerCase()}.jpg')`;
            dayText.style.backgroundImage = `url('./files/${currentSeason.toLowerCase()}.jpg')`;
            dayText.style.backgroundSize = '1500px';
            dayText.style.backgroundPosition = '-2500px -205px';
        }
        if (currentMonth == 5 || currentMonth == 6 || currentMonth == 7) {
            currentSeason = 'Summer';
            seasonText.style.textShadow = '1px 1px 10px #ffe693e5';
            monthsContainer[1].style.backgroundImage = `url('./files/${currentSeason.toLowerCase()}.jpg')`;
            dayText.style.backgroundImage = `url('./files/${currentSeason.toLowerCase()}.jpg')`;
        }
        if (currentMonth == 8 || currentMonth == 9 || currentMonth == 10) {
            currentSeason = 'Autumn';
            seasonText.style.textShadow = '10px 10px 15px #000';
            seasonText.style.left = '65px';
            monthsContainer[1].style.backgroundImage = `url('./files/${currentSeason.toLowerCase()}.jpg')`;
            dayText.style.backgroundImage = `url('./files/${currentSeason.toLowerCase()}.jpg')`;
            dayText.style.backgroundRepeat = 'no-repeat';
            dayText.style.backgroundPosition = '-200px -600px';
        }
        if (currentMonth == 11 || currentMonth == 0 || currentMonth == 1) {
            currentSeason = 'Winter';
            seasonText.style.textShadow = '1px 1px 15px #0075e3ff';
            seasonText.style.left = '-15px';
            monthsContainer[1].style.backgroundImage = `url('./files/${currentSeason.toLowerCase()}.jpg')`;
            dayText.style.color = `white`;
            dayText.style.textShadow = '0 0px 40px #0075d3aa';
        }
        let currentDay = now.getDate();
        currentDay = currentDay < 10 ? '0' + currentDay : String(currentDay);

        seasonImage.src = `./files/${currentSeason.toLowerCase()}.jpg`;
        seasonText.innerHTML = `
        <span class="simpleText">${currentSeason.substring(0,3)}</span><span class="bgText">${currentSeason.substring(3,6)}</span>
    `
        monthsContainer[0].innerHTML = months[currentMonth - 1] || 'Dec';
        monthsContainer[1].innerHTML = months[currentMonth];
        monthsContainer[2].innerHTML = months[currentMonth + 1] || 'Jan';

        dayText.innerHTML = currentDay;
    }

    function setupLargeScreen() {
        seasonText.style.textShadow = 'none';
        seasonText.children[1].style.backgroundImage = `url('./files/${currentSeason.toLowerCase()}.jpg')`
        dayText.style.backgroundImage = 'none';
        dayText.style.color = 'white';
        dayText.style.textShadow = 'none';
        // Create clock sidebar:
        setupSideBar();
    }

    function setupSideBar() {
        if (sideBar.children.length) {
            return;
        }
        sidebarmain = $.createElement('div');
        sidebarmain.id = 'sideBarMain';
        sidebarmain.innerHTML = `
        <div id="dateAndClock">
                <analog-clock></analog-clock>
                <span></span>
                <span>9 / 08</span>
                <span>6 PM</span>
            </div>
            <div id="player">
                <div id="music">
                    <audio src="./files/musics/Debussy%20-%20Valse%20Romantique.mp3"></audio>
                </div>
                <div id="albumArt">
                    <svg data-heart-type="0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path style="fill: #fff;" d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/></svg>
                    <svg data-heart-type="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>
                    <img src="./files/cassette.jpg" alt="Cassette Image">
                </div>
                <div id="musicTitle">
                    <p>Chopin - Andante Spianato and Grande Polonaise brilliante</p>
                </div>
                <div id="seekModal">00:00
                    <div><!--Little Arrow--></div>
                </div>
                <div id="playerTiming">
                    <div id="seeker">
                        <div id="seekerFill"></div>
                        <img src="./files/seeker.png" alt="Seeker Image">
                    </div>
                    <span>04:55</span>
                    <span>06:44</span>
                </div>
                <div id="playerControls">
                    <svg id="controlsSvg" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <filter id="gooey">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="gooey" />
                                <feBlend in="SourceGraphic" in2="gooey" />
                            </filter>
                        </defs>
                        <g filter="url(#gooey)">
                            <circle style="cursor: pointer" cx="23" cy="32" r="22" fill="#d5d5d5"/>
                            <circle style="cursor: pointer" cx="70" cy="32" r="28" fill="#d5d5d5"/>
                            <circle style="cursor: pointer" cx="117" cy="32" r="22" fill="#d5d5d5"/>
                        </g>
                    </svg>
                    <div id="controlsIcons">
                        <svg data-btn-type="play" xmlns="http://www.w3.org/2000/svg" viewBox="-100 0 520 512"><title>Play</title><path d="M56.3 66.3c-4.9-3-11.1-3.1-16.2-.3s-8.2 8.2-8.2 14l0 352c0 5.8 3.1 11.1 8.2 14s11.2 2.7 16.2-.3l288-176c4.8-2.9 7.7-8.1 7.7-13.7s-2.9-10.7-7.7-13.7l-288-176zM24.5 38.1C39.7 29.6 58.2 30 73 39L361 215c14.3 8.7 23 24.2 23 41s-8.7 32.2-23 41L73 473c-14.8 9.1-33.4 9.4-48.5 .9S0 449.4 0 432L0 80C0 62.6 9.4 46.6 24.5 38.1z"/></svg>
                        <svg data-btn-type="pause" xmlns="http://www.w3.org/2000/svg" viewBox="-100 0 520 512"><title>Pause</title><path d="M48 96c-8.8 0-16 7.2-16 16l0 288c0 8.8 7.2 16 16 16l48 0c8.8 0 16-7.2 16-16l0-288c0-8.8-7.2-16-16-16L48 96zM0 112C0 85.5 21.5 64 48 64l48 0c26.5 0 48 21.5 48 48l0 288c0 26.5-21.5 48-48 48l-48 0c-26.5 0-48-21.5-48-48L0 112zM224 96c-8.8 0-16 7.2-16 16l0 288c0 8.8 7.2 16 16 16l48 0c8.8 0 16-7.2 16-16l0-288c0-8.8-7.2-16-16-16l-48 0zm-48 16c0-26.5 21.5-48 48-48l48 0c26.5 0 48 21.5 48 48l0 288c0 26.5-21.5 48-48 48l-48 0c-26.5 0-48-21.5-48-48l0-288z"/></svg>
                        <svg data-btn-type="next" xmlns="http://www.w3.org/2000/svg" viewBox="-120 -50 520 570"><title>Next Track</title><path class="fa-secondary" style="fill:var(&#45;&#45;fa-secondary-color,inherit);opacity:var(&#45;&#45;fa-secondary-opacity,.4);" d="M256 96l0 145 0 30 0 145c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32z"/><path class="fa-primary" style="fill:var(&#45;&#45;fa-primary-color,inherit);opacity:var(&#45;&#45;fa-primary-opacity,1);" d="M18.4 445c11.2 5.3 24.5 3.6 34.1-4.4l192-160L256 271l0-30-11.5-9.6-192-160c-9.5-7.9-22.8-9.7-34.1-4.4S0 83.6 0 96L0 416c0 12.4 7.2 23.7 18.4 29z"/></svg>
                        <svg data-btn-type="prev" xmlns="http://www.w3.org/2000/svg" viewBox="-20 -50 520 570"><title>Previous Track</title><path class="fa-secondary" style="fill:var(&#45;&#45;fa-secondary-color,inherit);opacity:var(&#45;&#45;fa-secondary-opacity,.4);" d="M0 96L0 416c0 17.7 14.3 32 32 32s32-14.3 32-32l0-145 0-30L64 96c0-17.7-14.3-32-32-32S0 78.3 0 96z"/><path class="fa-primary" style="fill:var(&#45;&#45;fa-primary-color,inherit);opacity:var(&#45;&#45;fa-primary-opacity,1);" d="M301.6 445c-11.2 5.3-24.5 3.6-34.1-4.4l-192-160L64 271l0-30 11.5-9.6 192-160c9.5-7.9 22.8-9.7 34.1-4.4S320 83.6 320 96l0 320c0 12.4-7.2 23.7-18.4 29z"/></svg>
                    </div>
                    <div><!--For controls svg shadow effect--></div>
                </div>
                <div id="volume">
                    <svg data-vol-btn-type="sound" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M320 66.7L183.6 188c-2.9 2.6-6.7 4-10.6 4l-85 0c-13.3 0-24 10.7-24 24l0 80c0 13.3 10.7 24 24 24l85 0c3.9 0 7.7 1.4 10.6 4L320 445.3l0-378.6zM302.4 39.5c5.5-4.8 12.5-7.5 19.8-7.5C338.7 32 352 45.3 352 61.8l0 388.4c0 16.5-13.3 29.8-29.8 29.8c-7.3 0-14.3-2.7-19.8-7.5l10.6-12-10.6 12L166.9 352 88 352c-30.9 0-56-25.1-56-56l0-80c0-30.9 25.1-56 56-56l78.9 0L302.4 39.5zM419.2 182.4c5.3-7.1 15.3-8.5 22.4-3.2C464.9 196.7 480 224.6 480 256s-15.1 59.3-38.4 76.8c-7.1 5.3-17.1 3.9-22.4-3.2s-3.9-17.1 3.2-22.4C438 295.5 448 276.9 448 256s-10-39.5-25.6-51.2c-7.1-5.3-8.5-15.3-3.2-22.4zm87-74.5C548.8 143.1 576 196.4 576 256s-27.2 112.9-69.8 148.1c-6.8 5.6-16.9 4.7-22.5-2.1s-4.7-16.9 2.1-22.5C521.4 350.1 544 305.7 544 256s-22.6-94.1-58.2-123.4c-6.8-5.6-7.8-15.7-2.1-22.5s15.7-7.8 22.5-2.1z"/></svg>
                    <svg data-vol-btn-type="mute" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M151.6 188L288 66.7l0 378.6L151.6 324c-2.9-2.6-6.7-4-10.6-4l-85 0c-13.3 0-24-10.7-24-24l0-80c0-13.3 10.7-24 24-24l85 0c3.9 0 7.7-1.4 10.6-4zM290.2 32c-7.3 0-14.3 2.7-19.8 7.5L134.9 160 56 160c-30.9 0-56 25.1-56 56l0 80c0 30.9 25.1 56 56 56l78.9 0L270.4 472.5l10.6-12-10.6 12c5.5 4.8 12.5 7.5 19.8 7.5c16.5 0 29.8-13.3 29.8-29.8l0-388.4C320 45.3 306.7 32 290.2 32zM411.3 164.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L457.4 256l-68.7 68.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L480 278.6l68.7 68.7c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L502.6 256l68.7-68.7c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L480 233.4l-68.7-68.7z"/></svg>
                    <input type="range" id="customSlider" min="0" max="1" step="0.02" value="0.2">
                </div>
            </div>
    `;


        sideBar.append(sidebarmain);
        let dateAndClock = $.getElementById('dateAndClock');
        let currentYear = now.getFullYear();
        currentYear = String(currentYear).split('');
        dateAndClock.children[1].innerHTML = `${currentYear[0]}&nbsp&nbsp${currentYear[1]}&nbsp&nbsp${currentYear[2]}&nbsp&nbsp${currentYear[3]}`;
        currentYear = undefined;
        dateAndClock.children[2].innerHTML = `${now.getMonth() + 1} / ${now.getDate() > 9 ?
            now.getDate() : '0' + now.getDate()}`;
        setInterval(() => {
            dateAndClock.children[3].innerHTML = `${now.getHours() > 12 ?
                now.getHours() - 12 + ' PM' : now.getHours() === 12 ? now.getHours() +
                    ' PM' : now.getHours() === 0 ? '12 AM' : now.getHours() + ' AM'}`;
        }, 1000);
        setupPlayer(1);
    }

    function setupPlayer(trackID) {
        // Player Elements:
        currentMusic = musics[trackID - 1];
        $.querySelector('#music').innerHTML = `<audio src="${currentMusic.src}"></audio>`;
        const musicTag = $.querySelector('#music audio');
        const albumArtSvgs = $.querySelectorAll('#albumArt svg');
        const musicTitle = $.querySelector('#musicTitle p');
        const seeker = $.getElementById('seeker');
        const seekerFill = $.getElementById('seekerFill');
        const seekModal = $.getElementById('seekModal');
        const seekArrow = $.querySelector('#seekModal div');
        const musicCurrentTime = $.querySelector('#playerTiming span:nth-child(2)');
        const musicDuration = $.querySelector('#playerTiming span:nth-child(3)');
        const controlBtns = $.querySelectorAll('#controlsIcons svg');
        const volumeContainer = $.getElementById("volume");
        const volumeSlider = $.getElementById('customSlider');
        let currentVolume = 0.2;

        albumArtSvgs.forEach((svg, index) => {
            svg.addEventListener('click', e => {
                /*I first wrote e.currentTarget.dataset.heartType and it DIDN'T work!*/
                if (e.currentTarget.dataset.heartType === '1') {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.previousElementSibling.style.display = 'block';
                } else {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'block';
                }
            });
        });

        musicTag.src = currentMusic.src;
        musicTitle.innerHTML = `${currentMusic.title}`;
        seeker.addEventListener('mousemove', seekModalHandler.bind(event, seekModal, musicTag));
        seeker.addEventListener('click', e => {
            /*As we already know, the width of the seeker image is 280 pixels*/
            //musicTag.currentTime = (Math.ceil((e.layerX / e.currentTarget.offsetWidth) - 0.05) * musicTag.duration);
            let userBrowser = browserDetect();
            if (userBrowser === 'firefox') {
                musicTag.currentTime = ((e.layerX / e.currentTarget.offsetWidth) - 0.005).toFixed(2) * musicTag.duration;
                seekerFill.style.left = `${-100 + (musicTag.currentTime / musicTag.duration * 100)}%`;
            } else {
                musicTag.currentTime = ((e.offsetX / e.currentTarget.offsetWidth) - 0.005).toFixed(2) * musicTag.duration;
                seekerFill.style.left = `${-100 + (musicTag.currentTime / musicTag.duration * 100)}%`;
            }

        });
        musicCurrentTime.innerHTML = `${timeFormatHandler(musicTag.currentTime)}`;
        // Here we ensure music is fully loaded b4 attempting to get its duration:
        musicTag.addEventListener('loadedmetadata', e => {
            musicDuration.innerHTML = `${timeFormatHandler(musicTag.duration)}`;
        });
        musicTag.addEventListener('ended', e => {
            controlBtns[1].style.display = 'none';
            controlBtns[0].style.display = 'block';
        })
        /*I accidentally had selected the parent div (#controlsIcons) as controlsBtns
        and surprisingly, the event listeners were working just fine! WHY?!
        * Solution: It worked bcuz of event delegation. When each svg was clicked, the
        * event bubbled its way up to the container svg, and then the event target's
        * closest SVG was picked and the rest of the code was executed as it had to.
        *** It's even more efficient to set one event listener to the parent rather
        *** than setting it for each of the buttons. But I used the buttons in line
        *** 333, so I'm not changing it here.
        */
        controlBtns.forEach((btn, index) => {
            // I used .onclick bcuz it overwrites the existing event listeners, so
            // we don't need to explicitly remove each of them.
            btn.onclick = (e) => {
                let clickedSvg = e.target.closest('svg');
                if (clickedSvg.dataset.btnType === 'play') {
                    playMusic(musicTag, clickedSvg, seekerFill, musicCurrentTime);
                } else if (clickedSvg.dataset.btnType === 'pause') {
                    pauseMusic(musicTag, clickedSvg);
                } else if (clickedSvg.dataset.btnType === 'next') {
                    let pauseSvg = clickedSvg.previousElementSibling;
                    pauseMusic(musicTag, pauseSvg);
                    seekerFill.style.left = '-100%';
                    $.querySelector('#music').innerHTML = '';
                    musics[trackID] ? setupPlayer(++trackID) : setupPlayer(1);
                } else { /*Previous button*/
                    let pauseSvg = clickedSvg.previousElementSibling.previousElementSibling;
                    pauseMusic(musicTag, pauseSvg);
                    seekerFill.style.left = '-100%';
                    $.querySelector('#music').innerHTML = '';
                    musics[trackID - 2] ? setupPlayer(--trackID) : setupPlayer(musics.length);
                }
            }
        });

        musicTag.volume = 0.2;
        volumeContainer.addEventListener('mouseover', function () {
            volumeContainer.style.height = '100px';
            volumeContainer.style.top = '185px';
            volumeSlider.style.display = "block";
        });
        volumeContainer.addEventListener('mouseleave', function () {
            volumeContainer.style.height = '20px';
            volumeContainer.style.top = '265px';
            volumeSlider.style.display = "none";
        });
        volumeSlider.addEventListener('change', function (event) {
            musicTag.volume = event.target.value;
            if (musicTag.volume === 0) {
                $.querySelector("#volume svg:first-child").style.display = "none";
                $.querySelector("#volume svg:nth-child(2)").style.display = "block";
            } else {
                $.querySelector("#volume svg:first-child").style.display = "block";
                $.querySelector("#volume svg:nth-child(2)").style.display = "none";
            }
        });
        $.querySelectorAll("#volume svg").forEach(function (icon) {
            icon.addEventListener('click', function (e) {
                console.log(currentVolume);
                if (e.currentTarget.dataset.volBtnType === 'sound') {
                    currentVolume = musicTag.volume;
                    icon.style.display = "none";
                    icon.nextElementSibling.style.display = "block";
                    musicTag.volume = 0;
                    volumeSlider.value = 0;
                } else {
                    icon.style.display = "none";
                    icon.previousElementSibling.style.display = "block";
                    musicTag.volume = currentVolume;
                    volumeSlider.value = currentVolume;
                }
            })
        })
    }
    function playMusic(musicTag, clickedSvg, seekerFill, musicCurrentTime) {
        musicTag.play();
        clickedSvg.style.display = 'none';
        clickedSvg.nextElementSibling.style.display = 'block';
        let musicTimeHandler = setInterval(() => {
            if (musicTag.paused) {
                clearInterval(musicTimeHandler);
                return;
            }
            seekerFill.style.left = `${-100 + (musicTag.currentTime / musicTag.duration * 100)}%`;
            musicCurrentTime.innerHTML = `${timeFormatHandler(musicTag.currentTime)}`;
        }, 100);
    }
    function pauseMusic(musicTag, clickedSvg) {
        musicTag.pause();
        clickedSvg.style.display = 'none';
        clickedSvg.previousElementSibling.style.display = 'block';
    }
    function seekModalHandler(seekModal, musicTag, event) {
        let userBrowser = browserDetect();
        if (userBrowser === 'firefox') {
            if (event.layerY < 10 || event.layerY > 35 || event.layerX < 7 ||
                event.layerX > event.currentTarget.offsetWidth - 5) {
                seekModal.style.display = 'none';
                return;
            }
            seekModal.style.display = 'block';
            seekModal.style.left = `${event.layerX + 32}px`;
            seekModal.innerHTML = timeFormatHandler(
                ((event.layerX / event.currentTarget.offsetWidth) -
                    0.005).toFixed(2) * musicTag.duration
            ) + '<div id="seekModalArrow"></div>';
        } else {
            if (event.offsetY < 10 || event.offsetY > 35 || event.offsetX < 7 ||
                event.offsetX > 274) {
                seekModal.style.display = 'none';
                return;
            }
            seekModal.style.display = 'block';
            seekModal.style.left = `${event.offsetX + 32}px`;
            seekModal.innerHTML = timeFormatHandler(
                ((event.offsetX / event.currentTarget.offsetWidth) -
                    0.005).toFixed(2) * musicTag.duration
            ) + '<div id="seekModalArrow"></div>';
        }
    }
    function timeFormatHandler(current) {
        let toSeconds, toMinute;
        toMinute = Math.floor(current / 60);
        if (toMinute < 10) {
            toMinute = '0' + toMinute;
        }
        toSeconds = Math.floor(current % 60);
        if (toSeconds < 10) {
            toSeconds = '0' + toSeconds;
        }
        return `${toMinute}:${toSeconds}`;
    }

    function browserDetect() {
        let data = window.navigator.userAgent;

        if (/Edg/i.test(data)) {
            return 'edge';
        } else if (/firefox/i.test(data)) {
            return 'firefox';
        } else if (/opera/i.test(data)) {
            return 'opera';
        } else if (/chrome/i.test(data)) {
            return 'chrome';
        } else if (/safari/i.test(data)) {
            return 'safari';
        }
    }

    setSeasonState();
    if (window.matchMedia("(min-width: 1101px)").matches) {
        setupLargeScreen();
    }
});




/*menuBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (window.matchMedia("(max-width: 1100px)").matches) {
                if (!btnToggle) {
                    btn.classList.add('svgBarAnimate');
                    setTimeout(() => {
                        navBar.style.top = '0';
                        btnToggle = true;
                    }, 10);
                    setTimeout(() => {
                        menuBtns[1].style.display = 'block';
                        btn.classList.remove('svgBarAnimate');
                        btn.style.display = 'none';
                    }, 370)
                } else {
                    btn.classList.add('svgXAnimate');
                    navBar.style.top = '-450px';
                    btnToggle = false;
                    setTimeout(() => {
                        menuBtns[0].style.display = 'block';
                        btn.classList.remove('svgXAnimate');
                        btn.style.display = 'none';
                    }, 350);
                }
            } else {
                // Codes for opening sidebar will go here ...
                if (!btnToggle) {
                    sideBar.style.right = '0';
                    btnToggle = true;
                }
            }
        });
    });*/
/*$.body.addEventListener('click', (e) => {
    if (window.matchMedia('(max-width: 1100px)').matches) {
        if (e.pageY > 545) {
            menuBtns[1].classList.add('svgXAnimate');
            navBar.style.top = '-450px';
            btnToggle = false;
            setTimeout(() => {
                menuBtns[0].style.display = 'block';
                menuBtns[1].classList.remove('svgXAnimate');
                menuBtns[1].style.display = 'none';
            }, 350);
        }
    } else {
        if (e.pageX / window.innerWidth * 100 < 49) {
            sideBar.style.right = '-52%';
            btnToggle = false;
        }
    }
});*/