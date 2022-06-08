const SERVER = "http://localhost:3000";
const API_ALBAMLIST = SERVER + "/samples/list";

let log = (text) => {
    $("#log").html(text);
}

jQuery.prototype.scrolToCenter = function() {
    var maxScrollLeft = $(this)[0].scrollWidth - $(this)[0].clientWidth;
    var maxScrollTop = $(this)[0].scrollHeight - $(this)[0].clientHeight;
    $(this).scrollLeft(maxScrollLeft / 2);
    $(this).scrollTop(maxScrollTop / 2);
}

// ===========================================================================
// audioPlayer
// ===========================================================================
const audioPlayer = {
    player: $("#player"),
    albam: {},
    index: 0,
    init() {
        this.player.on(`ended`, () => {
            this.nextSong();
        });
    },
    newQue(_albam) {
        this.albam = _albam;
        this.index = 0;
        this.play();
    },
    nextSong() {
        this.index = (this.index + 1) % this.albam.songNames.length;
        this.play();
    },
    prevSong() {
        this.index = (this.index + this.albam.songNames.length - 1) % this.albam.songNames.length;
        this.play();
    },
    play() {
        this.player.attr('src', this.albam.songUrls.at(this.index));
        this.player[0].play();
        var txt = this.albam.name + " - " + this.albam.artist + " : " + this.albam.songNames.at(this.index);
        log(txt);
    },
    startPause() {
        if (this.player[0].paused) {
            this.player[0].play();
            log("audioPlayer: play");
        } else {
            this.player[0].pause();
            log("audioPlayer: pause");
        }
    },
    mute() {
        log("audioPlayer: mute")
        this.player[0].muted = !this.player[0].muted;
        if (this.player[0].muted) {
            $("#mute").addClass("active");
        } else {
            $("#mute").removeClass("active");
        }
    },
    volumeDown() {
        log("audioPlayer: volumeDown")
        this.player[0].muted = false;
        this.player[0].volume -= .2;
    },
    volumeUp() {
        log("audioPlayer: volumeUp")
        this.player[0].muted = false;
        this.player[0].volume += .2;
    },
}

// ============ audio_con ==============
Vue.component('audio_con', {
    template: `
        <div id="audio_con">
            <img id="start_pause" src="./images/controller/start_pause.png" @click=start_pause>
            <img id="mute" src="./images/controller/mute.png" @click=mute>
            <img id="next" src="./images/controller/next.png" @click=next>
            <img id="prev" src="./images/controller/prev.png" @click=prev>
        </div>
    `,
    props: {},
    methods: {
        start_pause: function(event) {
            audioPlayer.startPause();
        },
        mute: function(event) {
            audioPlayer.mute();
        },
        next: function(event) {
            audioPlayer.nextSong();
        },
        prev: function(event) {
            audioPlayer.prevSong();
        },
    }
});

// ===========================================================================
// mapControl
// ===========================================================================
const mapControl = {
    init() {
        $("#map").on("click", function() {
            $(this).scrolToCenter();
        });

    },
    center() {
        $("#map").scrolToCenter();
    }
}


// ===========================================================================
// three
// ===========================================================================
import * as THREE from './lib/three.js/three.module.js';
import { OrbitControls } from './lib/three.js/OrbitControls.js';
import { GLTFLoader } from './lib/three.js/GLTFLoader.js';

let perpCamera, renderer, mesh, scene, controls;

const three = {
    init() {
        var $container = $("#three_div");
        var render = function render() {
            renderer.clear();
            renderer.render(scene, perpCamera);
        };
        // scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x404040);

        // カメラ
        perpCamera = new THREE.PerspectiveCamera(45, $container.width() / $container.height(), 1, 2000);
        perpCamera.position.set(0, 300, 0);
        perpCamera.lookAt(new THREE.Vector3(0, 0, 0));
        scene.add(perpCamera);

        // ライト
        const pointLight = new THREE.PointLight(0xffffff, 1);
        perpCamera.add(pointLight);
        const light = new THREE.HemisphereLight(0x888888, 0x532333, 1.2);
        perpCamera.add(light);

        // モデル
        var loader = new GLTFLoader().setPath('./images/');
        loader.load('sedan.glb', function(gltf) {
            scene.add(gltf.scene);
            render();
        });

        // renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize($container.width(), $container.height());
        $container.append(renderer.domElement);

        // リサイズされたとき
        var that = this;
        $(window).on("resize", function() {
            that.resize();;
        });

        // OrbitControls
        controls = new OrbitControls(perpCamera, renderer.domElement);
        controls.addEventListener('change', render);
        controls.minDistance = 3;
        controls.maxDistance = 8;
        controls.update();

        render();
    },
    render() {
        renderer.clear();
        renderer.render(scene, perpCamera);
    },
    resize() {
        var $container = $("#three_div");
        perpCamera.aspect = $container.width() / $container.height();
        perpCamera.updateProjectionMatrix();
        renderer.setSize($container.width(), $container.height());
        this.render();
    }
}

// ========== albams ============
Vue.component('albams', {
    template: `
        <div class="albam" @click="onClick">
            <img v-bind:src=albam.artwork>
            <p>{{ albam.name }}</p>
            <p>{{ albam.artist }}</p>
        </div>
    `,
    props: [`albam`, 'playing'],
    methods: {
        onClick: function(event) {
            $(".albam").removeClass("playing");
            $(event.target).addClass("playing");
            audioPlayer.newQue(this.albam);
        }
    }
});

// =========== hslider ===========
Vue.component('hslider', {
    template: `
        <div class="hslider">
            <img :src=imgSrc />
            <div>
                <ul>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
                <input type="range" @change="onChange" min="0" max="100" value="50">
            </div>
        </div>
    `,
    props: [`imgSrc`, `name`, ],
    methods: {
        onChange: function(event) {
            log(this.name + ": " + $(event.target).val());
        }
    }
});


// =========== toggle ===========
Vue.component('toggle', {
    template: `
        <div class="toggle btn3" @click="onClick">
            <img :src=imgSrc />
            <div class="lamp" :class="{active:isActive}"></div>
        </div>
    `,
    props: {
        imgSrc: String,
        btnName: String,
        isActive: Boolean,
    },
    methods: {
        onClick: function(event) {
            this.isActive = !this.isActive;
            log(this.btnName + ": " + this.isActive);
        }
    }
});

const app = new Vue({
    el: '#app',
    data: {
        view: 1,
        albams: [],
        controllerEnable: false
    },
    mounted() {
        fetch(API_ALBAMLIST)
            .then(response => {
                return response.json();
            })
            .then(json => {
                this.albams = json;
            });
    },
    methods: {},
    watch: {
        view: function() {
            if (3 == this.view) {
                this.$nextTick(function() {
                    three.resize();
                });
            }
            if (4 == this.view) {
                this.$nextTick(function() {
                    mapControl.center();
                });
            }
        }
    },
});


// on DOM readed
$(() => {
    audioPlayer.init();
    mapControl.init();
    three.init();


    let uv1stack = [-1, -1, -1, -1, -1, -1];
    $(document).on("mousemove", (event) => {
        var x = event.pageX;
        var y = event.pageY;
        var elems = document.elementsFromPoint(x, y);
        elems.forEach((elem) => {
            elem = $(elem);
            if (elem.hasClass("uv_1")) {
                var v = parseInt(elem.attr("value"));
                if (uv1stack.at(-1) != v) {
                    uv1stack.shift();
                    uv1stack.push(v);

                    // 時計回りに行ってたら
                    var next = (uv1stack.at(0) + 1) % 4;
                    var flag = true;
                    for (let i = 1; i < uv1stack.length; i++) {
                        if (next == uv1stack.at(i)) {
                            next = (uv1stack.at(i) + 1) % 4;
                        } else {
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        audioPlayer.volumeUp();
                        uv1stack = [-1, -1, -1, -1, -1, -1];
                    }

                    // 反時計回りに行ってたら
                    // 0 -> 3 -> 2 -> 1 -> 0 ...
                    var next = (uv1stack.at(0) + 3) % 4;
                    var flag = true;
                    for (let i = 1; i < uv1stack.length; i++) {
                        if (next == uv1stack.at(i)) {
                            next = (uv1stack.at(i) + 3) % 4;
                        } else {
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        audioPlayer.volumeDown();
                        uv1stack = [-1, -1, -1, -1, -1, -1];
                    }
                }
            }
        });
    });

    // $(".uv_2").on("mousedown", (event) => {

    // #### マウス用のダミー ####
    $(document).on("mousedown", (event) => {
        if (3 == event.which) {
            var x = event.pageX;
            var y = event.pageY;
            var elems = document.elementsFromPoint(x, y);
            elems.forEach((elem) => {
                if ($(elem).hasClass("uv_2")) {
                    app.controllerEnable = true;
                    $(".uv_2")
                }
            });
        }
    });

    $(document).on("mouseup", function() {
        $("#audio_con img:hover").trigger("click");
        app.controllerEnable = false;
    });
    // #########################
});
