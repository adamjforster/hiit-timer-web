'use strict';

var count = 0;
var interval_id = null;

var schedule = null;
var schedule_index = null;

$(document).ready(function () {
	$('#save-modal').modal({'show': false});
	$('#workout-save-btn').click(save_workout);
	update_workout_list();
	
	$('#start').click(start);
	$('#stop').click(stop);
	$('#save-workout').click(display_save_modal);
	
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

function get_form_values() {
	return {
		'delay': $('#delay_field').val(),
		'warm_up': $('#warm_up_field').val(),
		'high': $('#high_field').val(),
		'normal': $('#normal_field').val(),
		'reps': $('#reps_field').val(),
		'cool_down': $('#cool_down_field').val()
	};
}

function build_schedule() {
	var settings = get_form_values();
	
	schedule = [];
	if (settings.delay > 0) {
		schedule.push(
			{'title': 'Get ready', 'css_class': 'delay', 'seconds': settings.delay}
		);
	}
	if (settings.warm_up > 0) {
		schedule.push(
            {'title': 'Warm up', 'css_class': 'warmup', 'seconds': settings.warm_up}
		);
	}
	for (var rep = settings.reps; rep > 0; rep--) {
		if (settings.high > 0) {
			schedule.push(
                {'title': 'High intensity', 'css_class': 'high', 'seconds': settings.high}
			);
		}
		if (settings.normal > 0) {
			schedule.push(
                {'title': 'Normal intensity', 'css_class': 'normal', 'seconds': settings.normal}
            );
		}
	}
	if (settings.cool_down > 0) {
		schedule.push(
            {'title': 'Cool down', 'css_class': 'cooldown', 'seconds': settings.cool_down}
		);
	}
	
	schedule_index = 0;
}

function tick() {
	if (--count === 0) {
		schedule_index++;
		$('#countdown-area').removeClass();
		
		if (schedule_index === schedule.length) {
			stop();
		} else {
			count = schedule[schedule_index].seconds;
			$('#countdown-area').addClass(schedule[schedule_index].css_class);
			$('#section-title').html(schedule[schedule_index].title);
		}
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

function display_save_modal() {
	$('.dropdown-toggle').dropdown();
	
	$('#workout-name').val('');
	$('#save-modal').modal('show');
}

function save_workout() {
	var settings = get_form_values();
	var name = $('#workout-name').val();
	var workouts = localStorage.getItem('workouts');
	
	if (workouts) {
		workouts = JSON.parse(workouts);
	} else {
		workouts = {};
	}
	
	workouts[name] = settings;
	localStorage.setItem('workouts', JSON.stringify(workouts));
	
	$('#save-modal').modal('hide');
	update_workout_list();
}

function update_workout_list() {
	var html = '';
	var workouts = JSON.parse(localStorage.getItem('workouts'));
	
	if (workouts) {
		for (var workout in workouts) {
			html += '<li><a>' + workout + '</a></li>';
		}
	}
	
	$('#workout-list').html(html);
}
