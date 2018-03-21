var app = new Vue({
  el: '#app',
  data: {
    contractNo: '0xf12b5dd4ead5f743c6baa640b0216200e89b60da',
    contractMeta:[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"playerAddresses","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"winningNumber","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"BetRange","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_numbber","type":"uint8"}],"name":"pickedNumber","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"numberofBets","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"numberOfPlayers","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PrizeAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"setWinners","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"NumberOfBetPerPlayer","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MaxNumberOfBets","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"players","outputs":[{"name":"sender","type":"address"},{"name":"numberofBets","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getPlayer","outputs":[{"name":"sender_","type":"address"},{"name":"numberofBets_","type":"int8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_winningNumber","type":"uint8"}],"name":"distriputePrize","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint8"}],"name":"pickedNumbers","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":true,"stateMutability":"payable","type":"constructor"}],
    clientAccountIndex: 2,
    players: [{player: '', voteCount: ''}],
    pickedNumber: 2
  },
  mounted: function(){
    this.loadPlayers();
  },
  computed: {
    owner: function(){
      return this.contract.owner.call().toString();
    },
    winningNumber: function(){
      return this.contract.winningNumber.call().toString();
    },
    web3: function () {
      return new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    },
    contract: function () {
      var LottoContract = this.web3.eth.contract(this.contractMeta);
      return LottoContract.at(this.contractNo);
    }
  },
  methods: {
    loadPlayers: function(){
      var numberOfPlayers = parseInt(this.contract.numberOfPlayers.call().toString())
      this.players = [];
      for(var i = 0; i < numberOfPlayers; i++){
        var ret = this.contract.getPlayer(i);
        this.players.push({player: ret[0], betCount: ret[1].toString()});
      }
    },
    pickNumber: function(){
      var me = this;
      this.contract.pickedNumber(this.pickedNumber, {
        from: this.web3.eth.accounts[this.clientAccountIndex],
        gas: 1000000,
        value: 100000
      },
        function(err, res){
          me.loadPlayers()
        }
      )
    }
  }
})



