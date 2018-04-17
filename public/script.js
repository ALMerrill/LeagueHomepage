var app = new Vue({
  el: '#app',
  data: {
    addedName: '',
    // summoners: {},
    summoner: {topChamps: ["", "", ""]},
    uri: 'localhost',
    show: false,
    // logged_in: false,
    token: "",
    username: "",
    password: "",
    email: "",
    name: "",
    user: {},
  },
  created: function() {
    this.getSummoner();
    this.initialize();
  },
  mounted: function() {
    this.getSummoner();
  },
  computed: {
    loggedIn: function(){
      if (this.token === '' || this.token === "")
       return false;
      return true;
    },
  },
  methods: {
    user: function() {
      return this.user;
    },
    setUser: function(user) {
      this.user = user;
    },
    getToken: function() {
      return this.token;
    },
    setToken: function(token) {
      this.token = token;
      if (token === '')
        localStorage.removeItem('token');
      else
        localStorage.setItem('token', token);
    },
    getAuthHeader: function() {
      return {headers: {'Authorization': localStorage.getItem('token'), 'name':this.addedName}};
    },
    getSummoner: function() {
      axios.get("/api/summoner").then(response => {
        this.summoner = response.data;
        // if(response.data.name !== "-1"){
        //   console.log(response.data.name);
        //   this.addSummoner();
        //   this.show = true;
        // }
        return true;
      }).catch(err => {
      });
    },
    addSummoner: function() {
      axios.post("/api/summoner", this.getAuthHeader()).then(response => {
        // name: this.addedName.toLowerCase();
      // }).then(response => {
        console.log("response: " + response);
      // str = JSON.stringify(response.data);
      // str = JSON.stringify(response.data, null, 4); // (Optional) beautiful indented output.
      // console.log(str);
        this.summoner = response.data;
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
        console.log("addSummoner error: " + err);
      });
    },
    login: function() {
      axios.post("/api/login",{username: this.username, password: this.password}).then(response => {
        // this.logged_in = true;
        this.setUser(response.data.user);
        this.setToken(response.data.token);
        // this.username = response.data.user.username;
        // this.password = response.data.user.password;
      }).catch(error => {
        this.setUser({});
        this.setToken('');
        console.log("Login error: " + error);
        return;
      });
    },
    register: function() {
      axios.post("/api/users",{email: this.email, username: this.username, password: this.password, name: this.name, }).then(response => {
        // this.logged_in = true;
        this.setUser(response.data.user);
        this.setToken(response.data.token);
        // context.commit('setUser', response.data.user);
        // context.commit('setLogin',true);
        // context.commit('setRegisterError',"");
        // context.commit('setLoginError',"");
      }).catch(error => {
        this.setToken('');
        this.setUser({});
        console.log("Register error: " + error);
        // context.commit('setLoginError',"");
        // context.commit('setLogin',false);
        // if (error.response) {
        //   if (error.response.status === 403)
        //     context.commit('setRegisterError',"That email address already has an account.");
        //   else if (error.response.status === 409)
        //     context.commit('setRegisterError',"That user name is already taken.");
        return;
        // }
        // context.commit('setRegisterError',"Sorry, your request failed. We will look into it.");
      });
    },
    logout: function() {
      this.setToken('');
    },
    // Initialize //
    initialize(context) {
      let token = localStorage.getItem('token');
      if(token) {
       // see if we can use the token to get my user account
       axios.get("/api/me", this.getAuthHeader()).then(response => {
        this.setToken(token);
        this.setUser(response.data.user);
       }).catch(err => {
         // remove token and user from state
         localStorage.removeItem('token');
         this.setUser({});
         this.setToken('');
       });
      }
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