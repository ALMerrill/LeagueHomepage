var app = new Vue({
  el: '#app',
  data: {
    addedName: '',
    // summoners: {},
    summoner: {},
    uri: 'localhost',
    show: false,
  },
  created: function() {
    this.getSummoner();
  },
  methods: {
    getSummoner: function() {
      axios.get("/api/summoner").then(response => {
        this.summoner = response.data;
        return true;
      }).catch(err => {
      });
    },
    addSummoner: function() {
      axios.post("/api/summoner", {
        name: this.addedName,
      }).then(response => {
        let icon = response.data.icon;
        this.show = true;
        elem = document.getElementById('image');
        path = 'img/' + String(icon) + '.png';
        if(typeof elem !== 'undefined' && elem !== null) {
          document.getElementById('image').src = 'img/' + String(icon) + '.png';
        }
        this.addedName = "";
        this.getSummoner();
        return true;
      }).catch(err => {
      });
    },
    // deleteSummoner: function(summoner) {
    //   axios.delete("http://" + this.uri + ":3000/api/summoner/" + summoner.id).then(response => {
    //     this.getSummoner();
    //     return true;
    //   }).catch(err => {
    //   });
    // }
  }
});

//http://" + this.uri + ":3030