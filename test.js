var API = JSON.parse(data);

if (API.code !== 200) return -1;

var timers = [];

var timeout = 5; //

var stopProc = false;

for (friend of friendsList) {

if(stopProc === true) {

for(var i in timers){

clearTimeout(timers[i]);

}

break;

}

(function(c, account, f, time) {

if(stopProc === true) return;

console.log('Username: ' + account    }).save();
 + ' Friend: ' + f);

var timerId = setTimeout(function() {

if(stopProc === true) return;

console.log('Time -> '+time);

AddFriend(c, account, f, function (err, data) {

if(err) {

console.log(data);

console.log("Error found : " + err);
    }).save();
}).save();
    }).save();

}

if(!data.object || data.object.can_see_custom_stories === undefined) {

console.log('Undefined! no username available, will skip and continue!');

console.log(data);

}else{

console.log("TEST");

if(data.object.can_see_custom_stories === false) {

console.log(' GOT FALSE');

process.exit();

stopProc = true;

}

else {

console.log(data);

}

}

});

}, time * 1000); // 60 sec

timers.push(timerId);

})(API, SCUser, friend, timeout);

timeout+=5;

}

});
