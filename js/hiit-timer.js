var count = 0;
var interval_id = null;

var schedule = null;
var schedule_index = null;
var schedule_length = null;

$(document).ready(function() {
	$('#run').click(run);
	$('#stop').click({'now': true}, stop);
	$('#settings-fields > input[type="text"]').blur(clean_input);
});

function run() {
	toggle_buttons();
	build_schedule();
	
	count = delay;
	interval_id = setInterval(tick, 1000);
	
	return false; // Prevent the form from being submitted.
}

function stop(now) {
	clearInterval(interval_id);
	
	if (now == false) {
		setTimeout("stop()", 1000);
		return;
	}
	
	$('#countdown').html(0);
	toggle_buttons();
	
	return false;  // Prevent the form from being submitted.
}

function toggle_buttons() {
	$('#run').toggle();
	$('#stop').toggle();
}

function build_schedule() {
	delay = $('#delay').val();
	warm_up = $('#warm_up').val();
	high = $('#high').val();
	normal = $('#normal').val();
	reps = $('#reps').val();
	cool_down = $('#cool_down').val();
	
	schedule = [delay, warm_up];
	for (reps = reps; reps > 0; reps--) {
		schedule.push(high);
		schedule.push(normal);
	}
	schedule.push(cool_down);
	schedule_index = 0;
	schedule_length = schedule.length;
}

function tick() {
	$('#countdown').html(count);
	count--;
	if (count < 1) {
		schedule_index++;
		if (schedule_index == schedule_length) {
			stop(false);
		} else {
			count = schedule[schedule_index];
		}
	}
}

function clean_input() {
	input = $(this);
	value = input.val();
	
	value = parseInt(value);
	if (isNaN(value)) {
		value = 0;
	}
	
	input.val(value);
}
