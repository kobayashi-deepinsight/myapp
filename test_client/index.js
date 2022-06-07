const SERVER = "http://localhost:3000";
const API_ALBAMLIST = SERVER + "/samples/list";

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
    que: [],
    init() {
        this.player.on(`ended`, () => {
            this.nextSong();
        });
    },
    newQue(_audioUrlList) {
        this.que = _audioUrlList;
        this.nextSong();
    },
    nextSong() {
        if (this.que.length) {
            this.player.attr('src', this.que.shift());
            this.player[0].play();
        }
    },
    startPause() {
        if (this.player[0].paused) {
            this.player[0].play();
        } else {
            this.player[0].pause();
        }
    },

}

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
        <div class="albam" v-on:click="onClick">
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
            audioPlayer.newQue(this.albam.songUrls);
        }
    }
});

// =========== air_control ===========
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
                <input type="range" min="0" max="100" value="50">
            </div>
        </div>
    `,
    props: [`imgSrc`, ],
});

new Vue({
    el: '#app',
    data: {
        view: 2,
        albams: [],
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
});
