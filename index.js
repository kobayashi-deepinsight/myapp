const SERVER = "http://localhost:3000";
const API_ALBAMLIST = SERVER + "/samples/list";
const player = document.getElementById("player");

Vue.component('albam-template', {
    template: `
        <div class="albam" v-on:click="popup">
            <img v-bind:src=albam.artwork>
            <p>{{ albam.name }}</p>
            <p>{{ albam.artist }}</p>
        </div>
    `,
    props: [`albam`, 'playing'],
    // `methods` オブジェクトの下にメソッドを定義する
    methods: {
        popup: function(event) {
            $(".albam").removeClass("playing");
            $(event.target).addClass("playing");
            songUrls = this.albam.songUrls;
            songUrls.forEach(songUrl => {
                // console.log(songUrl);
            });;
            player.setAttribute('src', songUrls[0]);

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
