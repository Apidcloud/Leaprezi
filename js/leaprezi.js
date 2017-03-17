
var player = new PreziPlayer('prezi-player', {
	preziId: 'hp08thgs3ifs',
	width: 620,
	height: 444,
	explorable: false,
	controls: true
});

// when prezi step changes, set the active link accordingly
player.on(PreziPlayer.EVENT_CURRENT_STEP, function(e) {
	$('#sidebar-nav li').removeClass('active');
	$("#sidebar-nav li a[href='#"+e.value+"']").parent().addClass('active');
});

// flies to the corresponding prezi step when one of the links is clicked
$('#sidebar-nav li a').on('click', function(e){
	e.preventDefault();
	player.flyToStep(this.href.match('#(.*)$')[1]);
	$('#sidebar-nav li').removeClass('active');
	$(this).parent().addClass('active');
});

var LastSwipe = new Date();

var leapInfo = this.leapInfo = document.getElementById('leapinfo');
isServerConnected = false;
var lb = this.leapBridge = {
	isConnected: true
};

function updateInfo()
{
	if(!isServerConnected)
	{
		leapInfo.innerHTML = 'Waiting for the Leap Motion Controller server...'
		leapInfo.style.display = 'block';
	}
	else if(lb.isConnected)
	{
		leapInfo.style.display = 'none';
	}
	else if(!lb.isConnected)
	{
		leapInfo.innerHTML = 'Please connect your Leap Motion Controller if you want to use it.'
		leapInfo.style.display = 'block';
	}
}

updateInfo();

var lc = this.leapController =  new Leap.Controller({enableGestures: false});
lc.connect();

lc.on('connect', function()
{
	isServerConnected = true;
	updateInfo();
});

lc.on('deviceConnected', function()
{
	lb.isConnected = true;
	updateInfo();
});

lc.on('deviceDisconnected', function()
{
	lb.isConnected = false;
	updateInfo();
});

lc.on('frame', onFrame);
function onFrame(frame)
{
	//console.log("Frame event for frame " + frame.id);

    if(!lb.isConnected || !frame.valid) return;

  	// Retrieves first hand - no need to get it by ID, since we're not fetching hand based time behaviour
  	if (frame.hands.length > 0) {

  		hand = frame.hands[0];

    	if (canDoGesture() && ExtendedFingersCount(hand) > 2) {

    		// retrieve velocity X
    		var velocityX = hand.palmVelocity[0];

    		// palmNormal[0] = roll
			if (velocityX > 1000 && hand.palmNormal[0] > 0.2)
            {
            	console.log("left to right");
                LastSwipe = new Date();
                player.flyToPreviousStep();
            }
            else if (velocityX < -1000 && hand.palmNormal[0] < -0.2)
            {
            	console.log("right to left");
                LastSwipe = new Date();
                player.flyToNextStep();
            }
    	}
  	}
}

function canDoGesture()
{
	var now = new Date();
	var diff = now.getTime() - LastSwipe.getTime();

	var days = Math.floor(diff / (1000 * 60 * 60 * 24));
	diff -=  days * (1000 * 60 * 60 * 24);

	var hours = Math.floor(diff / (1000 * 60 * 60));
	diff -= hours * (1000 * 60 * 60);

	var mins = Math.floor(diff / (1000 * 60));
	diff -= mins * (1000 * 60);

	var seconds = Math.floor(diff / (1000));
	diff -= seconds * (1000);

	if (days > 0 || hours > 0 || mins > 0 || seconds > 1) {
		return true;
	}

	return false;
}

function ExtendedFingersCount(hand)
{
	var count = 0;
	hand.fingers.forEach(function(finger){
	    if (finger.extended) {
	    	count++;
	    };
	});
	return count;
}


		