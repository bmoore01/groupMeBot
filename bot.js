var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;

var yesVotes = 0;
var noVotes = 0;
var congrats = 0;
var voted = [];
var pollSubject;

function printPenis() {
	postMessage("8====D");
}

//function voteYes() {
//		yesVotes++;
//}

//function voteNo() {
//		noVotes++;
//}

function good() {
		congrats++;
}

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\/cool guy$/;

  var vote = JSON.parse(this.req.chunks[0]), voteRegex = /^\/poll start .*$/;
  var voteYes = JSON.parse(this.req.chunks[0]), voteYesRegex = /^\/poll yes$/;
  var voteNo = JSON.parse(this.req.chunks[0]), voteNoRegex = /^\/poll no$/;
  var voteResult = JSON.parse(this.req.chunks[0]), voteResultRegex = /^\/poll results$/;
		
  var help = JSON.parse(this.req.chunks[0]), helpRegex = /^\/help$/;
  var goodBoy  = JSON.parse(this.req.chunks[0]), goodBoyRegex = /^\/good (boy|girl|bot)$/;
  //var unknown  = JSON.parse(this.req.chunks[0]), unknownRegex = /^\/.*$/;
  var dice  = JSON.parse(this.req.chunks[0]), diceRegex = /^\/roll$/;
  var hello  = JSON.parse(this.req.chunks[0]), helloRegex = /^\/hello$/;
  var msgData = JSON.parse(this.req.chunks[0]);
  startPollRegex = /^\/poll start (.*)$/;
  console.log(msgData);
			

  if(request.text && botRegex.test(request.text)) {
    this.res.writeHead(200);
    postMessage();
    this.res.end();
  } else if(vote.text && voteRegex.test(vote.text)) {
	this.res.writeHead(200);
    voted = [];
  	match = startPollRegex.exec(msgData.text);
    pollSubject = msgData.text.substring(6);
	var startStr = "@" + msgData.name + " has started a poll, the subject of the poll is " + msgData.text.substring(11) ;
	postMessage(startStr);
    yesVotes = 0;
    noVotes = 0;
	this.res.end();
  } else if(voteYes.text && voteYesRegex.test(voteYes.text)) {
	this.res.writeHead(200);
	var yesMsg = "You have voted yes @" + msgData.name + " to the question " + pollSubject;
	var hasVoted = false;
	for(var i = 0;i < voted.length;i++) {
			if(voted[i] === msgData.sender_id) {
					hasVoted = true;
			}
	}
    if(!hasVoted) {					
		yesVotes += 1;
    	voted.push(msgData.sender_id);
 		postMessage(yesMsg);
		this.res.end();
	} else {
			var text = "You have already voted @" + msgData.name + " you can't break the system"
			postMessage(text);
			this.res.end();
	}
  } else if(voteNo.text && voteNoRegex.test(voteNo.text)) {
	this.res.writeHead(200);
	var hasVoted = false;
    for(var i = 0; i < voted.length;i++) {
			if(voted[i] === msgData.sender_id) {
					hasVoted = true;
			}
	}
    if(!hasVoted) {
		noVotes += 1;
		var test = "You have voted no @" + msgData.name;
		postMessage(test);
		this.res.end();
	} else {
			var test = "You have already voted @" + msgData.name + " dont be trying to break the system";
			postMessage(test);
			this.res.end();
	}
  } else if(voteResult.text && voteResultRegex.test(voteResult.text)) {
	this.res.writeHead(200);
	var resStr = "The current poll is " + pollSubject;
 	if (yesVotes == 12) {
			resStr += "\nThe vote is unanimous, reason will previal!"; 
	} else if (noVotes == 12) {
			resStr += "\nOkay it looks like nobody likes this";
	} else {
			var resultString = "\nThe results as it stand are\n Yes votes: " + yesVotes.toString() + "\n No votes: " + noVotes.toString() + "\n silly humans and their indeciciveness"
			resStr += resultString;
	}
	postMessage(resStr);
	this.res.end();
  } else if(dice.text && diceRegex.test(dice.text)) {
		  this.res.writeHead(200);
		  var num = Math.floor(Math.random() * 6) + 1
		  var diceString = "You have rolled a " + num.toString()
		  postMessage(diceString);
		  this.res.end();
  } else if(hello.text && helloRegex.test(hello.text)) {
		  this.res.writeHead(200);
		  var msg = "hello @" + msgData.name;
		  postMessage(msg);
		  this.res.end();
  } else if(help.text && helpRegex.test(help.text)) {
		  this.res.writeHead(200);
		  var helpString = "Hi there, I'm BenJr, My commands are\n /poll start <poll question here>: to start a vote\n/poll yes: to vote yes on a poll\n/poll no: to vote no on a poll\n/poll result: to view the results on a current poll\n /cool guy: makes me do a funny face\n/good boy: Tell me I'm a good boy!\n/hello: say hello to me\n/roll: roll a D6"
		  postMessage(helpString);
		  this.res.end();
  } else if(goodBoy.text && goodBoyRegex.test(goodBoy.text)) {
		  this.res.writeHead(200);
		  if(msgData.sender_id === '43687345') {
				  var goodString = "Thanks Daddy!";
		  } else {
		  good();
		  var goodString = "Thanks, I try my best but I'm only a simple bot and sometimes I make mistakes. If I do blame Ben, he's my father and I love him I have been told I'm a good boy " + congrats +  " ";
		  if(congrats == 1) {
				  goodString += "time since I've been restarted";
		  } else {
				  goodString += " times since I've been restarted, I must be doing well!"
		  }
		  }
		  postMessage(goodString);
		  this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage(botResponse) {
  var botResponse, options, body, botReq;

  if(botResponse == null) {
  	botResponse = cool();
  }

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;
