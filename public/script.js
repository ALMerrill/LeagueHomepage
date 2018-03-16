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
      console.log("getting");
      axios.get("/api/summoner").then(response => {
        this.summoner = response.data;
        console.log("Summoner: " + this.summoner);
        return true;
      }).catch(err => {
      });
    },
    addSummoner: function() {
      console.log("adding");
      axios.post("/api/summoner", {
        name: this.addedName,
      }).then(response => {
        let icon = response.data.icon;
        console.log(response.data.name);
        console.log("1");
        console.log("showing");
        this.show = true;
        elem = document.getElementById('image');
        path = 'img/' + String(icon) + '.png';
        console.log(path);
        if(typeof elem !== 'undefined' && elem !== null) {
          console.log("found");
          document.getElementById('image').src = 'img/' + String(icon) + '.png';
        }
        else
          console.log('not found');
        console.log("2");
        this.addedName = "";
        console.log("getSummoner");
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