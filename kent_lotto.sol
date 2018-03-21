pragma solidity ^0.4.16;
/// @title Voting with delegation.
contract KentLotto {
    address public owner;
    uint8 constant public NumberOfBetPerPlayer  = 4;
    uint8 constant public MaxNumberOfBets       = 10;
    /// fee charge player per bet
   // uint constant public  FeePerBet         = 10 finney;
    uint constant public  PrizeAmount       = 100 finney;
    uint8 constant public BetRange          = 10;

    uint8 public winningNumber;
    uint8 public numberofBets;

    struct Player{
        address sender;
        uint8 numberofBets;
        mapping(uint8 => uint8) pickedNumbers;
    }

    mapping(address => Player) players;
    address[] playerAddresses;
    mapping(uint8 => uint8) pickedNumbers;

    function KentLotto() public payable{
       owner = msg.sender ;
    }

    function pickedNumber(uint8 _numbber) public payable{
        require(_numbber > 0 && _numbber <= BetRange);
        require(msg.sender != owner);
        require(numberofBets < MaxNumberOfBets);
        Player storage p = players[msg.sender];
        require(p.numberofBets < NumberOfBetPerPlayer);

        if(p.numberofBets == 0){
            playerAddresses.push(msg.sender);
        }
        p.sender = msg.sender;
        p.numberofBets += 1;
        p.pickedNumbers[_numbber] += 1;
      //  uint fee = FeePerBet*1000000000000000;

      //  msg.sender.transfer(fee);
        numberofBets += 1;
        pickedNumbers[_numbber] += 1;
    }

    function setWinners() public payable{
        require(owner == msg.sender);
        require(numberofBets == MaxNumberOfBets);

        winningNumber = findWinningNumber();
        if(pickedNumbers[winningNumber] < 1){
            return;
        }
        distriputePrize(winningNumber);
    }

    function distriputePrize(uint8 _winningNumber) public payable{
        assert(pickedNumbers[_winningNumber] != 0);
        uint _prizeAmount = PrizeAmount/pickedNumbers[_winningNumber];
        for(uint8 i = 0; i < playerAddresses.length; i++){
           if(playerAddresses[i] != address(0)){
               Player storage p = players[playerAddresses[i]];
               if(p.pickedNumbers[_winningNumber] > 0){
                p.sender.transfer(_prizeAmount * p.pickedNumbers[_winningNumber]);
               }

           }
        }
    }

    function findWinningNumber() private view returns (uint8){
        return uint8(uint256(keccak256(block.timestamp, block.difficulty)) % 10 + 1);
    }
}