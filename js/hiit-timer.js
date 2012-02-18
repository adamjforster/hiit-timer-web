var count = 0;
var interval_id = null;

var schedule = null;
var schedule_index = null;

$(document).ready(function () {
	$('#start').click(start);
	$('#stop').click({'now': true}, stop);
	
	$('#settings-fields > input[type="text"]').blur(clean_input);
	$('#settings-fields').tooltip({selector: "a[class=help-tooltip]"});
});

function start() {
	toggle_buttons();
	build_schedule();
	
	count = schedule[0].seconds;
	$('#section-title').html(schedule[0].title);
	$('#countdown').html(count);
	interval_id = setInterval(tick, 1000);
}

function stop() {
	clearInterval(interval_id);
	
	$('#countdown-area').removeClass();
	$('#section-title').html('Done');
	$('#countdown').html(0);
	toggle_buttons();
}

function toggle_buttons() {
	$('#start').toggle();
	$('#stop').toggle();
}

function build_schedule() {
	delay = $('#delay').val();
	warm_up = $('#warm_up').val();
	high = $('#high').val();
	normal = $('#normal').val();
	reps = $('#reps').val();
	cool_down = $('#cool_down').val();
	
	schedule = [];
	if (delay > 0) {
	    schedule.push(
		    {'title': 'Get ready', 'css_class': 'delay', 'seconds': delay}
		);
	}
	if (warm_up > 0) {
		schedule.push(
		    {'title': 'Warm up', 'css_class': 'warmup', 'seconds': warm_up}
		);
	}
	for (reps = reps; reps > 0; reps--) {
		if (high > 0) {
			schedule.push(
			    {'title': 'High intensity', 'css_class': 'high', 'seconds': high}
			);
		}
		if (normal > 0) {
			schedule.push(
		        {'title': 'Normal intensity', 'css_class': 'normal', 'seconds': normal}
		    );
		}
	}
	if (cool_down > 0) {
		schedule.push(
		    {'title': 'Cool down', 'css_class': 'cooldown', 'seconds': cool_down}
		);
	}
	
	schedule_index = 0;
}

function tick() {
	if (--count == 0) {
		schedule_index++;
		$('#countdown-area').removeClass();
		
		if (schedule_index == schedule.length) {
			stop();
		} else {
			count = schedule[schedule_index].seconds;
			$('#countdown-area').addClass(schedule[schedule_index].css_class);
			$('#section-title').html(schedule[schedule_index].title);
		}
	}
	$('#countdown').html(count);
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
