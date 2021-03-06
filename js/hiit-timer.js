'use strict';

var count = 0;
var interval_id = null;

var schedule = null;
var schedule_index = null;

var beep = new buzz.sound('/audio/beep', {formats: ['ogg', 'mp3']});
var high_beeps = new buzz.sound('/audio/high', {formats: ['ogg', 'mp3']});
var normal_beeps = new buzz.sound('/audio/normal', {formats: ['ogg', 'mp3']});

$(document).ready(function () {
	$('#start').click(start);
	$('#stop').click(stop);
	
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
	var delay = $('#delay_field').val();
	var warm_up = $('#warm_up_field').val();
	var high = $('#high_field').val();
	var normal = $('#normal_field').val();
	var reps = $('#reps_field').val();
	var cool_down = $('#cool_down_field').val();
	
	schedule = [];
	if (delay > 0) {
		schedule.push(
			{
				'title': 'Get ready',
				'css_class': 'delay',
				'seconds': delay,
				'start_sound': null
			}
		);
	}
	if (warm_up > 0) {
		schedule.push(
			{
				'title': 'Warm up',
				'css_class': 'warmup',
				'seconds': warm_up,
				'start_sound': null
			}
		);
	}
	for (var rep = reps; rep > 0; rep--) {
		if (high > 0) {
			schedule.push(
				{
					'title': 'High intensity',
					'css_class': 'high',
					'seconds': high,
					'start_sound': high_beeps
				}
			);
		}
		if (normal > 0) {
			schedule.push(
				{
					'title': 'Normal intensity',
					'css_class': 'normal',
					'seconds': normal,
					'start_sound': normal_beeps
				}
			);
		}
	}
	if (cool_down > 0) {
		schedule.push(
			{
				'title': 'Cool down',
				'css_class': 'cooldown',
				'seconds': cool_down,
				'start_sound': null
			}
		);
	}
	
	schedule_index = 0;
}

function tick() {
	count--;
	
	if (count === 0) {
		schedule_index++;
		$('#countdown-area').removeClass();
		
		if (schedule_index === schedule.length) {
			stop();
		} else {
			count = schedule[schedule_index].seconds;
			$('#countdown-area').addClass(schedule[schedule_index].css_class);
			$('#section-title').html(schedule[schedule_index].title);
			
			if (schedule[schedule_index].start_sound) {
				schedule[schedule_index].start_sound.play();
			}
		}
	} else if (count < 11) {
		beep.play();
	}
	$('#countdown').html(count);
}

function clean_input(event) {
	var field = $(event.currentTarget);
	var value = field.val();
	
	value = parseInt(value, 10);
	if (isNaN(value)) {
		value = 0;
	}
	
	field.val(value);
}
