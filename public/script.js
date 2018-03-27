var app = new Vue({
  el: '#app',
  data: {
    addedName: '',
    // summoners: {},
    summoner: {topChamps: ["", "", ""]},
    uri: 'localhost',
    show: false,
  },
  created: function() {
    this.getSummoner();
  },
  mounted: function() {
    this.getSummoner();
  },
  methods: {
    getSummoner: function() {
      axios.get("/api/summoner").then(response => {
        // if(response.data.name != "-1"){
        //   console.log(response.data.name);
        //   this.summoner = response.data;
        //   this.show = true;
        // }
        this.summoner = response.data;
        return true;
      }).catch(err => {
      });
    },
    addSummoner: function() {
      axios.post("/api/summoner", {
        name: this.addedName,
      }).then(response => {
        this.summoner = response.data;
        console.log(this.summoner);
        let icon = response.data.icon;
        this.show = true;
        summIcon = document.getElementById('image');
        path = 'img/' + String(icon) + '.png';
        if(typeof summIcon !== 'undefined' && summIcon !== null) {
          // document.getElementById('image').src = 'img/' + String(icon) + '.png';
          summIcon.src = "http://ddragon.leagueoflegends.com/cdn/6.24.1/img/profileicon/" + String(icon) + ".png";
        }
        champImage1 = document.getElementById('champImage1');
        if(typeof champImage1 !== 'undefined' && champImage1 !== null) {
          champImage1.src = "http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/" + this.summoner.topChamps[0] + ".png"
        }
        else
          console.log("1 not found");
        champImage2 = document.getElementById('champImage2');
        if(typeof champImage2 !== 'undefined' && champImage2 !== null) {
          champImage2.src = "http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/" + this.summoner.topChamps[1] + ".png"
        }
        champImage3 = document.getElementById('champImage3');
        if(typeof champImage3 !== 'undefined' && champImage3 !== null) {
          champImage3.src = "http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/" + this.summoner.topChamps[2] + ".png"
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