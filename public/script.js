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
      axios.get("http://" + this.uri + ":3000/api/summoner").then(response => {
        this.summoner = response.data;
        return true;
      }).catch(err => {
      });
    },
    addSummoner: function() {
      axios.post("http://" + this.uri + ":3000/api/summoner", {
        name: this.addedName,
      }).then(response => {
        let icon = response.data.icon;
        document.getElementById('image').src = 'img/' + String(icon) + '.png';
        document.getElementById('image').src;
        this.addedName = "";
        this.getSummoner();
        this.show = true;
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