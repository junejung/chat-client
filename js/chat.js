var returnUpdateTime = function() {
	$.ajax({
		type: 'GET',
		url: 'https://api.parse.com/1/classes/messages?limit=1&order=-createdAt',
	  beforeSend: headerSetter,
	  contentType: 'application/json',
	  success: function(data){
	  	lastUpdated = data.results[0]['createdAt'];
	  }
	});
}

var postData = function() {
	var data = {};
	data.username = $("#messageUsername").val();
	data.text = $("#messageText").val();
	postMessage(JSON.stringify(data));
}

var submitListener = function() {
   $("#messageText").bind("keypress", function(e) {
      if (e.keyCode === (13 || 36 || 76)) { // Check ALL the return keys
        e.preventDefault();
        postData();
        $('#messageText').val('');
      }
   });

	$("#messageSubmit").click(function(e){
		e.preventDefault();
		if (!$('#messageUsername').val() || !$('#messageText').val()) {
			return alert("Both username and data are required.");
		}
		postData();
	})
};

var postMessage = function(data) {
	$.ajax({
		type: 'POST',
		url: 'https://api.parse.com/1/classes/messages',
	  beforeSend: headerSetter,
	  contentType: 'application/json',
	  data: data,
	  success: function(){
	    console.log("Successfully posted message")
	  },
	  error: function(){
	  	console.log("Failed to post message");
	  }
	});
};

var getMessages = function() {
	$.ajax({
		type: 'GET',
		url: 'https://api.parse.com/1/classes/messages?limit=10&order=-createdAt',
	  beforeSend: headerSetter,
	  contentType: 'application/json',
	  success: function(data){
	  	_.each(data.results.reverse(), function(val){
	  		if (val.createdAt > lastUpdated) {
		  		$("#main").append("<span class='username'>" + val.username + "</span><span class='time'> (" + moment().local(val.createdAt).format("h:mm:ss a") + ")</span> : <span class='message'>" + val.text + "</span><br />");
		  		lastUpdated = val.createdAt;
		  		scrollBottom();
	  		}
	    });
	  }
	});
};

var scrollBottom = function() {
  $('#main').scrollTop(100000000000000000);
}



$(document).ready(function() {
	// Save chatroom join time at first join
	var lastUpdated;
	returnUpdateTime();
	setInterval(function(){ getMessages(); }, 1000)
	submitListener();
});