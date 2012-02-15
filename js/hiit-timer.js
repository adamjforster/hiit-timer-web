var count = 0;
var interval_id = null;

var schedule = null;
var schedule_index = null;
var schedule_length = null;

$(document).ready(function() {
	$('#run').click(run);
});

function run() {
	build_schedule();
	
	count = delay;
	interval_id = setInterval(tick, 1000);
	
	return false; // Prevent the form from being submitted.
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
	if (count == 0) {
		schedule_index++;
		if (schedule_index == schedule_length) {
			clearInterval(interval_id);
			setTimeout("$('#countdown').html(0)", 1000);
		} else {
			count = schedule[schedule_index];
		}
	}
}
