var app = new Vue({
  el: '#app',
  data: {
    addedName: '',
    summoners: {},
    sommoner: {},
    uri: 'localhost',
  },
  created: function() {
    this.getSummoners();
  },
  methods: {
    getSummoners: function() {
      axios.get("http://" + this.uri + ":3000/api/summoners").then(response => {
        this.summoners = response.data;
        return true;
      }).catch(err => {
      });
    },
    addSummoner: function() {
      axios.post("http://" + this.uri + ":3000/api/summoners", {
        name: this.addedName,
      }).then(response => {
        console.log(response.data);
        this.addedName = "";
        this.getSummoners();
        return true;
      }).catch(err => {
      });
    },
    deleteSummoner: function(summoner) {
      axios.delete("http://" + this.uri + ":3000/api/summoners/" + summoner.id).then(response => {
        this.getSummoners();
        return true;
      }).catch(err => {
      });
    }
  }
});