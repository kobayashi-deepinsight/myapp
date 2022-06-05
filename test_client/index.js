const SERVER = "http://localhost:3000";
const API_ALBAMLIST = SERVER + "/samples/list";

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
audioPlayer.init();

Vue.component('albam-template', {
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


var app = new Vue({
    el: '#app',
    data: {
        view: 1,
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
});
