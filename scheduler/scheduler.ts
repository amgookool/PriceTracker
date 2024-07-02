import { ToadScheduler, SimpleIntervalJob, AsyncTask } from 'toad-scheduler';
import type { SimpleIntervalSchedule } from 'toad-scheduler';

export const scheduler = new ToadScheduler();

export const createTask = (
	taskName: string,
	taskFunction: (taskId: string | undefined, jobId: string | undefined) => Promise<void>,
) => {
	return new AsyncTask(taskName, taskFunction);
};

export const createJob = (task: AsyncTask, jobInterval: string, scheduleId: number) => {
	const schedule = jobInterval.split(' ');
	const integer = parseInt(schedule[0]);
	const unit = schedule[1];
	const jobOption = { id: `${scheduleId}`, preventOverrun: true };
	const taskOption = {
		[unit]: integer,
		runImmediately: false,
	} as SimpleIntervalSchedule;
	return new SimpleIntervalJob(taskOption, task, jobOption);
};

export const stopJob = (scheduleId: number) => {
	scheduler.stopById(`${scheduleId}`);
	return scheduler.getById(`${scheduleId}`).getStatus();
};

export const startJob = (scheduleId: number) => {
	if (scheduler.existsById(`${scheduleId}`)) {
		scheduler.startById(`${scheduleId}`);
		return scheduler.getById(`${scheduleId}`).getStatus();
	} else {
		throw new Error('Job not found');
	}
};

export const removeJob = (scheduleId: number) => {
	if (scheduler.existsById(`${scheduleId}`)) {
		scheduler.removeById(`${scheduleId}`);
		return;
	} else {
		throw new Error('Job not found');
	}
};

export const getJobStatus = (scheduleId: number) => {
	if (scheduler.existsById(`${scheduleId}`)) {
		return scheduler.getById(`${scheduleId}`).getStatus();
	} else {
		throw new Error('Job not found');
	}
};

export const updateJobInterval = (scheduleId: number, jobInterval: string, task: AsyncTask) => {
	if (scheduler.existsById(`${scheduleId}`)) {
		scheduler.removeById(`${scheduleId}`);
	}
	const schedule = jobInterval.split(' ');
	const integer = parseInt(schedule[0]);
	const unit = schedule[1];
	const jobOption = { id: `${scheduleId}`, preventOverrun: true };
	const taskOption = {
		[unit]: integer,
		runImmediately: false,
	} as SimpleIntervalSchedule;
	return new SimpleIntervalJob(taskOption, task, jobOption);
};
